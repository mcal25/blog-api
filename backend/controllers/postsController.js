import { prisma } from "../lib/prisma.js";

export async function getAllPosts(req, res) {
    const posts = await prisma.post.findMany();
    res.json(posts);
}

export async function getPostById(req, res) {
    const post = await prisma.post.findFirst({
        where: {id: Number(req.params.postid)}
    });
    res.json(post);
}

export async function editPostById(req, res) {
    console.log('request body:', req.body);
    const post = await prisma.post.upsert({
        where: {id: Number(req.params.postid)},
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
            }
        }
    })
}

export async function deletePostById() {
    
}

export async function addPost() {
    
}
