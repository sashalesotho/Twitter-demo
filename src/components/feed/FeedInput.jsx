import styles from "./feed-styles/FeedInput.module.css";

const FeedInput = () => {
    return (
        <>
        <input type="text" className={styles.input} placeholder="Что нового, Александр?"/>
        </>
        
    )
}
export default FeedInput;