import { Outlet } from "react-router-dom";
import { helperURLFunction } from "./helperFunctions";
import { BlogContext } from "./BlogContext";
import { useContext } from "react";

const Layout = () => {
  const { user, setUser } = useContext(BlogContext);

  async function doLogout(e) {
    console.log("Hitting doLogout?:", "hitting do logout");

    e.preventDefault();

    const response = await fetch(helperURLFunction(`auth/logout`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => {
      localStorage.clear();
    });
    // setLoggedIn(false);
    // setGreeting("Bloggy McBlogFace");
    setUser(null);
  }

  return (
    <>
      <button onClick={doLogout}>Logout</button>
      <Outlet></Outlet>
    </>
  );
};

export { Layout };
