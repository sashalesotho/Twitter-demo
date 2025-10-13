import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  subscribeUser,
  unsubscribeUser,
  removeFollower,
} from './subscriptionSlice.js';

export const fetchUserFollowers = createAsyncThunk(
  'userFollowers/fetchUserFollowers',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/profile/${userId}/followers`, {
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

const userFollowersSlice = createSlice({
  name: 'userFollowers',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserFollowers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserFollowers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchUserFollowers.rejected, (state, action) => {
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
      })
      .addCase(removeFollower.fulfilled, (state, action) => {
        const fid = action.payload?.followerId;
        if (fid) state.items = state.items.filter((u) => String(u.id) !== String(fid));
      });
  },
});

export default userFollowersSlice.reducer;
