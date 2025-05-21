import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { addPost } from "../../../store/postsSlice";
import styles from "./feed-styles/NewMessage.module.css";
import postSize from "../../../assets/post_size";
import { Widget } from '@uploadcare/react-widget';

const NewMessage = ({ active, setActive }) => {

  
  const swipe = useRef(null);
  const textAreaRef = useRef(null);
  const progressRef = useRef(null);
  const textRef = useRef(null);
  const dispatch = useDispatch();



  const [message, setMessage] = useState("");
  const [imgUrl, setImgUrl] = useState('');
  const maxChars = 800;


  useEffect(() => {
    swipe.current.addEventListener("swiped-down", () => {
      setActive(false);
    });
  });

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
    console.log("загруженный файл:", fileInfo);
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
    <div className={active ? styles.modal : styles.hidden}>
      <div
        className={styles.handler}
        ref={swipe}
        onClick={() => setActive(false)}
      ></div>
      <form action="" className={styles.form} onSubmit={handleSubmit}>
      <textarea className={styles.textarea} ref={textAreaRef} placeholder="Введите сообщение..." value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
      <div className={styles.options}>
      <div className={styles["progress-container"]}>
        <svg width="60" height="60" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" className={styles["progress-circle"]} />
            <circle cx="60" cy="60" r="50" className={styles.progress} ref={progressRef} />
            <text x="60" y="60" className={styles["progress-text"]} ref={textRef} transform="rotate(90, 60, 60)">0</text>
        </svg>
    </div>
    <div className={styles.widget}>
    <Widget className={styles.photobutton}
  publicKey="d45be7bd5518f8ea3cce"
  onChange={(fileInfo) => handleFileUpload(fileInfo)}
/>
    </div>
    <button className={styles.button}>Отправить</button>
      </div>
      
    
    
      </form>
    </div>
  );
};

export default NewMessage;
