import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchUserFollowing } from '../../store/userFollowingSlice';
import { subscribeUser, unsubscribeUser } from '../../store/subscriptionSlice';
import { fetchFeed } from '../../store/feedSlice';
import styles from '../styles/UserFollowingPage.module.css';

const UserFollowingPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector(s => s.userFollowing);
  const subLoading = useSelector(s => s.subscription.loading);

  useEffect(() => { if (id) dispatch(fetchUserFollowing(id)); }, [dispatch, id]);

  const handleSubscribe = async (userId) => {
    try {
      await dispatch(subscribeUser(userId)).unwrap();
      dispatch(fetchUserFollowing(id));
      dispatch(fetchFeed());
    } catch (err) { alert(err?.message || 'Ошибка'); }
  };

  const handleUnsubscribe = async (userId) => {
    try {
      await dispatch(unsubscribeUser(userId)).unwrap();
      dispatch(fetchUserFollowing(id));
      dispatch(fetchFeed());
    } catch (err) { alert(err?.message || 'Ошибка'); }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className={styles.container}>
      <h2>Подписки пользователя</h2>
      {items.map(u => (
        <div key={u.id} className={styles.userCard}>
          <img src={u.avatar_url || '/images/anonavatar.svg'} alt="" className={styles.avatar}/>
          <div className={styles.info}>
            <div className={styles.name}>{u.username || u.nickname}</div>
            <div className={styles.nick}>@{u.nickname || u.username}</div>
          </div>
          <div className={styles.actions}>
            <button onClick={() => handleSubscribe(u.id)} disabled={subLoading}>Подписаться</button>
            <button onClick={() => handleUnsubscribe(u.id)} disabled={subLoading}>Отписаться</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserFollowingPage;
