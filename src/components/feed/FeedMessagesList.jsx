import { useState, useEffect } from "react";
import styles from "./feed-styles/FeedMessagesList.module.css";
import MessageLoader from "../MessageLoader";
import Message from "../Message";

const FeedMessagesList = () => {
  const [messagesArr, setMessages] = useState([]);
  const [picturesArr, setPictures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getIsLoading = async () => {
    const response = await fetch("https://burtovoy.github.io/messages.json");
    if (response.ok) {
      setIsLoading(false);
    }
  };
  const getApiMessages = async () => {
    const response = await fetch(
      "https://burtovoy.github.io/messages.json"
    ).then((response) => response.json());

    setMessages(response.messages);
  };

  const getApiPictures = async () => {
    const response = await fetch(
      "https://burtovoy.github.io/pictures.json"
    ).then((response) => response.json());

    setPictures(response.pictures);
  };

  useEffect(() => {
    getApiMessages();
    getApiPictures();
    getIsLoading();
  }, []);

  let messages = [...messagesArr].map((el, key) => {
    return(
      <Message
      key={el.id}
      id={el.id}
      picUrl={picturesArr[key]?.url}
      name={el.name}
      mail={el.name}
      date={el.date}
      message={el.message}
      quantityReposts={el.quantityReposts}
      quantityLike={el.quantityLike}
      quantityShare={el.quantityShare}
    />
    )
  } 
  );
  return (
    <div className={styles.container}>
     
      <div className={styles.posts}>
        <div className={styles['left-desktop-body']}>
        {isLoading ? (
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
      </div>
      </div>
      

    </div>
  );
};

export default FeedMessagesList;
