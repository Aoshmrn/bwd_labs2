import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useEvents } from '../../hooks/useEvents';
import { Modal } from '../../components/Modal/Modal';
import { EventForm } from '../../components/EventForm/EventForm';
import { Loading } from '../../components/Loading/Loading';
import styles from './MyEvents.module.scss';

interface EventFormData {
  title: string;
  description: string;
  date: string;
  category?: string;
}

const MyEvents: React.FC = () => {
  const { user } = useAuth();
  const { events, loading, error, fetchEvents, createEvent, updateEvent, deleteEvent } = useEvents();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Filter events to show only the current user's events
  const myEvents = events.filter(event => event.userId === user?.id);

  const handleCreateEvent = async (data: EventFormData) => {
    try {
      await createEvent(data);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  const handleEditEvent = async (data: EventFormData) => {
    if (editingEvent) {
      try {
        await updateEvent(editingEvent.id, data);
        setEditingEvent(null);
      } catch (error) {
        console.error('Failed to update event:', error);
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteEvent(id);
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  const handleEdit = (event: any) => {
    setEditingEvent(event);
  };

  if (loading && events.length === 0) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Мои события</h1>
      </div>
      
      <div className={styles.createButtonContainer}>
        <button 
          className={styles.createButton}
          onClick={() => setIsModalOpen(true)}
        >
          Создать событие
        </button>
      </div>
      
      {error && <div className={styles.error}>{error}</div>}
      
      <div className={styles.eventsList}>
        {myEvents.length > 0 ? (
          myEvents.map((event) => (
            <div key={event.id} className={styles.eventCard}>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              {event.category && (
                <span className={styles.category}>
                  {event.category}
                </span>
              )}
              <p className={styles.date}>
                {new Date(event.date).toLocaleDateString('ru-RU')}
              </p>
              <div className={styles.actions}>
                <button onClick={() => handleEdit(event)} className={styles.editButton}>
                  Редактировать
                </button>
                <button 
                  onClick={() => handleDelete(event.id)}
                  className={styles.deleteButton}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.noEvents}>У вас пока нет событий</p>
        )}
      </div>

      <Modal
        isOpen={isModalOpen || !!editingEvent}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEvent(null);
        }}
        title={editingEvent ? 'Редактировать событие' : 'Создать событие'}
      >
        <EventForm
          initialData={editingEvent || undefined}
          onSubmit={editingEvent ? handleEditEvent : handleCreateEvent}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingEvent(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default MyEvents;