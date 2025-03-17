import Blogers from "../Blogers";
import MessagesList from "../MessagesList";
import Topics from "../Topics";
import FeedHeader from "./FeedHeader";
import FeedInput from "./FeedInput";
import FeedMessage from "./FeedMessage";
import User from "./User";
import styles from "./feed-styles/FeedPage.module.css";


const Feed = () => {
    return (<>
    <FeedHeader/>
        <div className={styles.container}>
            
            <div className={styles.left}>
                <FeedInput/>
                <FeedMessage/>
                <MessagesList/>
            </div>
            <div className={styles.right}>
                <User/>
                <Topics/>
                <Blogers/>
            </div>
        </div>
        </>
        
    )
}

export default Feed;