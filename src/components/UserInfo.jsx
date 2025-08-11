import { Link } from 'react-router-dom';
import styles from '../styles/UserInfo.module.css';


const UserInfo = ({ profile }) => {
  return (
    <div className={styles.container}>
      
      <img
          src={profile.background || '/images/cover.png'}
          alt="фон профиля"
          className={styles.cover}
        />

      <div className={styles.userContainer}>
        

        <div className={styles.top}>
          <div className={styles.avatarWrapper}>
            <img
              className={styles.avatar}
              src={profile.avatar_url || '/images/default-avatar.png'}
              alt="User Avatar"
            />
          </div>

          <div className={styles.userInfo}>
            <h3 className={styles.userName}>{profile.username}</h3>
            <p className={styles.userHandle}>@{profile.nickname}</p>
            <div className={styles.bio}>{profile.bio || ''}</div>

            <div className={styles.info}>
              <img src="/images/geo.svg" alt="геопозиция" className={styles.icon} />
              <p className={styles.userHandle}>{profile.geo || ''}</p>
            </div>

            <div className={styles.info}>
              <img src="/images/site.svg" alt="ссылка" className={styles.icon} />
              <p className={styles.userHandle}>{profile.site || ''}</p>
            </div>

            <div className={styles.info}>
              <img src="/images/calendar.svg" alt="календарь" className={styles.icon} />
              <p className={styles.userHandle}>
                {profile.birthday ? new Date(profile.birthday).toLocaleDateString() : ''}
              </p>
            </div>
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
        
        <button className={styles.button}><Link to="/settings/profile">Редактировать профиль</Link></button>
        
        
      </div>
    </div>
  );
};

export default UserInfo;
