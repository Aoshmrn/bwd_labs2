import React, { useState, useEffect } from 'react';
import { useEvents } from '../../hooks/useEvents';
import { useAuth } from '../../contexts/AuthContext';
import { Loading } from '../../components/Loading/Loading';
import styles from './Events.module.scss';

// Category display mapping
const categoryLabels: Record<string, string> = {
  'концерт': 'Концерт',
  'лекция': 'Лекция',
  'выставка': 'Выставка'
};

// All available categories for the filter
const allCategories = ['концерт', 'лекция', 'выставка'];

const Events: React.FC = () => {
  const { user } = useAuth();
  const { events, loading, error, fetchEvents, deleteEvent } = useEvents();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleDeleteEvent = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить это событие?')) {
      try {
        await deleteEvent(id);
      } catch (error) {
        console.error('Failed to delete event:', error);
      }
    }
  };

  const isAdmin = user?.role === 'admin';

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
                {categoryLabels[category as keyof typeof categoryLabels]} ({eventsByCategory[category] || 0})
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
                {event.category ? (
                  <span className={styles.category}>
                    {categoryLabels[event.category as keyof typeof categoryLabels] || event.category}
                  </span>
                ) : null}
                <span className={styles.date}>
                  {new Date(event.date).toLocaleDateString('ru-RU')}
                </span>
              </div>
              
              {isAdmin && (
                <div className={styles.actions}>
                  <button 
                    onClick={() => handleDeleteEvent(event.id)}
                    className={styles.deleteButton}
                  >
                    Удалить
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className={styles.noEvents}>
            {categoryFilter ? `События категории "${categoryLabels[categoryFilter as keyof typeof categoryLabels]}" не найдены` : 
             searchTerm ? 'События не найдены' : 'Нет доступных событий'}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;