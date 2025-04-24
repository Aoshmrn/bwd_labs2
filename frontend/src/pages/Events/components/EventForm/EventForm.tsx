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
    resetForm
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
        resetForm();
        onSuccess();
      } catch (err) {
        showToast('Failed to create event', 'error');
        throw err;
      }
    },
  });

  if (loading) return <LoadingSpinner />;

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
          onChange={handleChange}
          required
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
        <input
          type="text"
          name="category"
          placeholder="Event Category"
          value={formData.category}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Event'}
      </button>
    </form>
  );
};

export default EventForm;