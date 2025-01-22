import { useEffect, useRef, useState } from "react";
import styles from "../styles/Modal.module.css";
const AuthModal = ({ active, setActive }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const swipe = useRef();
  useEffect(() => {
    swipe.current.addEventListener("swiped-down", () => {
      setActive(false);
    });
  });

  const isValid = () => {
    let result = true;
    setEmailError("");
    if (email.length === 0) {
      setEmailError("поле не заполнено");
      result = false;
    }
    setPasswordError("");
    if (password.length === 0) {
      setPasswordError("поле не заполнено");
      result = false;
    }
    return result;
  };
  const loginHandler = (e) => {
    e.preventDefault();
    setEmail("");
    setPassword("");
    setSuccessMessage("");
    setErrorMessage("");

    console.log(email, password);
    try {
      if (isValid(this) === true) {
        fetch("/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        })
          .then((res) => {
            if (!res.ok) {
              return res.json().then((error) => {
                setErrorMessage("wrong email or wrong password");
                setSuccessMessage("")
                throw new Error(error.error || "unknown error");
              });
            }
            
            return res.json();
          })
          .then((data) => {
            setSuccessMessage("authorization was successful");
            setErrorMessage("")
          })
          .catch((error) => {
            setErrorMessage("wrong email or wrong password")
            setSuccessMessage("")
            console.log("network error", error);
          });
      }
    } catch (error) {
      setSuccessMessage("")
      setErrorMessage("wrong email or wrong password");
      console.log("server error", error);
    }
  };
  return (
    <div className={active ? styles.modal : styles.hidden}>
      <div
        className={styles.handler}
        ref={swipe}
        onClick={() => setActive(false)}
      ></div>
      <form
        noValidate
        className={styles["registration__form"]}
        action=""
        onSubmit={loginHandler}
      >
        <div className={styles["modal__header"]}>Авторизация</div>
        <div className={styles["modal__input"]}>
          <input
            className={styles["registration__input"]}
            type="email"
            name="email"
            placeholder="Электронная почта"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="auth-email" className={styles["modal__label"]}>
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
            name="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="auth-password" className={styles["modal__label"]}>
            Пароль
          </label>
          {passwordError && (
            <div className={styles["error-label"]}>{passwordError}</div>
          )}
        </div>
        {successMessage && (
          <div className={styles["success-label"]}>{successMessage}</div>
        )}
        {errorMessage && (
          <div className={styles["error-label"]}>{errorMessage}</div>
        )}
        <button className={styles["registration__button"]}>Войти</button>
      </form>
    </div>
  );
};

export default AuthModal;
