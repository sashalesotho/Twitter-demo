import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const likePost = createAsyncThunk(
  'likes/likePost',
  async (postId, { rejectWithValue }) => {
    try {
      const res = await fetch('http://localhost:3000/like', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      });
      if (!res.ok) throw new Error('Failed to like post');
      return { postId };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const unlikePost = createAsyncThunk(
  'likes/unlikePost',
  async (postId, { rejectWithValue }) => {
    try {
      const res = await fetch('http://localhost:3000/like', {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      });
      if (!res.ok) throw new Error('Failed to unlike post');
      return { postId };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const likesSlice = createSlice({
  name: 'likes',
  initialState: {
    liked: {}, // {postId: true}
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(likePost.fulfilled, (state, action) => {
        state.liked[action.payload.postId] = true;
      })

      .addCase(unlikePost.fulfilled, (state, action) => {
        delete state.liked[action.payload.postId];
      });
  },
});

export default likesSlice.reducer;
