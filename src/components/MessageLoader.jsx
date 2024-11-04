import styles from '../styles/MessagesList.module.css';
const MessageLoader = () => {
    return (
        <ul className={styles["posts__list"]} id="posts-list">
          <div className={styles["posts__list-loader"]}>
            <div className={styles["post-loader"]}>
              <div className={styles["post__avatar-loader"]}>
              </div>
              <div className={styles["post__body-loader"]}>
                <div className={styles["post__message-loader"]}></div>
                <div className={styles["post__message-loader"]}></div>
                <div className={styles["post__message-loader"]}></div>
                <div className={styles["post__message-loader"]}></div>
              </div>
            </div>
            <div className={["styles.post-loader"]}>
              <div className={["styles.post__avatar-loader"]}>
              </div>
              <div className={["styles.post__body-loader"]}>
                <div className={["styles.post__message-loader"]}></div>
                <div className={["styles.post__message-loader"]}></div>
                <div className={["styles.post__message-loader"]}></div>
                <div className={["styles.post__message-loader"]}></div>
              </div>
            </div>
            <div className={["styles.post-loader"]}>
              <div className={["styles.post__avatar-loader"]}>
              </div>
              <div className={["styles.post__body-loader"]}>
                <div className={["styles.post__message-loader"]}></div>
                <div className={["styles.post__message-loader"]}></div>
                <div className={["styles.post__message-loader"]}></div>
                <div className={["styles.post__message-loader"]}></div>
              </div>
            </div>
          </div>
        </ul>
    )
}

export default MessageLoader;