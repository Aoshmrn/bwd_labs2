import React from 'react';
import { usePagination } from '../../hooks/usePagination';
import styles from './Pagination.module.scss';

interface PaginationProps {
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
}) => {
  const paginationRange = usePagination({
    totalCount,
    pageSize,
    currentPage,
  });

  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  const lastPage = paginationRange[paginationRange.length - 1];

  return (
    <ul className={styles.pagination}>
      <li
        className={`${styles.item} ${currentPage === 1 ? styles.disabled : ''}`}
        onClick={onPrevious}
      >
        &lt;
      </li>
      {paginationRange.map((pageNumber, index) => {
        if (pageNumber === 'DOTS') {
          return (
            <li key={`dots-${index}`} className={`${styles.item} ${styles.dots}`}>
              &#8230;
            </li>
          );
        }

        return (
          <li
            key={pageNumber}
            className={`${styles.item} ${
              pageNumber === currentPage ? styles.selected : ''
            }`}
            onClick={() => onPageChange(pageNumber as number)}
          >
            {pageNumber}
          </li>
        );
      })}
      <li
        className={`${styles.item} ${
          currentPage === lastPage ? styles.disabled : ''
        }`}
        onClick={onNext}
      >
        &gt;
      </li>
    </ul>
  );
};