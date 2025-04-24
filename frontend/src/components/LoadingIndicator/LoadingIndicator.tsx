import React from 'react';
import styles from './LoadingIndicator.module.scss';

interface LoadingIndicatorProps {
  fullscreen?: boolean;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ fullscreen }) => {
  return (
    <div className={`${styles.loader} ${fullscreen ? styles.fullscreen : ''}`}>
      <div className={styles.spinner}></div>
    </div>
  );
};