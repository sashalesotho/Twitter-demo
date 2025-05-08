import { useState, useEffect } from "react";
import convertTime from "../../assets/convert_time";
import messageTimer from "../../public/message-timer";
import styles from "../styles/MessagesList.module.css";
import MessageLoader from "./MessageLoader";
import Message from "./Message";
import Blogers from "./Blogers";
import Topics from "./Topics";

const MessagesList = () => {
  const [messagesArr, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getIsLoading = async () => {
    const response = await fetch("https://burtovoy.github.io/messages.json");
    if (response.ok) {
      setIsLoading(false);
    }
  };
  const getApiMessages = async () => {
    try {
      const response = await fetch("/posts", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Ошибка при загрузке постов");
      }

      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Ошибка загрузки постов:", error.message);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getApiMessages();
    getIsLoading();
  }, []);

  let messages = [...messagesArr].map((el, key) => {
    return(
      <Message
      key={el.id}
      id={el.id}
      picUrl={el.picurl || "images/anonavatar.svg"}
      name={el.name || 'аноним'}
      mail={el.name || '@anon'}
      date={el.date}
      message={el.message}
      quantityReposts={el.quantityReposts || 0}
      quantityLike={el.quantityLike || 0}
      quantityShare={el.quantityShare || 0}
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
      <Topics />
      <Blogers />
      </div>
      </div>
      

    </div>
  );
};

export default MessagesList;
