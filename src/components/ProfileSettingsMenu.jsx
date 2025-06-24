import { NavLink, Outlet } from 'react-router-dom';
import styles from '../styles/ProfileSettingsMenu.module.css';
import FeedHeader from './feed/FeedHeader';
import MobileHeader from './feed/MobileHeader';

const ProfileSettingsMenu = () => {
  return (
   
    
    <div className={styles.container}>
      <MobileHeader />
    <FeedHeader />
    
      <div className={styles.content}>
        <div className={styles.formContainer}>
          <Outlet />
        </div>
        <aside className={styles.sidebar}>
        
          <ul className={styles.menu}>
          <h1 className={styles.title}>Настройки</h1>
            <li>
              <NavLink to="profile" className={({ isActive }) => isActive ? styles.active : ''}>
                Настройки профиля
              </NavLink>
            </li>
            <li>
              <NavLink to="password" className={({ isActive }) => isActive ? styles.active : ''}>
                Сменить пароль
              </NavLink>
            </li>
            <li>
              <NavLink to="email" className={({ isActive }) => isActive ? styles.active : ''}>
                Сменить e-mail
              </NavLink>
            </li>
          </ul>
        </aside>
      </div>
    </div>
   
    
  );
};

export default ProfileSettingsMenu;
