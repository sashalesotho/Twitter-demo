import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from "../styles/FeedHeader.module.css";
const FeedHeader = () => {
    const avatarUrl = useSelector(state => state.user.profile?.avatar_url);

    return (
        <header className={styles.header}>
            <nav>
                <ul>
                    <li>
                        <Link to="/feed">
                        <img className={styles.pic} src="../../images/home.svg" alt="home" />
                        Лента</Link>
                    
                    </li>
                    <li>
                    <Link to="/profile">
                    <img className={styles.pic} src="../../images/user.svg" alt="user" />
                        Профиль
                    </Link></li>
                    <li>
                        <Link to="/settings/profile">
                        <img className={styles.pic} src="../../images/adjust.svg" alt="adjust" />
                        Настройки
                        </Link>
                    </li>
                </ul>
            </nav>
            <div className={styles.logo}>
                <img className={styles.logo} src="../../images/logo.svg" alt="" />
            </div>
            
            <div className={styles.avatar}>
            {avatarUrl ? (
          <img src={avatarUrl} alt="аватар" />
        ) : (
          <img src="/public/images/anonavatar.svg" alt="аватар" />
        )}
            </div>

        </header>
    )
}

export default FeedHeader;