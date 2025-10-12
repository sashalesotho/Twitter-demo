import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubscriptions } from '../../store/subscriptionsSlice'; // у тебя уже есть subscriptionsSlice
import { unsubscribeUser } from '../../store/subscriptionSlice';
import { fetchFeed } from '../../store/feedSlice';
import styles from '../styles/FollowingPage.module.css';

const FollowingPage = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector(s => s.subscriptions);

  useEffect(() => { dispatch(fetchSubscriptions()); }, [dispatch]);

  const handleUnsubscribe = async (userId) => {
    try {
      await dispatch(unsubscribeUser(userId)).unwrap();
      dispatch(fetchSubscriptions());
      dispatch(fetchFeed());
    } catch (err) {
      alert(err?.message || 'Не удалось отписаться');
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!items || items.length === 0) return <div>Вы ни на кого не подписаны</div>;

  return (
    <div className={styles.container}>
      <h2>Подписки</h2>
      {items.map(u => (
        <div key={u.id} className={styles.userCard}>
          <img src={u.avatar_url || '/images/anonavatar.svg'} alt="" className={styles.avatar}/>
          <div className={styles.info}>
            <div className={styles.name}>{u.username || u.nickname}</div>
            <div className={styles.nick}>@{u.nickname || u.username}</div>
          </div>
          <div className={styles.actions}>
            <button onClick={() => handleUnsubscribe(u.id)}>Отписаться</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FollowingPage;
