import React, { useState, useEffect } from 'react';
import { useEvents } from '../../hooks/useEvents';
import { Loading } from '../../components/Loading/Loading';
import styles from './Events.module.scss';

const Events: React.FC = () => {
  const { events, loading, error, fetchEvents } = useEvents();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const filteredEvents = events
    .filter(event => 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return a.title.localeCompare(b.title);
    });

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>События</h1>
        <div className={styles.filters}>
          <input
            type="text"
            placeholder="Поиск событий..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'title')}
            className={styles.filter}
          >
            <option value="date">По дате</option>
            <option value="title">По названию</option>
          </select>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.eventsList}>
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div key={event.id} className={styles.eventCard}>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <div className={styles.eventMeta}>
                <span className={styles.date}>
                  {new Date(event.date).toLocaleDateString('ru-RU')}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noEvents}>
            {searchTerm ? 'События не найдены' : 'Нет доступных событий'}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;