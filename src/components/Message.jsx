import { useDispatch, useSelector } from "react-redux";
import { likePost, unlikePost } from "../../store/likesSlice";
import convertTime from '../../assets/convert_time';
import messageTimer from '../../public/message-timer';
import styles from '../styles/MessagesList.module.css';

const Message = ({ post }) => {  
  if(!post) return null;

  const dispatch = useDispatch();
  const {
    id, userid, username, email, message, imgmessage, date, quantityReposts, quantityLike, quantityShare, avatar_url
  } = post;
  const now = Date.now();

  const isLiked = useSelector((s) => s.likes.liked[id] === true);
  const likes_count = post.likes_count ?? 0;

  const toggleLike = () => {
    if (isLiked) dispatch(unlikePost(id));
    else dispatch(likePost(id));
  };
return (
    <li className={styles.post} id={id}>
    <div className={styles['post__avatar']}>
      <img src={avatar_url || "/public/images/anonavatar.svg"} alt="аватар" />
    </div>
    <div className={styles["post__body"]}>
      <div className={styles["post__header"]}>
        <div className={styles.user}>
        <p className={styles["user__name"]}>{username}</p>
        <p className={styles["user__nickname"]}>{email}</p>
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
      <button onClick={toggleLike} className={styles["stats__item"]}>
        {isLiked ? <img src="../images/heart-fill.svg" alt="сердце" /> : <img src="../images/heart.svg" alt="сердце" />}
        
        <p>{likes_count}</p>
      </button>
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