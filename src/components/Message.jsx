import styles from '../styles/MessagesList.module.css';
import convertTime from '../../assets/convert_time';
import messageTimer from '../../public/message-timer';
const Message = ({id, picUrl, name, mail, date, message, imgmessage, quantityReposts, quantityLike, quantityShare}) => {
  const now = Date.now();
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
        <p>{date ? convertTime(messageTimer(date), now) : "нет даты"}</p>
        </div>
      </div>
      <div className={styles["post__message"]}>
        {message}
        {imgmessage && (
          <div className={styles["post__image"]}>
            <img src={imgmessage} alt="прикрепленное изображение" />
          </div>
        )}
        </div>
      <div className={styles.stats}>
      <div className={styles["stats__item"]}>
        <img src="../images/reply.svg" alt="ответить" />
        <p>{quantityReposts}</p>
      </div>
      <div className={styles["stats__item"]}>
        <img src="../images/heart.svg" alt="сердце" />
        <p>{quantityLike}</p>
      </div>
      <div className={styles["stats__item"]}>
        <img src="../images/export.svg" alt="поделиться" />
        <p>{quantityShare}</p>
      </div>
      </div>
    </div>
  </li>
)
}

export default Message;