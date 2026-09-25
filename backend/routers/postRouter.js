import { Router } from "express";
import {
  getAllPosts,
  getAllPostsForPublic,
  getPostById,
  getPostByIdForAdmin,
  editPostById,
  deletePostById,
  addPost,
} from "../controllers/postsController.js";
import { passport } from "../middleware/passport-config.js";

const postRouter = Router();

// Passport verifies the bearer token and puts the matching database user on req.user.
const requireJwt = passport.authenticate("jwt", { session: false });

// Authentication proves who the caller is; this extra check limits author tools to admins.
function requireAdmin(req, res, next) {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ error: "Admin access required" });
  }

  return next();
}

// These admin read routes come before public detail routes and can include unpublished drafts.
postRouter.get("/admin/collection", requireJwt, requireAdmin, getAllPosts);
postRouter.get("/admin/:postid", requireJwt, requireAdmin, getPostByIdForAdmin);

// Public readers should only receive posts that an author has published.
postRouter.get("/collection", getAllPostsForPublic);
postRouter.get("/:postid", getPostById);

// Creating, editing, and deleting posts are author actions, so require both a valid JWT and admin status.
postRouter.post("/", requireJwt, requireAdmin, addPost);
postRouter.put("/:postid", requireJwt, requireAdmin, editPostById);
postRouter.delete("/:postid", requireJwt, requireAdmin, deletePostById);

export { postRouter };