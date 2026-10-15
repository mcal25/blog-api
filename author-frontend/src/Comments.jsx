// app.use("/post/:postid/comments", commentRouter);

import { useContext, useEffect, useState } from "react";
import { helperURLFunction } from "./helperFunctions";
import { useParams } from "react-router-dom";
import { BlogContext } from "./BlogContext";

const Comments = () => {
  const [comments, setComments] = useState([]);
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

  return (
    <>
      <h3 className="text-2xl mt-3">Comments:</h3>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105 mt-3 mb-3"
        onClick={() => document.getElementById("my_modal_1").showModal()}
      >
        New comment
      </button>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box bg-blue-300">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">
            Press ESC key or click the button below to close
          </p>
          <div className="modal-action">
            <form method="dialog">
              <textarea className="block" name="" id=""></textarea>
              <button className="btn">Close</button>
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
