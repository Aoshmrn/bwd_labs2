import baseApi from './baseApi';

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  category: string;
  createdBy: number;
}

export interface CreateEventData {
  title: string;
  description?: string;
  date: string;
  category?: string;
}

export const getAllEvents = async () => {
  try {
    const response = await baseApi.get<Event[]>('/events');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch events:', error);
    throw error;
  }
};

export const getEventById = async (id: number) => {
  try {
    const response = await baseApi.get<Event>(`/events/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch event ${id}:`, error);
    throw error;
  }
};

export const createEvent = async (data: CreateEventData) => {
  try {
    const eventData = {
      ...data,
      description: data.description || '',
      category: data.category || ''
    };
    
    const response = await baseApi.post<Event>('/events', eventData);
    return response.data;
  } catch (error) {
    console.error('Failed to create event:', error);
    throw error;
  }
};

export const updateEvent = async (id: number, data: Partial<CreateEventData>) => {
  try {
    const response = await baseApi.put<Event>(`/events/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Failed to update event ${id}:`, error);
    throw error;
  }
};

export const deleteEvent = async (id: number) => {
  try {
    await baseApi.delete(`/events/${id}`);
  } catch (error) {
    console.error(`Failed to delete event ${id}:`, error);
    throw error;
  }
};