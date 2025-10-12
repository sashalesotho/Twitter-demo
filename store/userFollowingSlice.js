import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { subscribeUser, unsubscribeUser } from './subscriptionSlice.js';

export const fetchUserFollowing = createAsyncThunk(
  'userFollowing/fetchUserFollowing',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/profile/${userId}/following`, {
        credentials: 'include',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return rejectWithValue(data.error || 'Ошибка при получении списка');
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const userFollowingSlice = createSlice({
  name: 'userFollowing',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserFollowing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserFollowing.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchUserFollowing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(subscribeUser.fulfilled, (state, action) => {
        const id = action.payload?.userId;
        state.items = state.items.map((u) => (String(u.id) === String(id)
          ? { ...u, isSubscribed: true } : u));
      })
      .addCase(unsubscribeUser.fulfilled, (state, action) => {
        const id = action.payload?.userId;
        state.items = state.items.map((u) => (String(u.id) === String(id)
          ? { ...u, isSubscribed: false } : u));
      });
  },
});

export default userFollowingSlice.reducer;
