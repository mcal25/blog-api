import { useEffect, useState } from "react";
import { BlogContext } from "./BlogContext.js";
import { apiRequest } from "./helperFunctions";
import { ACCESS_TOKEN_KEY, USER_KEY } from "./constants.js";

export function BlogContextProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) || "null");
    } catch {
      return null;
    }
  });

  useEffect(() => {
    async function loadPosts() {
      const savedUser = JSON.parse(localStorage.getItem(USER_KEY) || "null");
      const isAdmin =
        savedUser?.isAdmin && localStorage.getItem(ACCESS_TOKEN_KEY);
      const response = await apiRequest(
        isAdmin ? "post/admin/collection" : "post/collection",
      );
      if (!response.ok) {
        throw new Error(`Failed to load posts: ${response.status}`);
      }
      setPosts(await response.json());
    }

    loadPosts().catch(console.error);
  }, []);

  return (
    <BlogContext value={{ posts, user, setPosts, setUser }}>
      {children}
    </BlogContext>
  );
}
