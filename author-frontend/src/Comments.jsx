import { useContext, useEffect, useState } from "react";
import { helperURLFunction } from "./helperFunctions";
import { useParams } from "react-router-dom";
import { ACCESS_TOKEN_KEY } from "./constants.js";
import { BlogContext } from "./BlogContext";

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
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
    setComment("");
    console.log('addNewComment end');
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
      <div className="comment-list">
        {comments.map((comment) => {
          return (
            <div className="comment-card" key={comment.id}>
              <p className="comment-body">{comment.body}</p>
            </div>
          );
        })}
      </div>
    </>
  );
};

export { Comments };
