import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const subscribeUser = createAsyncThunk(
  'subscription/subscribeUser',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/subscriptions/${userId}`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return rejectWithValue(data.error || 'Ошибка при подписке');
      return { userId, ...data };
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  },
);

export const unsubscribeUser = createAsyncThunk(
  'subscription/unsubscribeUser',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/subscriptions/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return rejectWithValue(data.error || 'Ошибка при отписке');
      return { userId, ...data };
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  },
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState: {
    loading: false,
    error: null,
    // lastAction: объект { type: 'subscribe'|'unsubscribe', userId: number } или null
    lastAction: null,
  },
  reducers: {
    // при желании можно добавить resetError/resetLastAction
    resetSubscriptionError(state) {
      state.error = null;
    },
    clearLastAction(state) {
      state.lastAction = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // SUBSCRIBE
      .addCase(subscribeUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(subscribeUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // action.payload должен содержать { userId, subscribed, already, ... }
        const userId = action.payload?.userId ?? null;
        state.lastAction = userId ? { type: 'subscribe', userId } : { type: 'subscribe' };
      })
      .addCase(subscribeUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || 'Ошибка при подписке';
        state.lastAction = null;
      })

      // UNSUBSCRIBE
      .addCase(unsubscribeUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unsubscribeUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const userId = action.payload?.userId ?? null;
        state.lastAction = userId ? { type: 'unsubscribe', userId } : { type: 'unsubscribe' };
      })
      .addCase(unsubscribeUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || 'Ошибка при отписке';
        state.lastAction = null;
      });
  },
});

export const { resetSubscriptionError, clearLastAction } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
