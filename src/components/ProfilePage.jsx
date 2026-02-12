import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchCurrentUser } from '../../store/userSlice';
import { fetchOtherUser } from '../../store/otherUserSlice';
import { fetchFeed } from '../../store/feedSlice';
import UserInfo from './UserInfo';
import UserPosts from './UserPosts';
import Topics from './Topics';
import Blogers from './Blogers';
import FeedHeader from './FeedHeader';
import MobileHeader from './MobileHeader';
import SubscribeButton from './SubscribeButton';
import MobileFooter from './MobileFooter';
import styles from '../styles/ProfilePage.module.css';


const ProfilePage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.profile);
 
  const { profile, posts, loading, error } = useSelector((state) => state.user);
  const {
    profile: otherProfile,
    posts: otherPosts,
    loading: otherLoading,
    error: otherError,
  } = useSelector((state) => state.otherUser);

 
  console.log('Ошибка user:', error);
  console.log('Ошибка otherUser:', otherError);

  useEffect(() => {
    dispatch(fetchCurrentUser());

    if (id) {
      dispatch(fetchOtherUser(id));
    } else {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);
  const isOther = Boolean(id);
  const currentLoading = isOther ? otherLoading : loading;
  const currentError = isOther ? otherError : error;
  const currentProfile = isOther ? otherProfile : profile;
  const currentPosts = isOther ? otherPosts : posts;



  if (currentLoading) return <p>Загрузка...</p>;
  if (currentError) return <p style={{ color: 'red' }}>{currentError}</p>;
  if (!currentProfile) return <p>Пользователь не найден</p>;

  const showSubscribeButton =
    isOther &&
    currentUser && 
    currentUser.id !== currentProfile.id;
    
    return (
    <>
    <MobileHeader />
    <FeedHeader />
    <div className={styles.container}>
     
      <div className={styles.left}>
      {currentProfile && (
        <div className={styles.info}>
          <UserInfo profile={currentProfile} />
          {showSubscribeButton && (
                <div style={{ marginTop: 12 }}>
                  <SubscribeButton targetUserId={currentProfile.id} />
                </div>
              )}
        </div>
      )}
      {Array.isArray(currentPosts) && currentPosts.length > 0 ? (
        <div className={styles.posts}>
          <UserPosts posts={currentPosts} />
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
