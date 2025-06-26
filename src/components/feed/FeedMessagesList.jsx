import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../../../store/postsSlice";
import styles from "./feed-styles/FeedMessagesList.module.css";
import MessageLoader from "../MessageLoader";
import Message from "../Message";

const FeedMessagesList = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.posts);
  
  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.posts}>
          <div className={styles['left-desktop-body']}>
            <MessageLoader />
            <MessageLoader />
            <MessageLoader />
          </div>
        </div>
      </div>
      );
    }

    if (error) {
      return <div className={styles.container}>Ошибка загрузки постов: {error}</div>;
    }

  const messages = posts.map((el, index) => (
      <Message
      key={el.id || `message-${index}`}
      id={el.id}
      picUrl={el.avatar_url || "images/anonavatar.svg"}
      name={el.name || 'аноним'}
      mail={el.name || '@anon'}
      date={el.date}
      message={el.message}
      imgmessage={el.imgmessage}
      quantityReposts={el.quantityReposts || 0}
      quantityLike={el.quantityLike || 0}
      quantityShare={el.quantityShare || 0}
    />
    ));

  return (
    <div className={styles.container}>
    <div className={styles.posts}>
        <div className={styles["left-desktop-body"]}>
        {messages}
        </div>
      </div>
    </div>
  );
};

export default FeedMessagesList;
