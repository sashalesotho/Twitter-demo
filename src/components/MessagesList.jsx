import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeed } from "../../store/feedSlice";
import convertTime from "../../assets/convert_time";
import messageTimer from "../../public/message-timer";
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

  let messages = posts.map((el, index) => (
    <Message
      key={el.id || `message-${index}`}
      id={el.id}
      picUrl={el.avatar_url || "/images/anonavatar.svg"}
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
      
      <div className={['right-desktop-body']}>
      <Topics />
      <Blogers />
      </div>
      </div>
      

    </div>
  );
};

export default MessagesList;
