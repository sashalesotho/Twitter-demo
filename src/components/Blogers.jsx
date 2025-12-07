import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPopularUsers } from '../../store/blogersSlice';
import styles from '../styles/Blogers.module.css';

const Blogers = () => {
    const dispatch = useDispatch();

    const { popular, status } = useSelector(state => state.blogers);

    useEffect(() => {
        dispatch(fetchPopularUsers());
    }, [dispatch]);

    if (status === 'loading') {
        return <div className={styles.container}>Загрузка...</div>;
    }

    return (
        <div className={styles.container}>
            <h1>
                Интересные блогеры
            </h1>
            <div className={styles.blogers}>
               {popular.map(b => (
                <div key={b.id} className={styles.bloger}>
                <div className={styles.avatar}>
                <img src={b.avatar_url || "../images/habr.png"} alt="" />
                </div>
                <div className={styles.title}>
                    <div className={styles.name}>{b.username}</div>
                    <div className={styles.nickname}>@{b.nickname}</div>
                    <div className={styles.count}>{b.followers_count} подписчиков</div>
                </div>
                <button className={styles['read-button']}>Читать</button>
                </div>
               )) }
            
                
            </div>


        </div>
    )
}

export default Blogers;