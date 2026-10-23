import { useContext, useEffect, useState } from "react";
import styles from "./Homepage.module.css";
import { useLocation, Link, data } from "react-router-dom";
import { BlogContext } from "./BlogContext";
import { PostCard } from "./PostCard";
import { helperURLFunction } from "./helperFunctions";

const Homepage = () => {
  const { pathname } = useLocation();

  const { posts, user, setUser } = useContext(BlogContext);
  const [loading, setLoading] = useState(true);

  const ACCESS_TOKEN_KEY = 'access_token';
  const USER_KEY = 'user';

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
      
      console.log('Data at line 50:', data);
      localStorage.setItem(ACCESS_TOKEN_KEY, data.token);

      if (data.user) {
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        setUser(data.user);
        console.log('User after line 57', data.user);
      }
    } else {
      const errorData = await response.json();
      console.error("Login failed:", errorData);
    }

    
    
  }

  console.log(user);
  

  return (
    <>
      {user != null && user.username ? (
        <h1 className={styles.mainHeader}>{`Welcome back, ${user.username}`}</h1>
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
        <h1>You Are Logged In My Guy</h1>
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
