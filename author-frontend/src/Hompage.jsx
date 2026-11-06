import { useContext, useEffect, useState } from "react";
import styles from "./Homepage.module.css";
import { Link } from "react-router-dom";
import { BlogContext } from "./BlogContext";
import { PostCard } from "./PostCard";
import { helperURLFunction } from "./helperFunctions";
import { ACCESS_TOKEN_KEY, USER_KEY } from "./constants";

const Homepage = () => {
  const { posts, setPosts, user, setUser } = useContext(BlogContext);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editingPost, setEditingPost] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token && localStorage.getItem(USER_KEY)) {
      try {
        console.log(user);
        setUser(JSON.parse(localStorage.getItem(USER_KEY)));
      } catch (err) {
        console.log(err);
      }
    }
    setLoading(false);
  }, []);

  async function doLogin(e) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget.form);
    const username = formData.get("usernameInput");
    const password = formData.get("passwordInput");

    const response = await fetch(helperURLFunction(`auth/login`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    if (response.ok) {
      const data = await response.json();

      console.log("Data at line 50:", data);
      localStorage.setItem(ACCESS_TOKEN_KEY, data.token);

      if (data.user) {
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        setUser(data.user);
        console.log("User after line 57", data.user);
      }
    } else {
      const errorData = await response.json();
      console.error("Login failed:", errorData);
    }
  }

  async function addNewPost() {
    const response = await fetch(helperURLFunction(`post/`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
      },
      body: JSON.stringify({
        body: body,
        title: title,
      }),
    });
    if (!response.ok) {
      throw new Error(`Failed to add post: ${response.status}`);
    }
    const newPost = await response.json();
    setPosts((currentPosts) => [newPost, ...currentPosts]);
    setTitle("");
    setBody("");
  }

  async function savePostEdit(e) {
    e.preventDefault();
    const response = await fetch(
      helperURLFunction(`post/${editingPost.id}`),
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
        },
        body: JSON.stringify({ title: editTitle, body: editBody }),
      },
    );
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

    const response = await fetch(helperURLFunction(`post/${postId}`), {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
      },
    });
    if (!response.ok) {
      window.alert(`Could not delete post (${response.status}).`);
      return;
    }

    setPosts((currentPosts) => currentPosts.filter((post) => post.id !== postId));
  }

  console.log(user);

  return (
    <>
      {user != null && user.username ? (
        <h1
          className={styles.mainHeader}
        >{`Welcome back, ${user.username}`}</h1>
      ) : (
        <h1 className={styles.mainHeader}>Bloggy McBlogFace</h1>
      )}
      {!user && loading == false ? (
        <form className="login-form" method="POST">
          <label htmlFor="usernameInput">Username</label>
          <input
            type="text"
            name="usernameInput"
            id="usernameInput"
          />
          <label htmlFor="passwordInput">Password</label>
          <input
            type="password"
            id="passwordInput"
            name="passwordInput"
          />
          <button
            type="button"

            // onClick={(e) => {
            //   e.preventDefault();
            //   doLogin();
            // }}
            onClick={doLogin}
          >
            log my ass in
          </button>
        </form>
      ) : (
        <h1 className="logged-in-message">You Are Logged In My Guy</h1>
      )}
      {user && user.isAdmin ? (
        <>
          {console.log("they be admin")}
          <button
            className="new-post-button"
            onClick={() =>
              document.getElementById("new_post_modal").showModal()
            }
          >
            New Post
          </button>
          <dialog
            id="new_post_modal"
            className="modal"
          >
            <div>
              <h3>Post Title:</h3>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  console.log("title:", title);
                }}
              />
              <h3>Post Body:</h3>
              <div>
                <form
                  className="post-modal-form"
                  method="POST"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      await addNewPost();
                      document.getElementById("new_post_modal")?.close();
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                >
                  <textarea
                    name="new-comment-textarea"
                    id="new-comment-textarea"
                    value={body}
                    onChange={(e) => {
                      setBody(e.target.value);
                      console.log("body:", body);
                    }}
                  ></textarea>
                  <div className="modal-actions">
                    <button
                      className="button-secondary"
                      type="button"
                      onClick={() => {
                        document.getElementById("new_post_modal")?.close();
                      }}
                    >
                      Close
                    </button>
                    <button type="submit">
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
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
      ) : (
        <>{console.log("they do not be admin")}</>
      )}
      <div className="post-list">
        {posts.map((postCard) => {
          return (
            <div className="post-entry" key={postCard.id}>
              <Link className="post-card-link" to={`/post/${postCard.id}`}>
                <PostCard postCard={postCard}></PostCard>
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
          );
        })}
      </div>
    </>
  );
};

export { Homepage };
