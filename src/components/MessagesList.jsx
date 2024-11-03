import { useState, useEffect } from "react";
import convertTime from "../../public/assets/convert_time";
import messageTimer from "../../public/message-timer";
import styles from "../styles/MessagesList.module.css";
import MessageLoader from "./MessageLoader";
import Message from "./Message";

const MessagesList = () => {
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
    <div className={styles.posts}>
      <div className={styles["posts__header"]}>Последние сообщения</div>
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
  );
};

export default MessagesList;