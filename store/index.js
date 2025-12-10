import { configureStore } from '@reduxjs/toolkit';
import postsReducer from './postsSlice.js';
import userReducer from './userSlice.js';
import otherUserReducer from './otherUserSlice.js';
import feedReducer from './feedSlice.js';
import subscriptionReducer from './subscriptionSlice.js';
import subscriptionsReducer from './subscriptionsSlice.js';
import followersReducer from './followersSlice.js';
import userFollowingReducer from './userFollowingSlice.js';
import userFollowersReducer from './userFollowersSlice.js';
import blogersReducer from './blogersSlice.js';
import hashtagsReducer from './hashtagsSlice.js';
import likesReducer from './likesSlice.js';

const store = configureStore({
  reducer: {
    posts: postsReducer,
    user: userReducer,
    otherUser: otherUserReducer,
    feed: feedReducer,
    subscription: subscriptionReducer,
    subscriptions: subscriptionsReducer,
    followers: followersReducer,
    userFollowing: userFollowingReducer,
    userFollowers: userFollowersReducer,
    blogers: blogersReducer,
    hashtags: hashtagsReducer,
    likes: likesReducer,
  },
});

export default store;
