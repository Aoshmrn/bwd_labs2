import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Profile.module.scss';

const Profile: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.profile}>
        <h1>Профиль</h1>
        <div className={styles.profileInfo}>
          <div className={styles.avatar}>
            {user.username[0].toUpperCase()}
          </div>
          <div className={styles.info}>
            <p><strong>Имя пользователя:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;