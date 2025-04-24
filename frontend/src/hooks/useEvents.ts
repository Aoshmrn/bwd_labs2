import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  userId: number;
}

export const useEvents = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      // Mock data
      const mockEvents: Event[] = [
        {
          id: 1,
          title: 'Событие 1',
          description: 'Описание события 1',
          date: '2024-03-20',
          userId: user?.id || 0
        }
      ];
      setEvents(mockEvents);
    } catch (err) {
      setError('Ошибка при загрузке событий');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createEvent = useCallback(async (eventData: Omit<Event, 'id' | 'userId'>) => {
    try {
      setLoading(true);
      setError(null);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const newEvent: Event = {
        ...eventData,
        id: Date.now(),
        userId: user?.id || 0
      };
      setEvents(prev => [...prev, newEvent]);
      return newEvent;
    } catch (err) {
      setError('Ошибка при создании события');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateEvent = useCallback(async (id: number, eventData: Partial<Event>) => {
    try {
      setLoading(true);
      setError(null);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setEvents(prev =>
        prev.map(event =>
          event.id === id ? { ...event, ...eventData } : event
        )
      );
    } catch (err) {
      setError('Ошибка при обновлении события');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteEvent = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setEvents(prev => prev.filter(event => event.id !== id));
    } catch (err) {
      setError('Ошибка при удалении события');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent
  };
};