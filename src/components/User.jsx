import { useSelector } from 'react-redux';
import styles from '../styles/User.module.css';

const User = () => {
  const avatarUrl = useSelector(state => state.user.profile?.avatar_url);
  const profile = useSelector((state) => state.user.profile);

    return (
        <div className={styles.userContainer}>
            <div className={styles.top}>
            <div className={styles.avatarWrapper}>
            {avatarUrl ? (
          <img className={styles.avatar} src={avatarUrl} alt="аватар" />
        ) : (
          <img className={styles.avatar} src="/images/anonavatar.svg" alt="аватар" />
        )}
      </div>
      <div className={styles.userInfo}>
        <h3 className={styles.userName}>{profile.username}</h3>
        <p className={styles.userHandle}>{profile.nickname}</p>
            </div>
      
        <div className={styles.stats}>
          <div>
            <strong className={styles.numb}>45K</strong>
            <span className={styles.letter}>Сообщений</span>
          </div>
          <div>
            <strong className={styles.numb}>28</strong>
            <span className={styles.letter}>Читаемых</span>
          </div>
          <div>
            <strong className={styles.numb}>118</strong>
            <span className={styles.letter}>Читателей</span>
          </div>
        </div>
      </div>
    </div>
    )
}

export default User;