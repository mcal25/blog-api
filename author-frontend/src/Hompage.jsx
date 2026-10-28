import { useContext, useEffect, useState } from "react";
import styles from "./Homepage.module.css";
import { useLocation, Link, data } from "react-router-dom";
import { BlogContext } from "./BlogContext";
import { PostCard } from "./PostCard";
import { helperURLFunction } from "./helperFunctions";
import { ACCESS_TOKEN_KEY, USER_KEY } from "./constants";

const Homepage = () => {
  const { pathname } = useLocation();

  const { posts, user, setUser } = useContext(BlogContext);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

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
    await fetch(helperURLFunction(`post/`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
      },
      body: JSON.stringify({
        body: body,
        title: title,
      }),
    });
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
        <form method="POST">
          <label htmlFor="usernameInput">Username</label>
          <input
            type="text"
            name="usernameInput"
            id="usernameInput"
            className="border-8 border-amber-300 m-10 p-5 rounded-2xl"
          />
          <label htmlFor="passwordInput">Password</label>
          <input
            type="password"
            id="passwordInput"
            name="passwordInput"
            className="border-8 border-amber-300 m-10 p-5 rounded-2xl"
          />
          <button
            type="button"
            className="border-8 border-amber-300 m-10 p-5 rounded-2xl"
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
        <h1 className="m-10 text-center">You Are Logged In My Guy</h1>
      )}
      {user && user.isAdmin ? (
        <>
          {console.log("they be admin")}
          <button
            className="border-8 border-amber-950 m-10 p-3 rounded-2xl ml-auto mr-auto"
            onClick={() =>
              document.getElementById("new_post_modal").showModal()
            }
          >
            New Post
          </button>
          <dialog
            id="new_post_modal"
            // className="modal p-1.5 fixed inset-0 flex items-center justify-center bg-black/50"
            className="p-5 rounded-lg shadow-xl backdrop:bg-black/50 open:flex open:flex-col open:bg-amber-200 items-center justify-center m-auto min-w-100"
          >
            <div className="modal-box">
              <h3 className="font-bold text-lg pt-1 pb-4">Post Title:</h3>
              <input
                type="text"
                className="bg-amber-500 p-2 min-w-75"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  console.log("title:", title);
                }}
              />
              <h3 className="font-bold text-lg text-center pt-1 pb-4">
                Post Body:
              </h3>
              <div className="modal-action">
                <form method="POST" action="">
                  <textarea
                    name="new-comment-textarea"
                    id="new-comment-textarea"
                    className="bg-amber-500 p-2 min-w-75 block"
                    value={body}
                    onChange={(e) => {
                      setBody(e.target.value);
                      console.log("body:", body);
                    }}
                  ></textarea>
                  <div className="flex justify-between">
                    <button className="btn border-4 border-orange-800 rounded-md mt-4 p-1">
                      Close
                    </button>
                    <button
                      className="btn border-4 border-green-500 rounded-md mt-4 p-1"
                      onClick={(e) => {
                        e.preventDefault();
                        addNewPost();
                      }}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </dialog>
        </>
      ) : (
        <>{console.log("they do not be admin")}</>
      )}
      <div>
        {posts.map((postCard) => {
          return (
            <>
              <Link to={`/post/${postCard.id}`}>
                <PostCard postCard={postCard} key={postCard.id}></PostCard>
              </Link>
            </>
          );
        })}
      </div>
    </>
  );
};

export { Homepage };
