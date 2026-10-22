import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { BlogContextProvider } from "./BlogContext.jsx";
import { Homepage } from "./Hompage.jsx";
import { Post } from "./Post.jsx";
import { Layout } from "./Layout.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <BlogContextProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="*" element={<Homepage />} />
            <Route path="/post/:postId" element={<Post />} />
          </Route>
        </Routes>
      </BlogContextProvider>
    </BrowserRouter>
  </StrictMode>,
);

/*

<Layout>
 <Homepage>
</Layout>

*/
