import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../store/userSlice';
import styles from '../styles/ProfileSettingsPage.module.css';

const ProfileSettingsPage = () => {
  const dispatch = useDispatch();
  const { status, error, user } = useSelector((state) => state.user);

  const [username, setUsername] = useState(user?.username || '');
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [geo, setGeo] = useState(user?.geo || '');
  const [site, setSite] = useState(user?.site || '');
  const [birthday, setBirthday] = useState(user?.birthday || '');


  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      return setFormError('Никнейм не может быть пустым');
    }

    try {
      await dispatch(updateProfile({ username, nickname, bio, geo, site, birthday })).unwrap();
      setFormError('');
    } catch (err) {
      setFormError(err.error || 'Ошибка обновления');
    }
  };

  return (
    <div className={styles.wrapper}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.head}>
          <div className={styles.names}>
            <div className={styles['profile-input']}>
            <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
          />
          <label className={styles.label}>
          Ваше имя
        </label>
            </div>
          
            <div className={styles['profile-input']}>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className={styles.input}
          />
          <label className={styles.label}>
          Никнейм
        </label>
        </div>
          </div>
          <div className={styles.photobutton}>
          <img src="../../public/images/addphoto.svg" alt="" />
          </div>
        
        </div>
        
        <div className={styles['profile-input']}>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className={styles.input}
          />
          <label className={styles.label}>
          О себе
        </label>
        </div>

        <div className={styles['profile-input']}>
          <input
            value={geo}
            onChange={(e) => setGeo(e.target.value)}
            className={styles.input}
          />
          <label className={styles.label}>
          Геопозиция
        </label>
        </div>
        <div className={styles['profile-input']}>
          <input
            value={site}
            onChange={(e) => setSite(e.target.value)}
            className={styles.input}
          />
          <label className={styles.label}>
          Веб-сайт
        </label>
        </div>
        <div className={styles.bithday}>
        <div className={styles['profile-input']}>
          <input
          type='date'
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            className={`${styles.input} ${styles['bithday-input']}`}
          />
          <label className={styles.label}>
          Дата рождения
        </label>
        </div>
        <div>
        <select name="" id="" className={`${styles.input} ${styles['bithday-input']}`}>
    <option value="">Показывать всем</option>
        </select>
        <label className={styles.label}>
          Показывать дату рождения
        </label>
        </div>
        </div>
       

        {formError && <p className={styles['error-label']}>{formError}</p>}
        {status === 'loading' && <p className={styles.info}>Сохраняем...</p>}
        {status === 'succeeded' && <p className={styles['success-label']}>Профиль обновлён</p>}

        <button type="submit" className={styles.button}>Сохранить</button>
      </form>
    </div>
  );
};

export default ProfileSettingsPage;
