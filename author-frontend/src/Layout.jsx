import { Outlet } from "react-router-dom";
import { apiRequest } from "./helperFunctions";
import { BlogContext } from "./BlogContext.js";
import { useContext, useEffect, useState } from "react";
import { ACCESS_TOKEN_KEY, USER_KEY } from "./constants";

const Layout = () => {
  const { user, setUser } = useContext(BlogContext);
  const [authMode, setAuthMode] = useState("login");
  const [authError, setAuthError] = useState("");
  const [theme, setTheme] = useState(
    () => localStorage.getItem("author-theme") === "light" ? "light" : "dark",
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("author-theme", theme);
  }, [theme]);

  async function authenticate(e) {
    e.preventDefault();
    setAuthError("");
    const form = new FormData(e.currentTarget);
    const response = await apiRequest(`auth/${authMode}`, {
      method: "POST",
      body: JSON.stringify({
        username: form.get("username"),
        password: form.get("password"),
      }),
    });
    const result = await response.json();
    if (!response.ok) {
      setAuthError(result.error || "Could not authenticate.");
      return;
    }
    localStorage.setItem(ACCESS_TOKEN_KEY, result.token);
    localStorage.setItem(USER_KEY, JSON.stringify(result.user));
    setUser(result.user);
    document.getElementById("auth-dialog")?.close();
  }

  function doLogout() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }

  function openAuth(mode) {
    setAuthMode(mode);
    setAuthError("");
    document.getElementById("auth-dialog")?.showModal();
  }

  const themeToggle = (
    <button
      className="button-secondary theme-toggle"
      type="button"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} view`}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />
        </svg>
      )}
    </button>
  );

  return (
    <>
      <header className="app-header">
        <a className="site-title" href="/">
          <svg className="brand-face" viewBox="0 0 36 36" aria-hidden="true">
            <path d="M18 3v4M15 3h6" />
            <rect x="5" y="8" width="26" height="23" rx="7" />
            <path d="M12 17h.01M24 17h.01M12 22c1.5 2 3.5 3 6 3s4.5-1 6-3" />
          </svg>
          <span>Bloggy McBlogFace</span>
        </a>
        {user && localStorage.getItem(ACCESS_TOKEN_KEY) ? (
          <div className="header-actions">
            {themeToggle}
            <button className="button-secondary" onClick={doLogout}>Log out</button>
          </div>
        ) : (
          <div className="header-actions">
            {themeToggle}
            <button onClick={() => openAuth("login")}>Log in</button>
            <button className="button-secondary" onClick={() => openAuth("signup")}>Sign up</button>
          </div>
        )}
      </header>
      <dialog id="auth-dialog" className="modal">
        <form className="login-form" onSubmit={authenticate}>
          <h2>{authMode === "signup" ? "Create an account" : "Log in"}</h2>
          {authError && <p className="auth-error">{authError}</p>}
          <label htmlFor="auth-username">Username</label>
          <input id="auth-username" name="username" required autoComplete="username" />
          <label htmlFor="auth-password">Password</label>
          <input
            id="auth-password"
            name="password"
            type="password"
            required
            autoComplete={authMode === "signup" ? "new-password" : "current-password"}
          />
          <div className="modal-actions">
            <button type="button" className="button-secondary" onClick={() => document.getElementById("auth-dialog")?.close()}>Cancel</button>
            <button type="submit">{authMode === "signup" ? "Sign up" : "Log in"}</button>
          </div>
          <button type="button" className="auth-switch" onClick={() => setAuthMode(authMode === "signup" ? "login" : "signup")}>
            {authMode === "signup" ? "Already have an account? Log in" : "Need an account? Sign up"}
          </button>
        </form>
      </dialog>
      <Outlet />
    </>
  );
};

export { Layout };
