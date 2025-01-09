import { useEffect, useRef, useState } from "react";
import validateEmail from "../../assets/is_valid_email";
import styles from "../styles/Modal.module.css";
import { response } from "express";
const RegModal = ({ active, setActive }) => {
  const swipe = useRef();
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
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
  function submitHandler(e) {
    e.preventDefault();
    if (isValid(this) === true) {
      console.log(email, password, checkPassword);
      try {
        fetch('/createUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({email, password}),
        })
        .then((response) => {
        if (!response.ok) {
          return response.json().then((error) => {
            throw new Error(error || 'registration error');
          });
        }
        return response.json();
      })
      .catch ((error) => {
        console.log(error);
      });
      }
      catch (error) {
      console.log(error);
    }
      setEmail('');
      setPassword('');
      setCheckPassword('');
  };
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

        <button className={styles["registration__button"]}>
          Зарегестрироваться
        </button>
      </form>
    </div>
  );
};

export default RegModal;
