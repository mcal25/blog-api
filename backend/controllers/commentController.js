import { prisma } from "../lib/prisma.js";

export async function getAllCommentsByPostId(req, res, next) {
  const comments = await prisma.comment.findMany({
    where: { postId: Number(req.params.postid) },
  });
  res.json(comments);
}

export async function getCommentById(req, res, next) {
  console.log(req.params);
  const comment = await prisma.comment.findFirst({
    where: { id: Number(req.params.commentid) },
  });
  res.json(comment);
}

export async function editCommentById(req, res, next) {
  const comment = await prisma.comment.update({
    where: { id: Number(req.params.commentid) },
    data: { body: req.body.body },
  });
  res.status(204).json();
}

export async function deleteCommentById(req, res, next) {}

export async function addComment(req, res, next) {}
