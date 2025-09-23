import { configureStore } from '@reduxjs/toolkit';
import postsReducer from './postsSlice.js';
import userReducer from './userSlice.js';
import otherUserReducer from './otherUserSlice.js';
import feedReducer from './feedSlice.js';
import subscriptionReducer from './subscriptionSlice.js';

const store = configureStore({
  reducer: {
    posts: postsReducer,
    user: userReducer,
    otherUser: otherUserReducer,
    feed: feedReducer,
    subscription: subscriptionReducer,
  },
});

export default store;
