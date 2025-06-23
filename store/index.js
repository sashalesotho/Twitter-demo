import { configureStore } from '@reduxjs/toolkit';
import postsReducer from './postsSlice.js';
import userReducer from './userSlice.js';

const store = configureStore({
  reducer: {
    posts: postsReducer,
    user: userReducer,
  },
});

export default store;
