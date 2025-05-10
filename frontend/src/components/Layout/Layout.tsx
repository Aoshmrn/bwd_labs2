import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from '../Navigation/Navigation';
import styles from './Layout.module.scss';

export const Layout: React.FC = () => {
  return (
    <div className={styles.layout}>
      <Navigation />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}; 