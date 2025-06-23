import { Link } from 'react-router-dom';
import styles from "./feed-styles/FeedHeader.module.css";
const FeedHeader = () => {
    return (
        <header className={styles.header}>
            <nav>
                <ul>
                    <li>
                    <img className={styles.pic} src="images/home.svg" alt="home" />
                        Лента
                    </li>
                    <li>
                    <img className={styles.pic} src="images/user.svg" alt="user" />
                        Профиль</li>
                    <li>
                        <Link to="settings/profile">
                        <img className={styles.pic} src="images/adjust.svg" alt="adjust" />
                        Настройки
                        </Link>
                    </li>
                </ul>
            </nav>
            <div className={styles.logo}>
                <img className={styles.logo} src="images/logo.svg" alt="" />
            </div>
            
            <div className={styles.avatar}>
                <img src="images/alexander.png" alt="avatar" />
            </div>

        </header>
    )
}

export default FeedHeader;