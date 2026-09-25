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
  // Look up the comment first so authorization can use its actual database owner.
  const existingComment = await prisma.comment.findUnique({
    where: { id: Number(req.params.commentid) },
  });

  if (!existingComment) {
    return res.status(404).json({ error: "Comment not found" });
  }

  // Randy's admin account may moderate any comment; other users may edit only their own.
  if (!req.user.isAdmin && existingComment.userId !== req.user.id) {
    return res.status(403).json({ error: "You can only edit your own comments" });
  }

  const comment = await prisma.comment.update({
    where: { id: existingComment.id },
    data: { body: req.body.body },
  });

  // A 204 response has no body, so end it once instead of trying to send JSON too.
  return res.sendStatus(204);
}

export async function deleteCommentById(req, res, next) {
  // Look up the comment first so authorization can use its actual database owner.
  const existingComment = await prisma.comment.findUnique({
    where: { id: Number(req.params.commentid) },
  });

  if (!existingComment) {
    return res.status(404).json({ error: "Comment not found" });
  }

  // Randy's admin account may moderate any comment; other users may delete only their own.
  if (!req.user.isAdmin && existingComment.userId !== req.user.id) {
    return res.status(403).json({ error: "You can only delete your own comments" });
  }

  await prisma.comment.delete({
    where: { id: existingComment.id },
  });

  // Send one body-free success response after deletion.
  return res.sendStatus(204);
}

export async function addComment(req, res, next) {
  // Derive the post from the nested route and the author from the verified JWT, never client-supplied IDs.
  const comment = await prisma.comment.create({
    data: {
      body: req.body.body,
      post: {
        connect: { id: Number(req.params.postid) },
      },
      user: {
        connect: { id: req.user.id },
      },
    },
  });

  // Return the created comment so clients can use its ID and confirm its author.
  return res.status(201).json(comment);
}
