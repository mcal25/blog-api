import { useContext } from 'react';
import styles from './Homepage.module.css';
import { useLocation, Link } from 'react-router-dom';
import { BlogContext } from './BlogContext';
import { PostCard } from './PostCard';


const Homepage = () => {

    const { pathname } = useLocation();

    const { posts } = useContext(BlogContext);

    

    return (
        <>
            <h1 className={styles.mainHeader}>Author Frontend</h1>

            <div>
                {posts.map(postCard => {
                    return (
                        <>
                            <Link to={`/post/${postCard.id}`}>
                                <PostCard postCard={postCard} key={postCard.id}></PostCard>
                            </Link>
                        </>
                    )
                })}
            </div>
        </>
    )
}

export { Homepage };