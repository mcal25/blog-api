import { useContext, useEffect, useState } from "react";
import { helperURLFunction } from "./helperFunctions";
import { useParams } from "react-router-dom";
import { ACCESS_TOKEN_KEY } from "./constants.js";
import { BlogContext } from "./BlogContext";

const Comments = () => {
  const { user, setPosts } = useContext(BlogContext);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editBody, setEditBody] = useState("");
  const params = useParams();
  console.log("comments:", comments);
  useEffect(() => {
    console.log('useEffect is running');
    async function getAllCommentsForPost() {
      try {
        console.log(
          "TEEHEE",
          helperURLFunction(`post/${params.postId}/comments`),
        );
        const data = await fetch(
          helperURLFunction(`post/${params.postId}/comments/`),
        );
        const blogData = await data.json();
        setComments(blogData);
      } catch (err) {
        console.error(err);
      }
    }
    getAllCommentsForPost();
  }, []);
  // 1: DONE make it so func runs when button pressed
  // 2: DONE make it so that function gets value from text box when it runs
  // 3: make it so that value gets sent to backend
  async function addNewComment() {
    console.log('addNewComment start');
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
    setPosts((posts) =>
      posts.map((post) =>
        String(post.id) === params.postId
          ? {
              ...post,
              _count: { ...post._count, comments: (post._count?.comments ?? 0) + 1 },
            }
          : post,
      ),
    );
    setComment("");
    console.log('addNewComment end');
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
    setPosts((posts) =>
      posts.map((post) =>
        String(post.id) === params.postId
          ? {
              ...post,
              _count: {
                ...post._count,
                comments: Math.max(0, (post._count?.comments ?? 0) - 1),
              },
            }
          : post,
      ),
    );
  }

    // const response = await fetch(helperURLFunction(`auth/login`), {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     username: username,
    //     password: password,
    //   }),
    // });

  return (
    <>
      <h3 className="comments-heading">Comments:</h3>
      <button
        className="new-comment-button"
        onClick={() => document.getElementById("my_modal_1").showModal()}
      >
        New comment
      </button>
      <dialog
        id="my_modal_1"
        className="modal"
      >
        <div>
          <h3>Your comment:</h3>
          <div>
            <form
              className="comment-modal-form"
              method="POST"
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await addNewComment();
                  document.getElementById("my_modal_1")?.close();
                } catch (err) {
                  console.error(err);
                }
              }}
            >
              <textarea
                name="new-comment-textarea"
                id="new-comment-textarea"
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                  console.log('THE COMMENT OF CONCERN:', comment);
                }
              }
              ></textarea>
              <div className="modal-actions">
                <button
                  type="button"
                  className="button-secondary"
                  onClick={() =>
                    document.getElementById("my_modal_1")?.close()
                  }
                >
                  Close
                </button>
                <button
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
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
    </>
  );
};

export { Comments };
