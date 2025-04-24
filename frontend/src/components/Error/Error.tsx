import React from 'react';
import styles from './Error.module.scss';

interface ErrorProps {
  message: string;
}

const Error = ({ message }: ErrorProps) => {
  return (
    <div className={styles.error}>
      {message}
    </div>
  );
};

export default Error;