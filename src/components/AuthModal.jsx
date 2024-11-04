import { useEffect, useRef} from 'react';
import styles from '../styles/Modal.module.css';
const AuthModal = ({active, setActive}) => {
    const swipe = useRef();
  useEffect(() => {
    swipe.current.addEventListener('swiped-down', () => {
      setActive(false)
    })
  })
    return (
        <div className={active ? styles.modal : styles.hidden} >
        <div className={styles.handler} ref={swipe}></div>
        <form noValidate className={styles['registration__form']} action="">
          <div className={styles["modal__header"]}>Авторизация</div>
          <div className={styles["modal__input"]}>
            <input
              className={styles["registration__input"]}
              type="email"
              name="email"
              placeholder="Электронная почта"
            />
            <label htmlFor="auth-email" className={styles["modal__label"]}
              >Электронная почта</label
            >
            <div className={styles["input__message"]}>Адрес не валиден</div>
          </div>
          <div className={styles["modal__input"]}>
            <input
              className={styles["registration__input"]}
              type="password"
              name="password"
              placeholder="Пароль"
            />
            <label htmlFor="auth-password" className={styles["modal__label"]}>Пароль</label>
            <div className={styles["input__message"]}>Пароль не верный</div>
          </div>

          <button className={styles["registration__button"]}>Войти</button>
        </form>
      </div>
    )
}

export default AuthModal;