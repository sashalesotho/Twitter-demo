import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../../store/postsSlice";
import styles from "../styles/FeedMessagesList.module.css";
import MessageLoader from "./MessageLoader";
import Message from "./Message";

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

  const messages = Array.isArray(posts) && posts.map((post) => (
      <Message
      key={post.id} post={post}
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
