import { useContext } from 'react';
import styles from './Homepage.module.css';
import { useLocation } from 'react-router-dom';
import { BlogContext } from './BlogContext';

const Homepage = () => {

    const { pathname } = useLocation();

    const { posts } = useContext(BlogContext);

    return (
        <>
            <h1 className={styles.mainHeader}>Author Frontend</h1>

            <div>
                {posts.map(post => {
                    return <p>{post.title}</p>
                })}
            </div>
        </>
    )
}

export { Homepage };