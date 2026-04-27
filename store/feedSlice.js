import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../src/config';

export const fetchFeed = createAsyncThunk(
  'feed/fetchFeed',
  async (_, { rejectWithValue }) => {
    try {
      console.log('API_URL:', API_URL);
      const res = await fetch(`${API_URL}/feed`, { credentials: 'include' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return rejectWithValue(data.error || 'Ошибка при получении фида');
      
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const feedSlice = createSlice({
  name: 'feed',
  initialState: {
    posts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(action.payload)) {
          state.loading = false;
          console.log('feed payload:', action.payload)
          state.posts = action.payload || [];
        } else if (Array.isArray(action.payload?.posts)) {
          state.posts = action.payload.posts;
        } else {
          state.posts = [];
        }
        
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default feedSlice.reducer;
