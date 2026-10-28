// app.use("/post/:postid/comments", commentRouter);

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
    await fetch(helperURLFunction(`post/${params.postId}/comments/`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`
      },
      body: JSON.stringify({
        comment: comment,
      })
    });
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
      <h3 className="text-2xl mt-3">Comments:</h3>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105 mt-3 mb-3"
        onClick={() => document.getElementById("my_modal_1").showModal()}
      >
        New comment
      </button>
      <dialog
        id="my_modal_1"
        // className="modal p-1.5 fixed inset-0 flex items-center justify-center bg-black/50"
        className="p-5 rounded-lg shadow-xl backdrop:bg-black/50 open:flex open:flex-col open:bg-amber-200 items-center justify-center m-auto min-w-100"
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg text-center pt-1 pb-4">
            Your comment:
          </h3>
          <div className="modal-action">
            <form method="POST" action="">
              <textarea
                name="new-comment-textarea"
                id="new-comment-textarea"
                className="bg-amber-500 p-2 min-w-75 block"
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                  console.log('THE COMMENT OF CONCERN:', comment);
                }
              }
              ></textarea>
              <div className="flex justify-between">
                <button className="btn border-4 border-orange-800 rounded-md mt-4 p-1">
                  Close
                </button>
                <button
                  className="btn border-4 border-green-500 rounded-md mt-4 p-1"
                  onClick={(e) => {
                    e.preventDefault();
                    addNewComment();
                  }}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
      <div>
        {comments.map((comment) => {
          return (
            <>
              <div>
                <p>{comment.body}</p>
              </div>
            </>
          );
        })}
      </div>
    </>
  );
};

export { Comments };
