import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePassword } from '../../store/userSlice';
import styles from '../styles/ProfileSettingsPage.module.css';

const PasswordSettingsPage = () => {
  const dispatch = useDispatch();
  const { passwordChangeStatus, passwordChangeError } = useSelector((state) => state.user);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return setFormError('Пароли не совпадают');
    }

    if (newPassword.length < 8) {
      return setFormError('Пароль должен быть не менее 8 символов');
    }
    if (newPassword === oldPassword) {
      return setFormError('Новый пароль должен отличаться от текущего');
    }
    

    try {
      await dispatch(updatePassword({ oldPassword, newPassword, confirmPassword })).unwrap();
    setFormError('');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    } catch (err) {
      setFormError(err.error || 'Ошибка при смене пароля');
    }
  };
    return (
      <div className={styles.wrapper}>
      <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles['profile-input']}>
            <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className={styles.input}
          />
          <label className={styles.label}>
          Старый пароль
        </label>
            </div>
          
            <div className={styles['profile-input']}>
          <input
          type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={styles.input}
          />
          <label className={styles.label}>
          Новый пароль
        </label>
        </div>
          
        <div className={styles['profile-input']}>
          <input
          type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={styles.input}
          />
          <label className={styles.label}>
          Новый пароль еще раз
        </label>
        </div>
        
        {formError && <p className={styles['error-label']}>{formError}</p>}
        {passwordChangeError && <p className={styles['error-label']}>{[passwordChangeError]}</p>}
        {passwordChangeStatus === 'loading' && (
          <p className={styles.info}>Сохраняем...</p>
        )}
        {passwordChangeStatus === 'succeeded' && <p className={styles['success-label']}>Пароль обновлён</p>}

        <button type="submit" className={styles.button}>Сохранить</button>
      </form>
    </div>
    )
  }
  
  export default PasswordSettingsPage;


