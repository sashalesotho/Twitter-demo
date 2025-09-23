import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { subscribeUser, unsubscribeUser } from '../../store/subscriptionSlice';
import { fetchOtherUser } from '../../store/otherUserSlice';
import { fetchFeed } from '../../store/feedSlice';
import styles from '../styles/SubscribeButton.module.css'

const SubscribeButton = ({ targetUserId }) => {
  const dispatch = useDispatch();

  const otherProfile = useSelector((state) => state.otherUser?.profile);
  const subscriptionState = useSelector((state) => state.subscription) || {};
  const globalLoading = Boolean(subscriptionState.loading);

  const [isSubscribedLocal, setIsSubscribedLocal] = useState(Boolean(otherProfile?.isSubscribed));
  const [localLoading, setLocalLoading] = useState(false);
  const loading = localLoading || globalLoading;

  useEffect(() => {
    if (!localLoading) {
      if (typeof otherProfile?.isSubscribed !== 'undefined') {
        setIsSubscribedLocal(Boolean(otherProfile.isSubscribed));
      }
    }
  }, [otherProfile?.isSubscribed, localLoading]);

  const handleToggle = async () => {
    if (!targetUserId) return;
    if (loading) return;

    const willSubscribe = !isSubscribedLocal;
    setIsSubscribedLocal(willSubscribe);
    setLocalLoading(true);

    try {
        let resPayload;
        if (willSubscribe) {
          resPayload = await dispatch(subscribeUser(targetUserId)).unwrap();
  
          if (resPayload?.userId === targetUserId) {
            if (resPayload.subscribed || resPayload.already) {
              setIsSubscribedLocal(true);
            }
          }
        } else {
          resPayload = await dispatch(unsubscribeUser(targetUserId)).unwrap();
  
          if (resPayload?.userId === targetUserId) {
            if (typeof resPayload.unsubscribed !== 'undefined') {
              if (resPayload.unsubscribed === true) setIsSubscribedLocal(false);
            } else {
              setIsSubscribedLocal(false);
            }
          }
        }
  
        console.log('subscribe/unsubscribe response payload:', resPayload);
  
        await dispatch(fetchFeed());
      } catch (err) {
        console.error('Ошибка при (un)subscribe (thunk rejected):', err);
        setIsSubscribedLocal(!willSubscribe);
  
        const message = typeof err === 'string' ? err : (err?.message || 'Неизвестная ошибка');
        alert(message);
      } finally {
        setTimeout(() => setLocalLoading(false), 1000);
      }
  
  };

  if (!targetUserId) return null;

  const label = loading ? '...' : (isSubscribedLocal ? 'Отписаться' : 'Подписаться');

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      aria-pressed={isSubscribedLocal}
      className={styles.subscribe}
    >
      {label}
    </button>
  );
};

export default SubscribeButton;
