import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeed } from "../../store/feedSlice";
import convertTime from "../../assets/convert_time";
import styles from "../styles/MessagesList.module.css";
import MessageLoader from "./MessageLoader";
import Message from "./Message";
import Blogers from "./Blogers";
import Topics from "./Topics";

const MessagesList = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.feed);

  useEffect(()=> {
    dispatch(fetchFeed());
  }, [dispatch]);

  let messages = Array.isArray(posts) ? posts.map((post, index) => (
    <Message
      key={post.id || `message-${index}`}
      post={post}
    />
    ))
    : null;

  return (
    <div className={styles.container}>
     
      <div className={styles.posts}>
        <div className={styles['left-desktop-body']}>
        {loading ? (
        <>
          <MessageLoader />
          <MessageLoader />
          <MessageLoader />
        </>
      ) : (
        messages
      )}
        </div>
      
      <div className={styles['right-desktop-body']}>
      <Topics />
      <Blogers />
      </div>
      </div>
      

    </div>
  );
};

export default MessagesList;
