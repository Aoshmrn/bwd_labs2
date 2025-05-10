import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { updateUserProfile } from '../../api/userService';
import styles from './Profile.module.scss';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { addNotification } = useNotification();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    middleName: user?.middleName || '',
    email: user?.email || '',
    gender: user?.gender || '',
    birthDate: user?.birthDate || '',
  });

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      const updatedUser = await updateUserProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        middleName: formData.middleName,
        gender: formData.gender as 'male' | 'female' | 'other',
        birthDate: formData.birthDate
      });
      updateUser(updatedUser);
      addNotification('Профиль успешно обновлен', 'success');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      addNotification('Не удалось обновить профиль', 'error');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.profile}>
        <h1>Профиль</h1>
        <div className={styles.profileInfo}>
          <div className={styles.avatar}>
            {user.firstName && user.firstName[0].toUpperCase()}
          </div>
          <div className={styles.info}>
            <p><strong>Имя:</strong> {user.firstName}</p>
            <p><strong>Фамилия:</strong> {user.lastName}</p>
            <p><strong>Отчество:</strong> {user.middleName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Пол:</strong> {user.gender}</p>
            <p><strong>Дата рождения:</strong> {user.birthDate}</p>
            <p><strong>Роль:</strong> {user.role}</p>
          </div>
        </div>
        <button className={styles.editButton} onClick={handleEdit}>
          Редактировать
        </button>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Редактировать профиль</h2>
              <button className={styles.closeButton} onClick={handleCloseModal}>×</button>
            </div>
            <form onSubmit={handleSubmit} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label>Имя</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Фамилия</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Отчество</label>
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Пол</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Выберите пол</option>
                  <option value="male">Мужской</option>
                  <option value="female">Женский</option>
                  <option value="other">Другой</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Дата рождения</label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.modalActions}>
                <button type="submit" className={styles.submitButton}>
                  Сохранить
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className={styles.cancelButton}
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;