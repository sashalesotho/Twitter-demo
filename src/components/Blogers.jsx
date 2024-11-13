import styles from '../styles/Blogers.module.css';

const Blogers = () => {
    return (
        <div className={styles.container}>
            <h1>
                Интересные блогеры
            </h1>
            <div className={styles.blogers}>
                <div className={styles.bloger}>
                <div className={styles.avatar}>
                <img src="../images/habr.png" alt="" />
                </div>
                <div className={styles.title}>
                    <div className={styles.name}>Хабр Научпоп</div>
                    <div className={styles.nickname}>@habr_popsci</div>
                </div>
                <button className={styles['read-button']}>Читать</button>
                </div>
                <div className={styles.bloger}>
                <div className={styles.avatar}>
                <img src="../images/m.png" alt="" />
                </div>
                <div className={styles.title}>
                    <div className={styles.name}>Матч ТВ</div>
                    <div className={styles.nickname}>@MatchTV</div>
                </div>
                <button className={styles['read-button']}>Читать</button>
                </div>
                <div className={styles.bloger}>
                <div className={styles.avatar}>
                <img src="../images/pm.png" alt="" />
                </div>
                <div className={styles.title}>
                    <div className={styles.name}>Популярная механика</div>
                    <div className={styles.nickname}>@PopMechanica</div>
                </div>
                <button className={styles['read-button']}>Читать</button>
                </div>
            </div>


        </div>
    )
}

export default Blogers;