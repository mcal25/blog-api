import { useEffect, useState } from "react";
import "./App.css";

const api = (path, options = {}) => {
  const token = localStorage.getItem("access_token");
  return fetch(`/api${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
};

const changeCommentCount = (posts, postId, change) =>
  posts.map((post) =>
    post.id === postId
      ? {
          ...post,
          _count: {
            ...post._count,
            comments: Math.max(0, (post._count?.comments ?? 0) + change),
          },
        }
      : post,
  );

function App() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState("");
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });
  const [authMode, setAuthMode] = useState("login");
  const [error, setError] = useState("");

  useEffect(() => {
    api("/post/collection")
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load posts.");
        setPosts(await response.json());
      })
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    if (!selectedPost) return;
    api(`/post/${selectedPost.id}/comments/`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Could not load comments (${response.status}).`);
        }
        setComments(await response.json());
      })
      .catch((err) => setCommentsError(err.message))
      .finally(() => setCommentsLoading(false));
  }, [selectedPost]);

  async function authenticate(event) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await api(`/auth/${authMode}`, {
      method: "POST",
      body: JSON.stringify({
        username: form.get("username"),
        password: form.get("password"),
      }),
    });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error || "Could not sign in.");
      return;
    }
    localStorage.setItem("access_token", result.token);
    localStorage.setItem("user", JSON.stringify(result.user));
    setUser(result.user);
    document.getElementById("auth-dialog")?.close();
  }

  async function addComment(event) {
    event.preventDefault();
    const response = await api(`/post/${selectedPost.id}/comments/`, {
      method: "POST",
      body: JSON.stringify({ comment: commentText }),
    });
    if (!response.ok) {
      setError("Could not add comment. Please sign in and try again.");
      return;
    }
    const newComment = await response.json();
    setComments((current) => [newComment, ...current]);
    setCommentText("");
    setPosts((current) =>
      changeCommentCount(current, selectedPost.id, 1),
    );
  }

  async function saveComment(event) {
    event.preventDefault();
    const response = await api(
      `/post/${selectedPost.id}/comments/${editingComment.id}`,
      { method: "PUT", body: JSON.stringify({ body: editCommentText }) },
    );
    if (!response.ok) {
      setError("Could not update comment.");
      return;
    }
    setComments((current) =>
      current.map((comment) =>
        comment.id === editingComment.id
          ? { ...comment, body: editCommentText }
          : comment,
      ),
    );
    setEditingComment(null);
    document.getElementById("edit-comment")?.close();
  }

  async function deleteComment(commentId) {
    if (!window.confirm("Delete this comment?")) return;
    const response = await api(
      `/post/${selectedPost.id}/comments/${commentId}`,
      { method: "DELETE" },
    );
    if (!response.ok) {
      setError("Could not delete comment.");
      return;
    }
    setComments((current) =>
      current.filter((comment) => comment.id !== commentId),
    );
    setPosts((current) =>
      changeCommentCount(current, selectedPost.id, -1),
    );
  }

  function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <main className="reader">
      <header className="page-header">
        <h1 className="site-title">
          <a className="brand-link" href="/" aria-label="Bloggy McBlogFace home">
            <svg className="brand-face" viewBox="0 0 36 36" aria-hidden="true">
              <path d="M18 3v4M15 3h6" />
              <rect x="5" y="8" width="26" height="23" rx="7" />
              <path d="M12 17h.01M24 17h.01M12 22c1.5 2 3.5 3 6 3s4.5-1 6-3" />
            </svg>
            <span>Bloggy McBlogFace</span>
          </a>
        </h1>
        {user && localStorage.getItem("access_token") ? (
          <div className="account">
            <span>Signed in as {user.username}</span>
            <button className="secondary-button" onClick={logout}>Log out</button>
          </div>
        ) : (
          <div className="header-actions">
            <button onClick={() => {
              setAuthMode("login");
              document.getElementById("auth-dialog")?.showModal();
            }}>Log in</button>
            <button className="secondary-button" onClick={() => {
              setAuthMode("signup");
              document.getElementById("auth-dialog")?.showModal();
            }}>Sign up</button>
          </div>
        )}
      </header>

      {error && <p className="error">{error}</p>}

      <dialog id="auth-dialog" className="modal">
        <form className="auth-form" onSubmit={authenticate}>
          <h2>{authMode === "signup" ? "Create an account" : "Log in"}</h2>
          {error && <p className="error">{error}</p>}
          <label>
            Username
            <input name="username" required autoComplete="username" />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              required
              autoComplete={authMode === "signup" ? "new-password" : "current-password"}
            />
          </label>
          <div className="form-actions">
            <button type="button" className="secondary-button" onClick={() => document.getElementById("auth-dialog")?.close()}>Cancel</button>
            <button type="submit">{authMode === "signup" ? "Sign up" : "Log in"}</button>
          </div>
          <button type="button" className="text-button" onClick={() => setAuthMode(authMode === "signup" ? "login" : "signup")}>
            {authMode === "signup" ? "Already have an account? Log in" : "Need an account? Sign up"}
          </button>
        </form>
      </dialog>

      {selectedPost ? (
        <section className="post-detail">
          <button
            className="post-back-link"
            aria-label="Back to homepage"
            title="Back to homepage"
            onClick={() => setSelectedPost(null)}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M19 12H5m0 0 7 7m-7-7 7-7" />
            </svg>
          </button>
          <article className="post-card" id={`post-${selectedPost.id}`}>
            <h2 className="post-title">{selectedPost.title}</h2>
            <p className="post-body">{selectedPost.body}</p>
            <small>💬 {comments.length} comments</small>
          </article>
          <h2>Comments</h2>
          <div className="comment-list">
            {commentsLoading && <p>Loading comments…</p>}
            {commentsError && <p className="error">{commentsError}</p>}
            {comments.map((comment) => {
              const isOwner =
                user && String(comment.userId) === String(user.id);
              return (
                <article className="comment-card" key={comment.id}>
                  <small className="comment-author">
                    {comment.user?.username ?? "Unknown user"}
                  </small>
                  <p className="comment-body">{comment.body}</p>
                  {isOwner && (
                    <div className="comment-actions">
                      <button
                        className="icon-button"
                        aria-label="Edit comment"
                        title="Edit comment"
                        onClick={() => {
                          setEditingComment(comment);
                          setEditCommentText(comment.body);
                          document.getElementById("edit-comment")?.showModal();
                        }}
                      >
                        ✏
                      </button>
                      <button
                        className="icon-button delete-button"
                        aria-label="Delete comment"
                        title="Delete comment"
                        onClick={() => deleteComment(comment.id)}
                      >
                        🗑
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
            {user && (
              <form className="comment-form" onSubmit={addComment}>
                <textarea
                  aria-label="Your comment"
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(event) => setCommentText(event.target.value)}
                  required
                />
                <button type="submit">Add comment</button>
              </form>
            )}
            {!user && <p>Sign in to leave a comment.</p>}
            {!commentsLoading && !commentsError && comments.length === 0 && (
              <p>No comments yet.</p>
            )}
          </div>
        </section>
      ) : (
        <section className="post-list" aria-label="Posts">
          {posts.map((post) => (
            <article className="post-card" key={post.id}>
              <button
                className="post-open"
                onClick={() => {
                  setComments([]);
                  setCommentsLoading(true);
                  setCommentsError("");
                  setSelectedPost(post);
                }}
              >
                <h2 className="post-title">{post.title}</h2>
                <p className="post-body">{post.body}</p>
                <small>
                  💬 {post._count?.comments ?? 0} comments · Read post
                </small>
              </button>
            </article>
          ))}
        </section>
      )}

      <dialog id="edit-comment" className="modal">
        <form className="edit-form" onSubmit={saveComment}>
          <h2>Edit comment</h2>
          <label>
            Comment
            <textarea
              value={editCommentText}
              onChange={(event) => setEditCommentText(event.target.value)}
            />
          </label>
          <div className="form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => document.getElementById("edit-comment")?.close()}
            >
              Cancel
            </button>
            <button type="submit">Save</button>
          </div>
        </form>
      </dialog>
    </main>
  );
}

export default App;
