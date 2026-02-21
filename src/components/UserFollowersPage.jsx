import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchUserFollowers } from '../../store/userFollowersSlice';
import { subscribeUser, unsubscribeUser, removeFollower } from '../../store/subscriptionSlice';
import { fetchFeed } from '../../store/feedSlice';
import styles from '../styles/UserFollowersPage.module.css';

const UserFollowersPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector(s => s.userFollowers);
  const subLoading = useSelector(s => s.subscription.loading);

  useEffect(() => { if (id) dispatch(fetchUserFollowers(id)); }, [dispatch, id]);

  const handleSubscribe = async (userId) => {
    try {
      await dispatch(subscribeUser(userId)).unwrap();
      dispatch(fetchUserFollowers(id));
      dispatch(fetchFeed());
    } catch (err) { alert(err?.message || 'Ошибка'); }
  };

  const handleRemoveFollower = async (followerId) => {
    try {
      await dispatch(removeFollower(followerId)).unwrap();
      dispatch(fetchUserFollowers(id));
    } catch (err) { alert(err?.message || 'Ошибка'); }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className={styles.container}>
      <h2>Подписчики пользователя</h2>
      {Array.isArray(items) && items.map(u => (
        <div key={u.id} className={styles.userCard}>
          <img src={u.avatar_url || '/images/anonavatar.svg'} alt="" className={styles.avatar}/>
          <div className={styles.info}>
            <div className={styles.name}>{u.username || u.nickname}</div>
            <div className={styles.nick}>@{u.nickname || u.username}</div>
          </div>
          <div className={styles.actions}>
            <button onClick={() => handleSubscribe(u.id)} disabled={subLoading}>Подписаться</button>
            {/* Try to remove only if this is your own profile's followers list — otherwise server will forbid */}
            <button onClick={() => handleRemoveFollower(u.id)} disabled={subLoading}>Удалить</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserFollowersPage;
