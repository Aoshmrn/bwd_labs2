import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Login.module.scss';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, error: authError, loading, user, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (user) navigate('/');
    if (clearError) clearError();
  }, [user, navigate, clearError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email.trim()) {
      setError('Введите email');
      return;
    }

    if (!formData.password.trim()) {
      setError('Введите пароль');
      return;
    }

    try {
      await login({
        email: formData.email.trim(),
        password: formData.password
      });
    } catch (err: any) {
      setError(typeof err === 'string' ? err : (authError || 'Ошибка при входе в систему'));
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Вход</h2>
        {error && <div className={styles.error}>{error}</div>}
        
        <div className={styles.formGroup}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Вход...' : 'Войти'}
        </button>
        <Link to="/register" className={styles.link}>
          Нет аккаунта? Зарегистрироваться
        </Link>
      </form>
    </div>
  );
};

export default Login;