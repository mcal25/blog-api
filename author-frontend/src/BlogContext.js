import { createContext } from "react";

export const BlogContext = createContext({
  posts: [],
  user: null,
  setPosts: () => {},
  setUser: () => {},
});
