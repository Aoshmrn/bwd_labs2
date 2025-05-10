import React from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '../Modal/Modal';
import styles from './EventFormModal.module.scss';

type EventCategory = 'концерт' | 'лекция' | 'выставка';

export interface EventFormData {
  id?: number;
  title: string;
  description: string;
  date: string;
  category: EventCategory | '';
}

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EventFormData) => void;
  initialData?: EventFormData;
  mode: 'create' | 'edit';
}

export const EventFormModal: React.FC<EventFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode
}) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset 
  } = useForm<EventFormData>({
    defaultValues: initialData || {
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      category: ''
    }
  });

  React.useEffect(() => {
    if (mode === 'create') {
      reset({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        category: ''
      });
    } else if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset, mode]);

  const onFormSubmit = async (data: EventFormData) => {
    onSubmit(data);
    onClose();
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Создание события' : 'Редактирование события'}
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Название*</label>
          <input
            id="title"
            type="text"
            {...register('title', { 
              required: 'Название обязательно',
              minLength: { value: 3, message: 'Минимальная длина - 3 символа' },
              maxLength: { value: 100, message: 'Максимальная длина - 100 символов' }
            })}
            className={errors.title ? styles.error : ''}
          />
          {errors.title && <span className={styles.errorText}>{errors.title.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Описание</label>
          <textarea
            id="description"
            {...register('description', {
              maxLength: { value: 1000, message: 'Максимальная длина - 1000 символов' }
            })}
            rows={5}
            className={errors.description ? styles.error : ''}
          />
          {errors.description && <span className={styles.errorText}>{errors.description.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="date">Дата*</label>
          <input
            id="date"
            type="date"
            min={minDate}
            {...register('date', { 
              required: 'Дата обязательна',
              validate: value => 
                new Date(value) >= new Date(minDate) || 'Дата не может быть раньше текущей'
            })}
            className={errors.date ? styles.error : ''}
          />
          {errors.date && <span className={styles.errorText}>{errors.date.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="category">Категория</label>
          <select 
            id="category" 
            {...register('category')}
            className={errors.category ? styles.error : ''}
          >
            <option value="">Выберите категорию</option>
            <option value="концерт">Концерт</option>
            <option value="лекция">Лекция</option>
            <option value="выставка">Выставка</option>
          </select>
          {errors.category && <span className={styles.errorText}>{errors.category.message}</span>}
        </div>

        <div className={styles.actions}>
          <button type="button" onClick={onClose} className={styles.cancelButton}>
            Отмена
          </button>
          <button type="submit" className={styles.submitButton}>
            {mode === 'create' ? 'Создать' : 'Сохранить'}
          </button>
        </div>
      </form>
    </Modal>
  );
}; 