import { Link } from 'react-router-dom';
import styles from '../styles/MobileFooter.module.css';

const MobileFooter = () => {
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
                    <img className={styles.avatar} src="../../images/alexander.png" alt="avatar" />
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default MobileFooter;