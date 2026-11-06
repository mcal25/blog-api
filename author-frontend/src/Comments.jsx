import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { changePostCommentCount, helperURLFunction } from "./helperFunctions";
import { ACCESS_TOKEN_KEY } from "./constants.js";
import { BlogContext } from "./BlogContext.js";

const Comments = () => {
  const { user, setPosts } = useContext(BlogContext);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editBody, setEditBody] = useState("");
  const params = useParams();
  useEffect(() => {
    async function getAllCommentsForPost() {
      try {
        const response = await fetch(
          helperURLFunction(`post/${params.postId}/comments/`),
        );
        if (!response.ok) {
          throw new Error(`Failed to load comments: ${response.status}`);
        }
        setComments(await response.json());
      } catch (err) {
        console.error(err);
      }
    }
    getAllCommentsForPost();
  }, [params.postId]);

  async function addNewComment() {
    const response = await fetch(helperURLFunction(`post/${params.postId}/comments/`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`
      },
      body: JSON.stringify({
        comment: comment,
      })
    });
    if (!response.ok) {
      throw new Error(`Failed to add comment: ${response.status}`);
    }
    const newComment = await response.json();
    setComments((currentComments) => [newComment, ...currentComments]);
    setPosts((posts) => changePostCommentCount(posts, params.postId, 1));
    setComment("");
  }

  async function saveCommentEdit(e) {
    e.preventDefault();
    const response = await fetch(
      helperURLFunction(
        `post/${params.postId}/comments/${editingComment.id}`,
      ),
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
        },
        body: JSON.stringify({ body: editBody }),
      },
    );
    if (!response.ok) {
      window.alert(`Could not update comment (${response.status}).`);
      return;
    }

    setComments((currentComments) =>
      currentComments.map((currentComment) =>
        currentComment.id === editingComment.id
          ? { ...currentComment, body: editBody }
          : currentComment,
      ),
    );
    setEditingComment(null);
    document.getElementById("edit_comment_modal")?.close();
  }

  async function deleteComment(commentId) {
    if (!window.confirm("Delete this comment?")) return;

    const response = await fetch(
      helperURLFunction(`post/${params.postId}/comments/${commentId}`),
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
        },
      },
    );
    if (!response.ok) {
      window.alert(`Could not delete comment (${response.status}).`);
      return;
    }

    setComments((currentComments) =>
      currentComments.filter((currentComment) => currentComment.id !== commentId),
    );
    setPosts((posts) => changePostCommentCount(posts, params.postId, -1));
  }

  return (
    <section className="comments-section">
      <h3 className="comments-heading">Comments:</h3>
      <button
        className="new-comment-button"
        onClick={() => document.getElementById("my_modal_1").showModal()}
      >
        New comment
      </button>
      <dialog id="my_modal_1" className="modal">
        <h3>Your comment:</h3>
        <form
          className="comment-modal-form"
          onSubmit={async (event) => {
            event.preventDefault();
            try {
              await addNewComment();
              document.getElementById("my_modal_1")?.close();
            } catch (error) {
              console.error(error);
            }
          }}
        >
          <textarea
            id="new-comment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
          <div className="modal-actions">
            <button
              type="button"
              className="button-secondary"
              onClick={() => document.getElementById("my_modal_1")?.close()}
            >
              Close
            </button>
            <button type="submit">Submit</button>
          </div>
        </form>
      </dialog>
      <dialog id="edit_comment_modal" className="modal">
        <form className="comment-modal-form" onSubmit={saveCommentEdit}>
          <h3>Edit comment</h3>
          <textarea
            value={editBody}
            onChange={(e) => setEditBody(e.target.value)}
          />
          <div className="modal-actions">
            <button
              type="button"
              className="button-secondary"
              onClick={() => {
                setEditingComment(null);
                document.getElementById("edit_comment_modal")?.close();
              }}
            >
              Cancel
            </button>
            <button type="submit">Save</button>
          </div>
        </form>
      </dialog>
      <div className="comment-list">
        {comments.map((comment) => {
          const canManage =
            user?.isAdmin || String(comment.userId) === String(user?.id);
          return (
            <div className="comment-card" key={comment.id}>
              <small className="comment-author">
                {comment.user?.username ?? "Unknown user"}
              </small>
              <p className="comment-body">{comment.body}</p>
              {canManage && (
                <div className="card-actions">
                  <button
                    type="button"
                    className="icon-button"
                    aria-label="Edit comment"
                    title="Edit comment"
                    onClick={() => {
                      setEditingComment(comment);
                      setEditBody(comment.body);
                      document
                        .getElementById("edit_comment_modal")
                        ?.showModal();
                    }}
                  >
                    ✏
                  </button>
                  <button
                    type="button"
                    className="icon-button delete-button"
                    aria-label="Delete comment"
                    title="Delete comment"
                    onClick={() => deleteComment(comment.id)}
                  >
                    🗑
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export { Comments };
