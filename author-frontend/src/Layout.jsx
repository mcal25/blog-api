import { Outlet } from "react-router-dom";
import { helperURLFunction } from "./helperFunctions";

const Layout = () => {
  async function doLogout(e) {
    console.log('Hitting doLogout?:', 'hitting do logout');
    e.preventDefault();
    const response = await fetch(helperURLFunction(`auth/logout`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => {
        localStorage.clear();
    });
    
  }

  return (
    <>
      <button onClick={doLogout}>Logout</button>
      <Outlet></Outlet>
    </>
  );
};

export { Layout };
