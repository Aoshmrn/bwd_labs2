import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Event } from '../../types/event';
import { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent } from '../../api/eventService';

interface EventsState {
  items: Event[];
  selectedEvent: Event | null;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
}

const initialState: EventsState = {
  items: [],
  selectedEvent: null,
  isLoading: false,
  isError: false,
  errorMessage: null
};

// Async thunks
export const fetchEvents = createAsyncThunk(
  'events/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllEvents();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch events');
    }
  }
);

export const fetchEventById = createAsyncThunk(
  'events/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await getEventById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch event');
    }
  }
);

export const addEvent = createAsyncThunk(
  'events/add',
  async (eventData: Omit<Event, 'id'>, { rejectWithValue }) => {
    try {
      const response = await createEvent(eventData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create event');
    }
  }
);

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    clearSelectedEvent: (state) => {
      state.selectedEvent = null;
    },
    clearError: (state) => {
      state.isError = false;
      state.errorMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all events
      .addCase(fetchEvents.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      })
      // Fetch single event
      .addCase(fetchEventById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedEvent = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      })
      // Add new event
      .addCase(addEvent.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(addEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.push(action.payload);
      })
      .addCase(addEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      });
  }
});

export const { clearSelectedEvent, clearError } = eventsSlice.actions;
export default eventsSlice.reducer; 