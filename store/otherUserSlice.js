import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchOtherUser = createAsyncThunk(
  'otherUser/fetchOtherUser',
  async (userId, { rejectWithValue }) => {
    console.log('URL:', `/api/profile/${userId}`);

    try {
      const res = await fetch(`/api/profile/${userId}`, {
        credentials: 'include',
      });

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Сервер вернул не JSON ответ');
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const otherUserSlice = createSlice({
  name: 'otherUser',
  initialState: {
    profile: null,
    posts: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearOtherUser: (state) => {
      state.profile = null;
      state.posts = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOtherUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOtherUser.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.profile;
        state.posts = action.payload.posts || [];
      })
      .addCase(fetchOtherUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка';
      });
  },
});

export const { clearOtherUser } = otherUserSlice.actions;
export default otherUserSlice.reducer;
