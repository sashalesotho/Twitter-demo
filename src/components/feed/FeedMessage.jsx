import React, { useState, useRef, useEffect } from "react";
import postSize from "../../../assets/post_size";
import styles from "./feed-styles/FeedMessage.module.css";

const FeedMessage = () => {
    const [message, setMessage] = useState("");
    
    const maxChars = 800;
    const progressRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
      const textLength = postSize(message);
      const percent = Math.min((textLength / maxChars) * 100, 100);
      
      const circumference = 2 * Math.PI * 50;
      const offset = circumference - (percent / 100) * circumference;
      if (progressRef.current) {
        progressRef.current.style.strokeDashoffset = offset;
      }
      if (textRef.current) {
        textRef.current.textContent = textLength;
      }
      
    }, [message]);

    const handleSubmit = (e) => {
      e.preventDefault();
      setMessage("");
    }
        

    return (
      <div className={styles.myMessage}>
        <form className={styles.form} onSubmit={handleSubmit}>
      
        <input type="text" className={styles.input} placeholder="Что нового, Александр?" value={message} onChange={(e) => setMessage(e.target.value)} />
        <div className={styles["message-preview"]}>
        {message || "Кто-то хочет поиграть в настольный теннис?"}
        </div>
        
        <div className={styles.actions}>
          <button className={styles.iconButton}>
            <img src="images/addphoto.svg" alt="" />
          </button>
          
          <div className={styles["progress-container"]}>
        <svg width="60" height="60" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" className={styles["progress-circle"]} />
            <circle cx="60" cy="60" r="50" className={styles.progress} ref={progressRef} />
            <text x="60" y="60" className={styles["progress-text"]} ref={textRef} transform="rotate(90, 60, 60)">0</text>
        </svg>
    </div>
          <button type="submit" className={styles.sendButton}>Отправить</button>
        </div>
    
    
      </form>
      
       
      </div>
    );
}

export default FeedMessage;