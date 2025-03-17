import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Feed from './components/feed/FeedPage.jsx'
import './index.css'
import ProfilePage from './components/ProfilePage.jsx'
import FollowingPage from './components/FollowingPage.jsx'
import FollowersPage from './components/FollowersPage.jsx'
import UserFollowingPage from './components/UserFollowingPage.jsx'
import UserFollowersPage from './components/UserFollowersPage.jsx'
import ProfileSettingsPage from './components/ProfileSettingsPage.jsx'
import PasswordSettingsPage from './components/PasswordSettingsPage.jsx'
import EmailSettingsPage from './components/EmailSettingsPage.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}/>
      <Route path="/feed" element={<Feed />}/>
      <Route path="/profile" element={<ProfilePage />}/>
      <Route path="/profile/:id" element={<ProfilePage />}/>
      <Route path="/following" element={<FollowingPage />}/>
      <Route path="/followers" element={<FollowersPage />}/>
      <Route path="/profile/:id/following" element={<UserFollowingPage />}/>
      <Route path="/profile/:id/followers" element={<UserFollowersPage />}/>
      <Route path="/settings/profile" element={<ProfileSettingsPage />}/>
      <Route path="/settings/password" element={<PasswordSettingsPage />}/>
      <Route path="/settings/email" element={<EmailSettingsPage />}/>
      
    </Routes>
    </BrowserRouter>
  </React.StrictMode>
)