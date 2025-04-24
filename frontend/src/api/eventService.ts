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
  description: string;
  date: string;
  category: string;
}

export const getAllEvents = async () => {
  try {
    const response = await baseApi.get<Event[]>('/api/events');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch events:', error);
    throw error;
  }
};

export const getEventById = async (id: number) => {
  try {
    const response = await baseApi.get<Event>(`/api/events/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch event ${id}:`, error);
    throw error;
  }
};

export const createEvent = async (data: CreateEventData) => {
  try {
    const response = await baseApi.post<Event>('/api/events', data);
    return response.data;
  } catch (error) {
    console.error('Failed to create event:', error);
    throw error;
  }
};

export const updateEvent = async (id: number, data: Partial<CreateEventData>) => {
  try {
    const response = await baseApi.put<Event>(`/api/events/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Failed to update event ${id}:`, error);
    throw error;
  }
};

export const deleteEvent = async (id: number) => {
  try {
    await baseApi.delete(`/api/events/${id}`);
  } catch (error) {
    console.error(`Failed to delete event ${id}:`, error);
    throw error;
  }
};