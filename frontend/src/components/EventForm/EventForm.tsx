import React, { useState, useEffect } from 'react';
import styles from './EventForm.module.scss';

interface EventFormData {
  title: string;
  description: string;
  date: string;
  category: string;
}

interface EventFormProps {
  initialData?: EventFormData;
  onSubmit: (data: EventFormData) => void;
  onCancel: () => void;
}

export const EventForm: React.FC<EventFormProps> = ({
  initialData,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    category: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="title">Название</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description">Описание</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="category">Категория</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="">Не выбрано</option>
          <option value="концерт">Концерт</option>
          <option value="лекция">Лекция</option>
          <option value="выставка">Выставка</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="date">Дата</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.actionsContainer}>
        <div className={styles.actions}>
          <button type="submit">
            {initialData ? 'Сохранить' : 'Создать'}
          </button>
          <button type="button" onClick={onCancel} className={styles.cancelButton}>
            Отмена
          </button>
        </div>
      </div>
    </form>
  );
};