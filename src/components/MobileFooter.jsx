import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from '../styles/MobileFooter.module.css';

const MobileFooter = () => {
    const avatarUrl = useSelector(state => state.user.profile?.avatar_url);

    return (
        <div className={styles.footer}>
              <nav>
                <ul className={styles.list}>
                    <li>
                        <Link to="/feed">
                        <img className={styles.pic} src="../../images/home.svg" alt="home" />
                        </Link>
                    
                    </li>
                    <li>
                        <Link to="/profile">
                        <img className={styles.pic} src="../../images/user.svg" alt="user" />
                        </Link>
                    
                    </li>
                    <li>
                        <Link to="/settings/profile">
                        <img className={styles.pic} src="../../images/adjust.svg" alt="adjust" />
                        </Link>
                    </li>
                    <li>
                    {avatarUrl ? (
          <img className={styles.avatar} src={avatarUrl} alt="аватар" />
        ) : (
          <img className={styles.avatar} src="/public/images/anonavatar.svg" alt="аватар" />
        )}</li>
                </ul>
            </nav>
        </div>
    )
}

export default MobileFooter;