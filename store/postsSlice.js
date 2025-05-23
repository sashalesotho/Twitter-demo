import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const addPost = createAsyncThunk('posts/addPost', async ({ message, image }) => {
  const response = await fetch('/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ message, image }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    // eslint-disable-next-line
throw new Error(errorData?.error || "Ошибка при сохранении поста");

  }

  return response.json();
});

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await fetch('/posts', { credentials: 'include' });
  const data = await response.json();
  return data;
});

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(addPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      });
  },
});

export default postsSlice.reducer;
