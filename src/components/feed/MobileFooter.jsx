import styles from '../feed/feed-styles/MobileFooter.module.css';

const MobileFooter = () => {
    return (
        <div className={styles.footer}>
              <nav>
                <ul className={styles.list}>
                    <li>
                    <img className={styles.pic} src="images/home.svg" alt="home" />
                    </li>
                    <li>
                    <img className={styles.pic} src="images/user.svg" alt="user" />
                    </li>
                    <li>
                    <img className={styles.pic} src="images/adjust.svg" alt="adjust" />
                    </li>
                    <li>
                    <img className={styles.avatar} src="images/alexander.png" alt="avatar" />
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default MobileFooter;