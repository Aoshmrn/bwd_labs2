import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Loading } from '../../components/Loading/Loading';
import { getAllUsers, User } from '../../api/userService';
import styles from './Users.module.scss';

const Users: React.FC = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getAllUsers();
        setUsers(data);
        setLoading(false);
      } catch (err) {
        setError('Ошибка при загрузке пользователей');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <h1>Пользователи</h1>
      
      {error && <div className={styles.error}>{error}</div>}
      
      <div className={styles.usersList}>
        <div className={styles.usersHeader}>
          <div className={styles.name}>Имя</div>
          <div className={styles.email}>Email</div>
          <div className={styles.role}>Роль</div>
        </div>
        
        {users.length > 0 ? (
          users.map(user => (
            <div key={user.id} className={styles.userItem}>
              <div className={styles.name}>{user.name}</div>
              <div className={styles.email}>{user.email}</div>
              <div className={styles.role}>
                <span className={user.role === 'admin' ? styles.adminBadge : styles.userBadge}>
                  {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noUsers}>Пользователи не найдены</div>
        )}
      </div>
    </div>
  );
};

export default Users; 