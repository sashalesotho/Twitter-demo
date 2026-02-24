import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Получить топ-3 популярных хештега
export const fetchPopularHashtags = createAsyncThunk(
  'hashtags/fetchPopular',
  async () => {
    const res = await fetch('http://localhost:3000/hashtags/popular', {
      credentials: 'include',
    });
    return res.json();
  },
);

export const fetchPostsByHashtag = createAsyncThunk(
  'hashtags/fetchPostsByTag',
  async (tag) => {
    const res = await fetch(`http://localhost:3000/hashtag/${tag}`, {
      credentials: 'include',
    });
    const posts = await res.json();
    return { tag, posts };
  },
);

const hashtagsSlice = createSlice({
  name: 'hashtags',
  initialState: {
    popular: [],
    byTag: {},
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    // popular
      .addCase(fetchPopularHashtags.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPopularHashtags.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.popular = action.payload;
      })
      .addCase(fetchPopularHashtags.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      .addCase(fetchPostsByHashtag.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPostsByHashtag.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const posts = Array.isArray(action.payload.posts) ? action.payload.posts : [];
        state.byTag[action.payload.tag] = posts;
      })
      .addCase(fetchPostsByHashtag.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        state.byTag[action.meta.arg] = [];

      });
  },
});

export default hashtagsSlice.reducer;
