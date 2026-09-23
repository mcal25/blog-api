import { Router } from "express";
import { getAllPosts, getPostById, editPostById, deletePostById, addPost } from "../controllers/postsController";

export const postRouter = Router();

postRouter.get("/collection", getAllPosts);
postRouter.get("/:postid", getPostById);

postRouter.post("/", addPost);

postRouter.put("/:postid", editPostById);

postRouter.delete("/:postid", deletePostById);

