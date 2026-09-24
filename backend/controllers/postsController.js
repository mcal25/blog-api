import { prisma } from "../lib/prisma.js";

export async function getAllPosts(req, res) {
  const posts = await prisma.post.findMany();
  res.json(posts);
}

export async function getPostById(req, res) {
  const post = await prisma.post.findFirst({
    where: { id: Number(req.params.postid) },
  });
  res.json(post);
}

export async function editPostById(req, res, next) {
  console.log("request body:", req.body);
  const post = await prisma.post.upsert({
    where: { id: Number(req.params.postid) },
    update: {
      title: req.body.title,
      body: req.body.body,
    },
    create: {
      title: req.body.title,
      body: req.body.body,
      isPublished: false,
      user: {
        connect: { username: "Big Deal Randy" },
      },
    },
  });
  res.status(204).json();
}

export async function deletePostById(req, res, next) {
  const post = await prisma.post.delete({
    where: { id: Number(req.params.postid) },
  });
  res.send(200).json();
}

export async function addPost(req, res, next) {
  const post = await prisma.post.create({
    data: {
      body: req.body.body,
      title: req.body.title,
      isPublished: false,
      userId: 10,
    },
  });
  res.send(204).json();
}
