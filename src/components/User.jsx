import styles from '../styles/User.module.css';

const User = () => {
    return (
        <div className={styles.userContainer}>
            <div className={styles.top}>
            <div className={styles.avatarWrapper}>
        <img className={styles.avatar} src="../../images/alexander.png" alt="User Avatar" />
      </div>
      <div className={styles.userInfo}>
        <h3 className={styles.userName}>Александр</h3>
        <p className={styles.userHandle}>@burtovoy</p>
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