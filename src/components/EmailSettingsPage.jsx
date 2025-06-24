import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../store/userSlice';
import styles from '../styles/ProfileSettingsPage.module.css';

const EmailSettingsPage = () => {
  const dispatch = useDispatch();
  const { status, error, user } = useSelector((state) => state.user);

  const [newEmail, setNewEmail] = useState(user?.email || '');
  const [password, setPassword] = useState(user?.password || '');
  


  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (newPassword !== newPasswordAgain) {
    //   return setFormError('Пароли не совпадают');
    // }

    try {
      
    } catch (err) {
      
    }
  };
    return (
      <div className={styles.wrapper}>
      <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles['profile-input']}>
            <input
            type="text"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className={styles.input}
          />
          <label className={styles.label}>
            Новая электронная почта        </label>
            </div>
          
            <div className={styles['profile-input']}>
          <input
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
        {status === 'succeeded' && <p className={styles['success-label']}>Профиль обновлён</p>}

        <button type="submit" className={styles.button}>Сохранить</button>
      </form>
    </div>
    )
  }
  
  export default EmailSettingsPage;