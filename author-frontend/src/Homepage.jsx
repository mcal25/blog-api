import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { BlogContext } from "./BlogContext.js";
import { PostCard } from "./PostCard";
import { apiRequest } from "./helperFunctions";

const Homepage = () => {
  const { posts, setPosts, user } = useContext(BlogContext);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");

  async function addNewPost() {
    const response = await apiRequest("post/", {
      method: "POST",
      body: JSON.stringify({ body, title, isPublished }),
    });
    if (!response.ok) {
      throw new Error(`Failed to add post: ${response.status}`);
    }
    const newPost = await response.json();
    setPosts((currentPosts) => [newPost, ...currentPosts]);
    setTitle("");
    setBody("");
    setIsPublished(false);
  }

  async function savePostEdit(e) {
    e.preventDefault();
    const response = await apiRequest(`post/${editingPost.id}`, {
      method: "PUT",
      body: JSON.stringify({ title: editTitle, body: editBody }),
    });
    if (!response.ok) {
      window.alert(`Could not update post (${response.status}).`);
      return;
    }

    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === editingPost.id
          ? { ...post, title: editTitle, body: editBody }
          : post,
      ),
    );
    setEditingPost(null);
    document.getElementById("edit_post_modal")?.close();
  }

  async function deletePost(postId) {
    if (!window.confirm("Delete this post?")) return;

    const response = await apiRequest(`post/${postId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      window.alert(`Could not delete post (${response.status}).`);
      return;
    }

    setPosts((currentPosts) => currentPosts.filter((post) => post.id !== postId));
  }

  return (
    <>
      {user?.username && (
        <p className="welcome-message">Welcome back, {user.username}</p>
      )}
      {user && user.isAdmin ? (
        <>
          <button
            className="new-post-button"
            onClick={() =>
              document.getElementById("new_post_modal").showModal()
            }
          >
            New Post
          </button>
          <dialog id="new_post_modal" className="modal">
            <form
              className="post-modal-form"
              onSubmit={async (event) => {
                event.preventDefault();
                try {
                  await addNewPost();
                  document.getElementById("new_post_modal")?.close();
                } catch (error) {
                  console.error(error);
                }
              }}
            >
              <label htmlFor="new-post-title">Post title</label>
              <input
                id="new-post-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
              <label className="new-post-body-heading" htmlFor="new-post-body">
                Post body
              </label>
              <textarea
                id="new-post-body"
                value={body}
                onChange={(event) => setBody(event.target.value)}
              />
              <label className="publish-option">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(event) => setIsPublished(event.target.checked)}
                />
                Publish immediately
              </label>
              <div className="modal-actions">
                <button
                  className="button-secondary"
                  type="button"
                  onClick={() =>
                    document.getElementById("new_post_modal")?.close()
                  }
                >
                  Close
                </button>
                <button type="submit">Submit</button>
              </div>
            </form>
          </dialog>
          <dialog id="edit_post_modal" className="modal">
            <form className="post-modal-form" onSubmit={savePostEdit}>
              <h3>Edit post</h3>
              <label htmlFor="edit-post-title">Title</label>
              <input
                id="edit-post-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
              <label htmlFor="edit-post-body">Body</label>
              <textarea
                id="edit-post-body"
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
              />
              <div className="modal-actions">
                <button
                  type="button"
                  className="button-secondary"
                  onClick={() => {
                    setEditingPost(null);
                    document.getElementById("edit_post_modal")?.close();
                  }}
                >
                  Cancel
                </button>
                <button type="submit">Save</button>
              </div>
            </form>
          </dialog>
        </>
      ) : null}
      <div className="post-list">
        {posts.map((postCard) => (
          <div className="post-entry" key={postCard.id}>
            <Link className="post-card-link" to={`/post/${postCard.id}`}>
              <PostCard postCard={postCard} showPublicationStatus={user?.isAdmin} />
            </Link>
            {user?.isAdmin && (
              <div className="card-actions">
                <button
                  type="button"
                  className="icon-button"
                  aria-label={`Edit ${postCard.title}`}
                  title="Edit post"
                  onClick={() => {
                    setEditingPost(postCard);
                    setEditTitle(postCard.title);
                    setEditBody(postCard.body);
                    document.getElementById("edit_post_modal")?.showModal();
                  }}
                >
                  ✏
                </button>
                <button
                  type="button"
                  className="icon-button delete-button"
                  aria-label={`Delete ${postCard.title}`}
                  title="Delete post"
                  onClick={() => deletePost(postCard.id)}
                >
                  🗑
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export { Homepage };
