import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateEmail } from '../../store/userSlice';
import validateEmail from '../../assets/is_valid_email.js';
import styles from '../styles/ProfileSettingsPage.module.css';

const EmailSettingsPage = () => {
  const currentEmail = useSelector((state) => state.user.email);
  const dispatch = useDispatch();
  const { status, error, user } = useSelector((state) => state.user);

  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');

  const [success, setSuccess] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccess('');

    if (!validateEmail(newEmail)) {
      return setFormError('Некорректный формат email');
    }
    if (newEmail === currentEmail) {
      return setFormError('Новый email совпадает с текущим');
    }
    if (!password) {
      return setFormError('Введите пароль для подтверждения');
    }
    try {
      const result = await dispatch(updateEmail({ newEmail, password })).unwrap();
      setSuccess('Email успешно обновлён');
      setNewEmail('');
      setPassword('');
    } catch (err) {
      setFormError(err.message || 'Ошибка при смене email');
    }
  };

    return (
      <div className={styles.wrapper}>
      <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles['profile-input']}>
            <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className={styles.input}
          />
          <label className={styles.label}>
            Новая электронная почта        </label>
            </div>
          
            <div className={styles['profile-input']}>
          <input
          type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
          <label className={styles.label}>
          Пароль для подтверждения
        </label>
        </div>
        
        {formError && <p className={styles['error-label']}>{formError}</p>}
        {status === 'loading' && <p className={styles.info}>Сохраняем...</p>}
        {status === 'success' && <p className={styles['success-label']}>Email успешно обновлён</p>}

        <button type="submit" className={styles.button}>Сохранить</button>
      </form>
    </div>
    )
  }
  
  export default EmailSettingsPage;
