import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useEvents } from '../../hooks/useEvents';
import { Loading } from '../../components/Loading/Loading';
import { EventFormModal, EventFormData } from '../../components/EventFormModal/EventFormModal';
import { useNotification } from '../../contexts/NotificationContext';
import styles from './MyEvents.module.scss';

const categoryLabels: Record<string, string> = {
  'концерт': 'Концерт',
  'лекция': 'Лекция',
  'выставка': 'Выставка'
};

const MyEvents: React.FC = () => {
  const { user } = useAuth();
  const { events, loading, error, fetchEvents, deleteEvent, createEvent, updateEvent } = useEvents();
  const { addNotification } = useNotification();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventFormData | null>(null);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const myEvents = events.filter(event => event.userId === user?.id);

  const handleCreateEvent = async (data: EventFormData) => {
    try {
      await createEvent({
        ...data,
        date: new Date(data.date).toISOString()
      });
      await fetchEvents();
      setIsModalOpen(false);
      addNotification('Событие успешно создано', 'success');
    } catch (error) {
      console.error('Failed to create event:', error);
      addNotification('Ошибка при создании события', 'error');
    }
  };

  const handleEditEvent = async (data: EventFormData) => {
    if (!editingEvent?.id) {
      addNotification('Ошибка: не найден ID события', 'error');
      return;
    }
    
    try {
      await updateEvent(editingEvent.id, {
        ...data,
        date: new Date(data.date).toISOString()
      });
      await fetchEvents();
      setEditingEvent(null);
      setIsModalOpen(false);
      addNotification('Событие успешно обновлено', 'success');
    } catch (error) {
      console.error('Failed to update event:', error);
      addNotification('Ошибка при обновлении события', 'error');
    }
  };

  const handleDeleteEvent = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить это событие?')) {
      try {
        await deleteEvent(id);
        await fetchEvents();
        addNotification('Событие успешно удалено', 'success');
      } catch (error) {
        console.error('Failed to delete event:', error);
        addNotification('Ошибка при удалении события', 'error');
      }
    }
  };

  const handleOpenCreateModal = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (event: any) => {
    setEditingEvent({
      id: event.id,
      title: event.title,
      description: event.description,
      date: new Date(event.date).toISOString().split('T')[0],
      category: event.category || ''
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
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
          onClick={handleOpenCreateModal}
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
              <div className={styles.eventMeta}>
                {event.category && (
                  <span className={styles.category}>
                    {categoryLabels[event.category] || event.category}
                  </span>
                )}
                <span className={styles.date}>
                  {new Date(event.date).toLocaleDateString('ru-RU')}
                </span>
              </div>
              <div className={styles.actions}>
                <button 
                  onClick={() => handleOpenEditModal(event)}
                  className={styles.editButton}
                >
                  Редактировать
                </button>
                <button 
                  onClick={() => handleDeleteEvent(event.id)}
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

      <EventFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={editingEvent ? handleEditEvent : handleCreateEvent}
        initialData={editingEvent || undefined}
        mode={editingEvent ? 'edit' : 'create'}
      />
    </div>
  );
};

export default MyEvents;