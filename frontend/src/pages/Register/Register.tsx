import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { register } from '../../api/authService';
import styles from './Register.module.scss';

interface RegisterForm {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: 'male' | 'female' | 'other';
  birthDate: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState<RegisterForm>({
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: 'male',
    birthDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    // Validate birth date
    const birthDate = new Date(formData.birthDate);
    if (isNaN(birthDate.getTime()) || birthDate >= new Date()) {
      setError('Некорректная дата рождения');
      return;
    }

    try {
      setLoading(true);
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        middleName: formData.middleName,
        email: formData.email,
        password: formData.password,
        gender: formData.gender,
        birthDate: formData.birthDate
      });
      
      await login({
        email: formData.email,
        password: formData.password
      });
      
      navigate('/');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Регистрация</h2>
        {error && <div className={styles.error}>{error}</div>}
        
        <div className={styles.formGroup}>
          <input
            type="text"
            name="lastName"
            placeholder="Фамилия"
            value={formData.lastName}
            onChange={handleChange}
            required
            minLength={2}
            maxLength={50}
          />
        </div>

        <div className={styles.formGroup}>
          <input
            type="text"
            name="firstName"
            placeholder="Имя"
            value={formData.firstName}
            onChange={handleChange}
            required
            minLength={2}
            maxLength={50}
          />
        </div>

        <div className={styles.formGroup}>
          <input
            type="text"
            name="middleName"
            placeholder="Отчество"
            value={formData.middleName}
            onChange={handleChange}
            required
            minLength={2}
            maxLength={50}
          />
        </div>

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
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className={styles.select}
          >
            <option value="male">Мужской</option>
            <option value="female">Женский</option>
            <option value="other">Другой</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            required
            max={new Date().toISOString().split('T')[0]}
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

        <div className={styles.formGroup}>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Подтвердите пароль"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
        <Link to="/login" className={styles.link}>
          Уже есть аккаунт? Войти
        </Link>
      </form>
    </div>
  );
};

export default Register;