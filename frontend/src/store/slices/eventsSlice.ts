import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { api } from '../../api';

interface Event {
  id: number;
  title: string;
  description?: string;
  date: string;
  category?: 'концерт' | 'лекция' | 'выставка';
  createdBy: number;
}

interface EventsState {
  items: Event[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: EventsState = {
  items: [],
  status: 'idle',
  error: null,
};

export const getEventById = createAsyncThunk(
  'events/getEventById',
  async (id: number) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  }
);

export const createEvent = createAsyncThunk(
  'events/createEvent',
  async (eventData: Omit<Event, 'id' | 'createdBy'>) => {
    const response = await api.post('/events', eventData);
    return response.data;
  }
);

export const updateEvent = createAsyncThunk(
  'events/updateEvent',
  async ({ id, ...eventData }: Partial<Event> & { id: number }) => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  }
);

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getEventById
      .addCase(getEventById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getEventById.fulfilled, (state, action: PayloadAction<Event>) => {
        state.status = 'succeeded';
        const index = state.items.findIndex(event => event.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        } else {
          state.items.push(action.payload);
        }
      })
      .addCase(getEventById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Не удалось загрузить событие';
      })
      // createEvent
      .addCase(createEvent.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Не удалось создать событие';
      })
      // updateEvent
      .addCase(updateEvent.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        state.status = 'succeeded';
        const index = state.items.findIndex(event => event.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Не удалось обновить событие';
      });
  },
});

export const selectEvents = (state: RootState) => state.events.items;
export const selectEventById = (id: number) => (state: RootState) =>
  state.events.items.find(event => event.id === id);

export default eventsSlice.reducer; 