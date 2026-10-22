import { Outlet } from "react-router-dom";

const Layout = () => {

    async function doLogout(e) {
        e.preventDefault();

        
    }

    return (
        <>
            <button>Logout</button>
            <Outlet></Outlet>
        </>
    )

}


export { Layout };