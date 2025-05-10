import React, { useState, useEffect } from 'react';
import { useEvents } from '../../hooks/useEvents';
import { Loading } from '../../components/Loading/Loading';
import styles from './Events.module.scss';

const categoryLabels: Record<string, string> = {
  'концерт': 'Концерт',
  'лекция': 'Лекция',
  'выставка': 'Выставка'
};

const allCategories = ['концерт', 'лекция', 'выставка'];

const Events: React.FC = () => {
  const { events, loading, error, fetchEvents } = useEvents();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const filteredEvents = events
    .filter(event => 
      (searchTerm === '' || 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      ) && 
      (categoryFilter === '' || event.category === categoryFilter)
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return a.title.localeCompare(b.title);
    });

  // Count events per category for displaying in dropdown
  const eventsByCategory: Record<string, number> = {};
  allCategories.forEach(category => {
    eventsByCategory[category] = events.filter(event => event.category === category).length;
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
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={styles.filter}
          >
            <option value="">Все категории</option>
            {allCategories.map(category => (
              <option key={category} value={category}>
                {categoryLabels[category]} ({eventsByCategory[category] || 0})
              </option>
            ))}
          </select>
          
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
                {event.category && (
                  <span className={styles.category}>
                    {categoryLabels[event.category] || event.category}
                  </span>
                )}
                <span className={styles.date}>
                  {new Date(event.date).toLocaleDateString('ru-RU')}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noEvents}>
            {categoryFilter ? `События категории "${categoryLabels[categoryFilter]}" не найдены` : 
             searchTerm ? 'События не найдены' : 'Нет доступных событий'}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;