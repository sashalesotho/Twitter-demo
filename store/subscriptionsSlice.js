import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { unsubscribeUser } from './subscriptionSlice.js';

export const fetchSubscriptions = createAsyncThunk(
  'subscriptions/fetchSubscriptions.js',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/subscriptions', { credentials: 'include' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return rejectWithValue(data.error || 'Ошибка при получении подписок');
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const subscriptionsSlice = createSlice({
  name: 'subscriptions',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptions.pending, (state) => {
        state.loading = true; state.error = null;
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.loading = false; state.items = action.payload || [];
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.loading = false; state.error = action.payload || action.error.message;
      })

      .addCase(unsubscribeUser.fulfilled, (state, action) => {
        const userId = action.payload?.userId;
        if (userId) {
          state.items = state.items.filter((u) => String(u.id) !== String(userId));
        }
      });
  },
});

export default subscriptionsSlice.reducer;
