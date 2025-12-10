import styles from '../styles/Topics.module.css';
const Topics = () => {
    return (<div className={styles.container}>
        <h1>Актуальные темы</h1>
        <div className={styles.topics}>
            <div className={styles.topic}>
            <div className={styles.hashtag}>#javascript</div>
            <div className={styles.number}>2941 сообщение</div>
            </div>
            <div className={styles.topic}>
            <div className={styles.hashtag}>#python3</div>
            <div className={styles.number}>29718 сообщений</div>
            </div>
            <div className={styles.topic}>
            <div className={styles.hashtag}>#ruby</div>
            <div className={styles.number}>958186 сообщений</div>
            </div>
            <div className={styles.topic}>
            <div className={styles.hashtag}>#как_научиться_коду?</div>
            <div className={styles.number}>4185 сообщений</div>
            </div>
            <div className={styles.topic}>
            <div className={styles.hashtag}>#помогите_с_кодом</div>
            <div className={styles.number}>482 сообщения</div>
            </div>
        </div>
        
    </div>)
}

export default Topics;