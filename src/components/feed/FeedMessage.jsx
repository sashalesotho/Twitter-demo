import React, { useState } from "react";
import styles from "./feed-styles/FeedMessage.module.css";

const FeedMessage = () => {
    const [message, setMessage] = useState("");
    const maxLength = 280;
    const progress = (message.length / maxLength) * 100;

    return (
      <div className={styles.myMessage}>
        <input
          className={styles.messageInput}
          type="text"
          placeholder="Кто-то хочет поиграть в настольный теннис?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className={styles.actions}>
          <button className={styles.iconButton}>
            <img src="images/addphoto.svg" alt="" />
          </button>
          
        <div className={styles.characterCounter}>
          <div className={styles.circleBackground}></div>
          <div
            className={styles.circleProgress}
            style={{ transform: `rotate(${progress * 3.6}deg)` }}
          ></div>
          <span>{message.length}</span>
        </div>
          <button className={styles.sendButton}>Отправить</button>
        </div>
      </div>
    );
}

export default FeedMessage;