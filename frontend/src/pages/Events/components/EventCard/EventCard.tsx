import React from 'react';
import styles from './EventCard.module.scss';

interface EventCardProps {
  event: {
    id: number;
    title: string;
    description: string;
    date: string;
  };
  onEdit?: () => void;
  onDelete?: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onEdit, onDelete }) => {
  return (
    <div className={styles.card}>
      <h3>{event.title}</h3>
      <p>{event.description}</p>
      <p>Дата: {event.date}</p>
      {onEdit && <button onClick={onEdit}>Редактировать</button>}
      {onDelete && <button onClick={onDelete}>Удалить</button>}
    </div>
  );
};

export default EventCard;