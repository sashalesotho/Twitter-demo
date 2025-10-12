import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { fetchFeed } from './feedSlice.js';
import {
  subscribeUser,
  unsubscribeUser,
  removeFollower,
} from './subscriptionSlice.js';

export const fetchFollowers = createAsyncThunk(
  'followers/fetchFollowers',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/followers', { credentials: 'include' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return rejectWithValue(
          data.error || 'Ошибка при получении подписчиков',
        );
      }
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const followersSlice = createSlice({
  name: 'followers',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFollowers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFollowers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchFollowers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // если мы подписались на кого-то из списка — можно сразу пометить (опционально)
      .addCase(subscribeUser.fulfilled, (state, action) => {
        const id = action.payload?.userId;
        // если подписались на пользователя из списка followers, отметим локально (не обязательно)
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

export default followersSlice.reducer;
