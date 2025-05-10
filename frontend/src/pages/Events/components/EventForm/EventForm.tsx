import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from '../../../../store/hooks';
import { createEvent, updateEvent, getEventById } from '../../../../store/slices/eventsSlice';
import { useNotification } from '../../../../contexts/NotificationContext';
import { Loading } from '../../../../components/Loading/Loading';
import styles from './styles.module.scss';

type EventCategory = 'концерт' | 'лекция' | 'выставка';

interface EventFormData {
  title: string;
  description: string;
  date: string;
  category: EventCategory | '';
}

const EventForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { addNotification } = useNotification();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<EventFormData>();
  const isEditing = Boolean(id);

  // Fetch event data if editing
  useEffect(() => {
    if (id) {
      dispatch(getEventById(parseInt(id, 10)))
        .unwrap()
        .then((event) => {
          reset({
            title: event.title,
            description: event.description || '',
            date: new Date(event.date).toISOString().split('T')[0],
            category: event.category as EventCategory || ''
          });
        })
        .catch((error) => {
          addNotification('Ошибка при загрузке события', 'error');
          navigate('/my-events');
        });
    }
  }, [id, dispatch, reset, navigate, addNotification]);

  const onSubmit = async (data: EventFormData) => {
    try {
      const eventData = {
        ...data,
        date: new Date(data.date).toISOString(),
        category: data.category || undefined,
      };

      if (isEditing && id) {
        await dispatch(updateEvent({ 
          id: parseInt(id, 10), 
          title: eventData.title,
          description: eventData.description,
          date: eventData.date,
          category: eventData.category
        })).unwrap();
        addNotification('Событие успешно обновлено', 'success');
      } else {
        await dispatch(createEvent(eventData)).unwrap();
        addNotification('Событие успешно создано', 'success');
      }
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
      <h1>{isEditing ? 'Редактирование события' : 'Создание нового события'}</h1>
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

        <div className={styles.actions}>
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
            {isEditing ? 'Сохранить' : 'Создать'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;