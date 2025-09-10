import { configureStore } from '@reduxjs/toolkit';
import postsReducer from './postsSlice.js';
import userReducer from './userSlice.js';
import otherUserReducer from './otherUserSlice.js';

const store = configureStore({
  reducer: {
    posts: postsReducer,
    user: userReducer,
    otherUser: otherUserReducer,
  },
});

export default store;
