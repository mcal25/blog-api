import { Router } from "express";
import {
  getAllComments,
  getCommentById,
  deleteCommentById,
  addComment,
  editCommentById,
} from "../controllers/commentController.js";

export const commentRouter = Router();

commentRouter.get('/', getAllComments);
commentRouter.get('/:commentid', getCommentById);
commentRouter.post('/', addComment);
commentRouter.put('/:commentid', editCommentById);
commentRouter.delete('/:commentid', deleteCommentById);