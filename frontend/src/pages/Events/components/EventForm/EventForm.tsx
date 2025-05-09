import React from 'react';
import styles from './EventForm.module.scss';
import { createEvent } from '../../../../api/eventService';
import { useForm } from '../../../../hooks/useForm';
import { useToast } from '../../../../context/ToastContext';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import Error from '../../../../components/Error/Error';

interface EventFormProps {
  onSuccess: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ onSuccess }) => {
  const { showToast } = useToast();
  const {
    formData,
    loading,
    error,
    handleChange,
    handleSubmit,
    setFormData
  } = useForm({
    initialState: {
      title: '',
      description: '',
      date: '',
      category: '',
    },
    onSubmit: async (data) => {
      try {
        await createEvent(data);
        showToast('Event created successfully', 'success');
        setFormData({
          title: '',
          description: '',
          date: '',
          category: '',
        });
        onSuccess();
      } catch (err) {
        showToast('Failed to create event', 'error');
        throw err;
      }
    },
  });

  if (loading) return <LoadingSpinner />;

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleChange(e as any);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleChange(e as any);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <Error message={error} />}
      <h2>Create New Event</h2>
      <div className={styles.formGroup}>
        <input
          type="text"
          name="title"
          placeholder="Event Title"
          value={formData.title}
          onChange={handleChange}
          required
          minLength={3}
        />
      </div>
      <div className={styles.formGroup}>
        <textarea
          name="description"
          placeholder="Event Description"
          value={formData.description}
          onChange={handleTextAreaChange}
          minLength={10}
        />
      </div>
      <div className={styles.formGroup}>
        <input
          type="datetime-local"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <select
          name="category"
          value={formData.category}
          onChange={handleSelectChange}
        >
          <option value="">Не выбрано</option>
          <option value="концерт">Концерт</option>
          <option value="лекция">Лекция</option>
          <option value="выставка">Выставка</option>
        </select>
      </div>
      <div className={styles.buttonContainer}>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Event'}
        </button>
      </div>
    </form>
  );
};

export default EventForm;