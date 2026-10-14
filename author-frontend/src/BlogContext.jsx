import { useState, createContext, useEffect } from "react";
import { getAllPosts } from "../../backend/controllers/postsController";
import { helperURLFunction } from "./helperFunctions";

export const BlogContext = createContext({
    posts: [],
    comments: [],
});

export function BlogContextProvider({ children }) {
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = usestate([]);

    useEffect(() => {
        async function getAllPosts() {
            try {
                // If response is not what we want try using data instead of blogData
                const data = await fetch(helperURLFunction('post/admin/collection'));
                const blogData = await data.json();
                console.log(data);
                setPosts(blogData);
            } catch (err) {
                console.error(err);
            }
        }
        getAllPosts();
    }, []);


    const contextValue = {
        posts,
        comments,   
    }

    return (
        <>
            <BlogContext value={contextValue}>
                {children}
            </BlogContext>
        </>
    )
}