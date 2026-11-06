import { useState, useEffect, useContext } from "react";
import { apiRequest, helperURLFunction } from "./helperFunctions";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Comments } from "./Comments";
import { BlogContext } from "./BlogContext.js";
import { ACCESS_TOKEN_KEY, USER_KEY } from "./constants.js";

const Post = () => {
  const { user, setPosts } = useContext(BlogContext);
  const [post, setPost] = useState();
  const [error, setError] = useState("");
  const params = useParams();
  useEffect(() => {
    async function getSpecificPost() {
      try {
        const user = JSON.parse(localStorage.getItem(USER_KEY) || "null");
        const token = localStorage.getItem(ACCESS_TOKEN_KEY);
        const isAdmin = user?.isAdmin && token;
        const response = await fetch(
          helperURLFunction(
            isAdmin
              ? `post/admin/${params.postId}`
              : `post/${params.postId}`,
          ),
          isAdmin ? { headers: { Authorization: `Bearer ${token}` } } : {},
        );
        if (!response.ok) {
          throw new Error(`Could not load post (${response.status}).`);
        }
        setPost(await response.json());
      } catch (err) {
        setError(err.message);
      }
    }
    getSpecificPost();
  }, [params.postId]);

  async function togglePublished() {
    const isPublished = !post.isPublished;
    try {
      const response = await apiRequest(`post/${post.id}`, {
        method: "PUT",
        body: JSON.stringify({ isPublished }),
      });
      if (!response.ok) {
        throw new Error(`Could not update publication status (${response.status}).`);
      }

      setPost((currentPost) => ({ ...currentPost, isPublished }));
      setPosts((currentPosts) =>
        currentPosts.map((currentPost) =>
          currentPost.id === post.id
            ? { ...currentPost, isPublished }
            : currentPost,
        ),
      );
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="post-detail">
      <Link className="post-back-link" to="/" aria-label="Back to homepage" title="Back to homepage">
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M19 12H5m0 0 7 7m-7-7 7-7" />
        </svg>
      </Link>
      {error && <p className="error">{error}</p>}
      <article className="post-content" id={`post-${params.postId}`}>
        {user?.isAdmin && post && (
          <div className="post-publication-controls">
            <small
              className={`publication-status ${post.isPublished ? "published" : "unpublished"}`}
            >
              {post.isPublished ? "Published" : "Unpublished"}
            </small>
            <button type="button" onClick={togglePublished}>
              {post.isPublished ? "Unpublish" : "Publish"}
            </button>
          </div>
        )}
        <h3 className="post-title">{post?.title}</h3>
        <p className="post-body">{post?.body}</p>
      </article>
      <Comments />
    </main>
  );
};

export { Post };
