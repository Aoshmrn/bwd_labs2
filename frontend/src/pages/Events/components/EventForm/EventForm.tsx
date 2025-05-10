import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from '../../../../store/hooks';
import { createEvent } from '../../../../store/slices/eventsSlice';
import { useNotification } from '../../../../contexts/NotificationContext';
import styles from './styles.module.scss';

type EventCategory = 'концерт' | 'лекция' | 'выставка';

interface EventFormData {
  title: string;
  description: string;
  date: string;
  category: EventCategory | '';
}

const EventForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { addNotification } = useNotification();
  
  const { register, handleSubmit, formState: { errors } } = useForm<EventFormData>();

  const onSubmit = async (data: EventFormData) => {
    try {
      const eventData = {
        ...data,
        date: new Date(data.date).toISOString(),
        category: data.category || undefined,
      };

      await dispatch(createEvent(eventData)).unwrap();
      addNotification('Событие успешно создано', 'success');
      navigate('/my-events');
    } catch (error) {
      addNotification(
        error instanceof Error ? error.message : 'Произошла ошибка при сохранении события',
        'error'
      );
    }
  };

  return (
    <div className={styles.container}>
      <h1>Создание нового события</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Название*</label>
          <input
            id="title"
            type="text"
            {...register('title', { required: 'Название обязательно' })}
            className={errors.title ? styles.error : ''}
          />
          {errors.title && <span className={styles.errorText}>{errors.title.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Описание</label>
          <textarea
            id="description"
            {...register('description')}
            rows={5}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="date">Дата*</label>
          <input
            id="date"
            type="date"
            {...register('date', { required: 'Дата обязательна' })}
            className={errors.date ? styles.error : ''}
          />
          {errors.date && <span className={styles.errorText}>{errors.date.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="category">Категория</label>
          <select id="category" {...register('category')}>
            <option value="">Выберите категорию</option>
            <option value="концерт">Концерт</option>
            <option value="лекция">Лекция</option>
            <option value="выставка">Выставка</option>
          </select>
        </div>

        <div className={styles.buttons}>
          <button 
            type="button" 
            onClick={() => navigate(-1)} 
            className={styles.cancelButton}
          >
            Отмена
          </button>
          <button 
            type="submit" 
            className={styles.submitButton}
          >
            Создать
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;