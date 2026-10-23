import { useState, createContext, useEffect } from "react";
import { helperURLFunction } from "./helperFunctions";

export const BlogContext = createContext({
  posts: [],
  comments: [],
  user: {},
});

export function BlogContextProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function getAllPosts() {
      try {
        // If response is not what we want try using data instead of blogData

        const data = await fetch(helperURLFunction("post/collection"));
        const blogData = await data.json();

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
    user,
    setPosts,
    setComments,
    setUser,
  };

  return (
    <>
      <BlogContext value={contextValue}>{children}</BlogContext>
    </>
  );
}
