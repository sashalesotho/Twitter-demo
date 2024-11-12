import styles from '../styles/Header.module.css';
const Header = () => {
    return (
    <div className={styles.container}>
    <img className={styles.logo} src="images/logo.svg" alt="логотип" />
    </div>
    )
}

export default Header;