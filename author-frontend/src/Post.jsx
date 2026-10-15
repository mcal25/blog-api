import { useState, useContext, useEffect } from "react";
import { BlogContext } from "./BlogContext";
import { helperURLFunction } from "./helperFunctions";
import { useParams } from "react-router-dom";

const Post = () => {
  const [post, setPost] = useState();
  const params = useParams();
  console.log('Params:', params);
  useEffect(() => {
    async function getSpecificPost() {
      try {
        const data = await fetch(helperURLFunction(`post/${params.postId}`));
        console.log("Data:", data);
        const blogData = await data.json();
        console.log("BlogData:", blogData);
        setPost(blogData);
      } catch (err) {
        console.error(err);
      }
    }
    getSpecificPost();
  }, []);

  return (
    <div>
      <h3>{post?.title}</h3>
      <p>{post?.body}</p>
    </div>
  );
};

export { Post };
