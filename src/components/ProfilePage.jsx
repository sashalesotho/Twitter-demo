import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser } from '../../store/userSlice';
import UserInfo from './UserInfo';
import UserPosts from './UserPosts';
import Topics from './Topics';
import Blogers from './Blogers';
import FeedHeader from './FeedHeader';
import MobileHeader from './MobileHeader';
import MobileFooter from './MobileFooter';
import styles from '../styles/ProfilePage.module.css';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { profile, posts, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <>
    <MobileHeader />
    <FeedHeader />
    <div className={styles.container}>
     
      <div className={styles.left}>
      {profile && (
        <div className={styles.info}>
          <UserInfo profile={profile} />
        </div>
      )}
      {Array.isArray(posts) && posts.length > 0 ? (
        <div className={styles.posts}>
          <UserPosts posts={posts} />
        </div>
      ) : (
        <p>нет постов</p>
      )}
      </div>
      
      <div className={styles.side}>
      <Topics />
      <Blogers />
      </div>
      
      <MobileFooter />
    </div>
    </>
  );
};

export default ProfilePage;
