import { useState, createContext, useEffect } from "react";
import { helperURLFunction } from "./helperFunctions";

export const BlogContext = createContext({
  posts: [],
  comments: [],
  greeting: null,
});

export function BlogContextProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [greeting, setGreeting] = useState(null);

  useEffect(() => {
    async function getAllPosts() {
      try {
        // If response is not what we want try using data instead of blogData

        const data = await fetch(helperURLFunction("post/collection"));
        console.log(data.statusText);
        const blogData = await data.json();

        setPosts(blogData);
        console.log(blogData);
      } catch (err) {
        console.error(err);
      }
    }
    getAllPosts();
  }, []);

  const contextValue = {
    posts,
    comments,
    greeting,
    setPosts,
    setComments,
    setGreeting
  };

  return (
    <>
      <BlogContext value={contextValue}>{children}</BlogContext>
    </>
  );
}
