import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../src/config';

export const fetchPopularUsers = createAsyncThunk(
  'blogers/fetchPopularUsers',
  async () => {
    const res = await fetch(`${API_URL}/popular-users`, {
      credentials: 'include',
    });
    return res.json();
  },
);

const blogersSlice = createSlice({
  name: 'blogers',
  initialState: {
    popular: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPopularUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPopularUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.popular = action.payload;
      })
      .addCase(fetchPopularUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default blogersSlice.reducer;
