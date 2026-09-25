import { Router } from "express";
import {
  getAllCommentsByPostId,
  getCommentById,
  deleteCommentById,
  addComment,
  editCommentById,
} from "../controllers/commentController.js";
import { passport } from "../middleware/passport-config.js"

export const commentRouter = Router({mergeParams: true});
const requireJwt = passport.authenticate("jwt", { session: false });

commentRouter.get('/', getAllCommentsByPostId);
commentRouter.get('/:commentid', getCommentById);
commentRouter.post('/', requireJwt, addComment);
commentRouter.put('/:commentid', requireJwt, editCommentById);
commentRouter.delete('/:commentid', requireJwt, deleteCommentById);