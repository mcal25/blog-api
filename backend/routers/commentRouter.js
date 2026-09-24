import { Router } from "express";
import {
  getAllCommentsByPostId,
  getCommentById,
  deleteCommentById,
  addComment,
  editCommentById,
} from "../controllers/commentController.js";

export const commentRouter = Router({mergeParams: true});

commentRouter.get('/', getAllCommentsByPostId);
commentRouter.get('/:commentid', getCommentById);
commentRouter.post('/', addComment);
commentRouter.put('/:commentid', editCommentById);
commentRouter.delete('/:commentid', deleteCommentById);