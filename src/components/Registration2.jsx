import { useState } from 'react';
import styles from '../styles/Registration.module.css';
import RegModal from './RegModal';
import AuthModal from './AuthModal';
const Registration2 = () => {
  const [regModalActive, setRegModalActive] = useState(false);
  const [authModalActive, setAuthModalActive] = useState(false);
    return (
        <div className = {styles.registration}>
        <div className = {styles.registration__header}>
        Зарегистрируйтесь и узнайте обо всём первым
        </div>
        <div className = {styles.registration__buttons}>
          <button className = {styles.registration__button} onClick={() => setRegModalActive(true)}>
            Зарегистрироваться
          </button>
          <button className = {styles.registration__button} onClick={() => setAuthModalActive(true)}>Войти</button>
        </div>
        <RegModal active={regModalActive} setActive={setRegModalActive} />
        <AuthModal active={authModalActive} setActive={setAuthModalActive} />
      </div>
    )
}
export default Registration2;