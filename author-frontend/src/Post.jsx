import { useState, useContext, useEffect } from "react";
import { BlogContext } from "./BlogContext";
import { helperURLFunction } from "./helperFunctions";
import { useParams } from "react-router-dom";
import { Comments } from "./Comments";

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
      <h3 className="text-4xl">{post?.title}</h3>
      <p className="mt-5">{post?.body}</p>
      <Comments />
    </div>
  );
};

export { Post };
