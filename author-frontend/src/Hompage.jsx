import { useContext } from "react";
import styles from "./Homepage.module.css";
import { useLocation, Link } from "react-router-dom";
import { BlogContext } from "./BlogContext";
import { PostCard } from "./PostCard";
import { helperURLFunction } from "./helperFunctions";

const Homepage = () => {
  const { pathname } = useLocation();

  const { posts } = useContext(BlogContext);

  async function doLogin(e) {
    // console.log("EEEEEEEEEE:", e);
    // const usernameInput = document.getElementById("usernameInput").textContent;
    // const passwordInput = document.getElementById("passwordInput").textContent;
    // console.log("UN:", usernameInput);
    // console.log("PW:", passwordInput);

    e.preventDefault();

    const formData = new FormData(e.currentTarget.form);
    console.log(formData);
    const username = formData.get("usernameInput");
    const password = formData.get("passwordInput");
    console.log(username);
    console.log(password);

    // await fetch(helperURLFunction(`auth/login`), {
    //   method: "POST",
    //   body: {
    //     username: username,
    //     password: password,
    //   },

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
  }

  return (
    <>
      <h1 className="text-3xl font-bold underline">Author Frontend</h1>
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
