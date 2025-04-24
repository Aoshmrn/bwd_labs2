import React from 'react';
import styles from './SkipToMain.module.scss';

export const SkipToMain = () => {
  return (
    <a href="#main-content" className={styles.skipLink}>
      Skip to main content
    </a>
  );
};