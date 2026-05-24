import { useEffect, useRef, useState } from "react";
import NewMessage from "./NewMessage";
import Blogers from "./Blogers";
import FeedMessagesList from "./FeedMessagesList";
import Topics from "./Topics";
import FeedHeader from "./FeedHeader";
import FeedMessage from "./FeedMessage";
import User from "./User";
import MobileHeader from "./MobileHeader";
import styles from "../styles/FeedPage.module.css";
import MobileFooter from "./MobileFooter";
import MessagesList from "./MessagesList";


const Feed = () => {
    const [messageModalActive, setMessageModalActive] = useState(false);
    return (
        <>
        <div className={styles["mobile-container"]}>
            
            <MobileHeader />
            <MessagesList />
            <MobileFooter />
            <button className={styles.write} onClick={() => setMessageModalActive(true)}><img src="/images/write.svg" alt="" /></button>
            <NewMessage active={messageModalActive} setActive={setMessageModalActive} />
            </div>
            
            
        
        <div className={styles["desktop-container"]}>
        <FeedHeader />
        <div className={styles["desktop-body"]}>
            <div className={styles["desktop-left"]}>
                <FeedMessage />
                <FeedMessagesList />
            </div>
            <div className={styles["desktop-right"]}>
                <User/>
                <Topics/>
                <Blogers/>
            </div>
            </div>
        </div>
        </>
        
    )
}

export default Feed;