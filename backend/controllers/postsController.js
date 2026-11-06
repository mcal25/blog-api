import { prisma } from "../lib/prisma.js";

export async function getAllPosts(req, res) {
  // This handler is mounted only on admin routes, so it intentionally includes drafts.
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { comments: true } } },
  });
  res.json(posts);
}

export async function getAllPostsForPublic(req, res) {
  // Public readers must not receive drafts, even if they know a draft's ID.
  const posts = await prisma.post.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { comments: true } } },
  });

  res.json(posts);
}

export async function getPostById(req, res) {
  const post = await prisma.post.findFirst({
    // Combining ID and published status makes a draft look unavailable to public readers.
    where: { id: Number(req.params.postid), isPublished: true },
  });

  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  res.json(post);
}

export async function getPostByIdForAdmin(req, res) {
  // The router verifies admin access; this lookup therefore allows draft posts too.
  const post = await prisma.post.findUnique({
    where: { id: Number(req.params.postid) },
  });

  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  res.json(post);
}

export async function editPostById(req, res) {
  await prisma.post.update({
    where: { id: Number(req.params.postid) },
    data: {
      title: req.body.title,
      body: req.body.body,
    },
  });
  return res.sendStatus(204);
}

export async function deletePostById(req, res) {
  await prisma.post.delete({
    where: { id: Number(req.params.postid) },
  });
  return res.sendStatus(204);
}

export async function addPost(req, res) {
  const post = await prisma.post.create({
    data: {
      body: req.body.body,
      title: req.body.title,
      isPublished: false,
      // Passport populated req.user after the route verified the admin's JWT.
      userId: req.user.id,
    },
    include: { _count: { select: { comments: true } } },
  });
  return res.status(201).json(post);
}
