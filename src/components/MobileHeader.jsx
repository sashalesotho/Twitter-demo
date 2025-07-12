import styles from '../styles/MobileHeader.module.css';

const MobileHeader = () => {
    return (
        <div className={styles.header}>
                <img className={styles.logo} src="../../images/white_logo.svg" alt="" />
        </div>
    )
}

export default MobileHeader;