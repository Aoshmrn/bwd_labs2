import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Home.module.scss';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className={styles.home}>
      <h1>Добро пожаловать в Events</h1>
      <p className={styles.description}>
        Создавайте и управляйте вашими событиями
      </p>
      <div className={styles.actions}>
        <Link to="/events" className={`${styles.button} ${styles.primary}`}>
          Просмотр событий
        </Link>
        {user ? (
          <Link to="/my-events" className={`${styles.button} ${styles.secondary}`}>
            Мои события
          </Link>
        ) : (
          <Link to="/login" className={`${styles.button} ${styles.secondary}`}>
            Войти
          </Link>
        )}
      </div>
    </div>
  );
};

export default Home;