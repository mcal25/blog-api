import styles from './Homepage.module.css';
import { useLocation } from 'react-router-dom';

const Homepage = () => {

    const { pathname } = useLocation();

    return (
        <>
            <h1 className={styles.mainHeader}>Author Frontend</h1>
        </>
    )
}

export { Homepage };