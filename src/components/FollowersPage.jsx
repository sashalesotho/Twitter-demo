import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFollowers } from '../../store/followersSlice';
import { subscribeUser, unsubscribeUser, removeFollower } from '../../store/subscriptionSlice';
import { fetchFeed } from '../../store/feedSlice';
import styles from '../styles/FollowersPage.module.css';

const FollowersPage = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector(s => s.followers);
  const subLoading = useSelector(s => s.subscription.loading);

  useEffect(() => { dispatch(fetchFollowers()); }, [dispatch]);

  const handleSubscribe = async (userId) => {
    try {
      await dispatch(subscribeUser(userId)).unwrap();
      dispatch(fetchFollowers());
      dispatch(fetchFeed());
    } catch (err) { alert(err?.message || 'Ошибка'); }
  };

  const handleRemoveFollower = async (followerId) => {
    try {
      await dispatch(removeFollower(followerId)).unwrap();
      dispatch(fetchFollowers());
    } catch (err) { alert(err?.message || 'Ошибка'); }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!items || items.length === 0) return <div>У вас пока нет подписчиков</div>;

  return (
    <div className={styles.container}>
      <h2>Подписчики</h2>
      {Array.isArray(items) && items.map(u => (
        <div key={u.id} className={styles.userCard}>
          <img src={u.avatar_url || '/images/anonavatar.svg'} alt="" className={styles.avatar}/>
          <div className={styles.info}>
            <div className={styles.name}>{u.username || u.nickname}</div>
            <div className={styles.nick}>@{u.nickname || u.username}</div>
          </div>
          <div className={styles.actions}>
            <button onClick={() => handleSubscribe(u.id)} disabled={subLoading}>Подписаться</button>
            <button onClick={() => handleRemoveFollower(u.id)} disabled={subLoading}>Удалить</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FollowersPage;
