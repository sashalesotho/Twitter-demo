import { useEffect, useRef, useState } from "react";
import validateEmail from "../../assets/is_valid_email";
import styles from "../styles/Modal.module.css";
const RegModal = ({ active, setActive }) => {
  const swipe = useRef();
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [message, setMessage] = useState("");

  const isValid = () => {
    let result = true;
    setEmailError("");
    if (email.length === 0) {
      setEmailError("поле не заполнено");
      result = false;
    }
    if (!validateEmail(email)) {
      setEmailError("email не валиден");
      result = false;
    }
    setPasswordError("");
    if (password.length === 0) {
      setPasswordError("поле не заполнено");
      result = false;
    }
    if (password !== checkPassword) {
      setPasswordError("пароли не совпадают");
      result = false;
    }
    return result;
  };
  const submitHandler = (e) => {
      e.preventDefault();
      setEmail('');
      setPassword('');
      setCheckPassword('');
      setMessage('');
    
      console.log(email, password, checkPassword)
      try {
        if (isValid(this) === true) {
        fetch("/createUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          })
        })
        .then((res) => {
          if (!res.ok) {
            return res.json().then((error) => {
              throw new Error(error.error)
            });
          }
          setMessage('registration was successful')
            return res.json()
        })
      .catch ((error) => {
        setEmailError('network error', error.message)
      })
        }
  }
    catch (error) {
      console.log('server error', error)
    } 
  }
  
  

  useEffect(() => {
    swipe.current.addEventListener("swiped-down", () => {
      setActive(false);
    });
  });
  return (
    <div className={active ? styles.modal : styles.hidden}>
      <div className={styles.handler} ref={swipe} onClick={() => setActive(false)}></div>
      <form
        noValidate
        className={styles["registration__form"]}
        action=""
        onSubmit={submitHandler}
      >
        <div className={styles["modal__header"]}>Регистрация</div>
        <div className={styles["modal__input"]}>
          <input
            className={styles["registration__input"]}
            type="email"
            name="email"
            placeholder="Электронная почта"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="reg-email" className={styles["modal__label"]}>
            Электронная почта
          </label>
          {emailError && (
            <div className={styles["error-label"]}>{emailError}</div>
          )}
        </div>
        <div className={styles["modal__input"]}>
          <input
            className={styles["registration__input"]}
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="reg-password" className={styles["modal__label"]}>
            Пароль
          </label>
          {passwordError && (
            <div className={styles["error-label"]}>{passwordError}</div>
          )}
        </div>
        <div className={styles["modal__input"]}>
          <input
            className={styles["registration__input"]}
            type="password"
            placeholder="Подтверждение пароля"
            value={checkPassword}
            onChange={(e) => setCheckPassword(e.target.value)}
          />
          <label
            htmlFor="reg-password-again"
            className={styles["modal__label"]}
          >
            Подтверждение пароля
          </label>
          {passwordError && (
            <div className={styles["error-label"]}>{passwordError}</div>
          )}
        </div>
        {message && (<div className={styles["success-label"]}>{message}</div>)}
        <button className={styles["registration__button"]}>
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
      }

export default RegModal;
