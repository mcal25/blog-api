import { Connection } from "pg";
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

export async function deleteCommentById(req, res, next) {
    const comment = await prisma.comment.delete({
        where: {id: Number(req.params.commentid)},
    });
    res.send(200).json();
}

export async function addComment(req, res, next) {
    console.log(req.params);
    const comment = await prisma.comment.create({
        data: {
            body: req.body.body,
            postId: req.params.postId,
            userId: req.params.userid,
            post: {
                connect: {id: Number(req.params.postid)}
            },
            user: {
                connect: {id: 10},
            }
        }
    });
    res.send(204).json();
}
