import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  getAllEvents, 
  createEvent as apiCreateEvent, 
  updateEvent as apiUpdateEvent, 
  deleteEvent as apiDeleteEvent,
  Event as ApiEvent,
  CreateEventData
} from '../api/eventService';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  userId: number;
  category?: string;
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
      
      const eventsData = await getAllEvents();
      const formattedEvents: Event[] = eventsData.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.date,
        category: event.category,
        userId: event.createdBy
      }));
      
      setEvents(formattedEvents);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Ошибка при загрузке событий');
    } finally {
      setLoading(false);
    }
  }, []);

  const createEvent = useCallback(async (eventData: Omit<Event, 'id' | 'userId'>) => {
    try {
      setLoading(true);
      setError(null);
      
      const createData: CreateEventData = {
        title: eventData.title,
        description: eventData.description,
        date: eventData.date,
        category: eventData.category || ''
      };
      
      const createdEvent = await apiCreateEvent(createData);
      
      const newEvent: Event = {
        id: createdEvent.id,
        title: createdEvent.title,
        description: createdEvent.description,
        date: createdEvent.date,
        category: createdEvent.category,
        userId: createdEvent.createdBy
      };
      
      setEvents(prev => [...prev, newEvent]);
      return newEvent;
    } catch (err) {
      console.error('Error creating event:', err);
      setError('Ошибка при создании события');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEvent = useCallback(async (id: number, eventData: Partial<Event>) => {
    try {
      setLoading(true);
      setError(null);
      
      const { userId, ...updateData } = eventData;
      
      await apiUpdateEvent(id, updateData);
      
      setEvents(prev =>
        prev.map(event =>
          event.id === id ? { ...event, ...eventData } : event
        )
      );
    } catch (err) {
      console.error('Error updating event:', err);
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
      
      await apiDeleteEvent(id);
      
      setEvents(prev => prev.filter(event => event.id !== id));
    } catch (err) {
      console.error('Error deleting event:', err);
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