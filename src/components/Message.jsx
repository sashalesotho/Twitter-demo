import styles from '../styles/MessagesList.module.css';
import convertTime from '../../public/assets/convert_time';
import messageTimer from '../../public/message-timer';
const Message = ({id, picUrl, name, mail, date, message, quantityReposts, quantityLike, quantityShare}) => {
  let now;
  setInterval(now = Date.now(), 60000);
return (
    <li className={styles.post} id={id}>
    <div className={styles['post__avatar']}>
      <img src={picUrl} alt="аватар" />
    </div>
    <div className={styles["post__body"]}>
      <div className={styles["post__header"]}>
        <div className={styles.user}>
        <p className={styles["user__name"]}>{name}</p>
        <p className={styles["user__nickname"]}>{mail}</p>
        </div>
        <div className={styles["post__time"]}>
        <p>{convertTime(messageTimer(date), now)}</p>
        </div>
      </div>
      <div className={styles["post__message"]}>{message}</div>
      <div className={styles.stats}>
      <div className={styles["stats__item"]}>
        <img src="images/reply.svg" alt="ответить" />
        <p>{quantityReposts}</p>
      </div>
      <div className={styles["stats__item"]}>
        <img src="images/heart.svg" alt="сердце" />
        <p>{quantityLike}</p>
      </div>
      <div className={styles["stats__item"]}>
        <img src="images/export.svg" alt="поделиться" />
        <p>{quantityShare}</p>
      </div>
      </div>
    </div>
  </li>
)
}

export default Message;