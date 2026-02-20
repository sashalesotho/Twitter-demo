import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "../../store/postsSlice";
import postSize from "../../assets/post_size";
import { Widget } from '@uploadcare/react-widget';
import styles from "../styles/FeedMessage.module.css";

const FeedMessage = () => {

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.posts);

    const [message, setMessage] = useState("");
    const [imgUrl, setImgUrl] = useState("");

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

    const handleFileUpload = (fileInfo) => {
      
      setImgUrl(fileInfo.cdnUrl);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!message.trim()) {
        alert("введите текст сообщения");
        return;
      }
      try {
        await dispatch(addPost({ message, image: imgUrl })).unwrap();
        setMessage("");
        setImgUrl("");
        alert("пост сохранён");
      } catch (error) {
        console.error("ошибка при сохранении поста:", error);
        alert(error.message || "ошибка при сохранении поста");
      }
     
  };
    

    return (
      <div className={styles.myMessage}>
        <form className={styles.form} onSubmit={handleSubmit}>
      
        <input type="text" className={styles.input} placeholder="Что нового?" value={message} onChange={(e) => setMessage(e.target.value)} />
        <div className={styles["message-preview"]}>
        {message || "Кто-то хочет поиграть в настольный теннис?"}
        </div>
        
        <div className={styles.actions}>
          <div className={styles.widget}>
          <Widget className={styles.photobutton}
  publicKey="d45be7bd5518f8ea3cce"
  onChange={(fileInfo) => handleFileUpload(fileInfo)}
/>
          </div>
          
          
          <div className={styles["progress-container"]}>
        <svg width="60" height="60" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" className={styles["progress-circle"]} />
            <circle cx="60" cy="60" r="50" className={styles.progress} ref={progressRef} />
            <text x="60" y="60" className={styles["progress-text"]} ref={textRef} transform="rotate(90, 60, 60)">0</text>
        </svg>
    </div>
          <button type="submit" className={styles.sendButton} disabled={loading}>{loading ? "сохранение..." : "отправить"}</button>
        </div>
    
    
      </form>
      
       
      </div>
    );
}

export default FeedMessage;