import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Modal } from '../../components/Modal/Modal';
import { EventForm } from '../../components/EventForm/EventForm';
import styles from './MyEvents.module.scss';

const MyEvents: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const handleCreateEvent = (data: Omit<Event, 'id' | 'userId'>) => {
    const newEvent = {
      ...data,
      id: Date.now(),
      userId: user?.id || 0,
    };
    setEvents([...events, newEvent]);
    setIsModalOpen(false);
  };

  const handleEditEvent = (data: Omit<Event, 'id' | 'userId'>) => {
    if (editingEvent) {
      setEvents(events.map(event =>
        event.id === editingEvent.id
          ? { ...event, ...data }
          : event
      ));
      setEditingEvent(null);
    }
  };

  const handleDelete = (id: number) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Мои события</h1>
        <button 
          className={styles.createButton}
          onClick={() => setIsModalOpen(true)}
        >
          Создать событие
        </button>
      </div>
      
      <div className={styles.eventsList}>
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className={styles.eventCard}>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p className={styles.date}>{event.date}</p>
              <div className={styles.actions}>
                <button onClick={() => handleEdit(event)}>
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