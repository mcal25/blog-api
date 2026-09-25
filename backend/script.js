import bcrypt from "bcryptjs";
import { prisma } from "./lib/prisma.js";

const users = [
  { username: "Big Deal Randy", password: "BDR2026", isAdmin: true },
  { username: "JaneDoe", password: "password123", isAdmin: false },
  { username: "MikeSmith", password: "password123", isAdmin: false },
  { username: "AlexJohnson", password: "password123", isAdmin: false },
  { username: "TaylorBrown", password: "password123", isAdmin: false },
  { username: "JordanLee", password: "password123", isAdmin: false },
  { username: "CaseyWilson", password: "password123", isAdmin: false },
  { username: "MorganDavis", password: "password123", isAdmin: false },
];

async function main() {
  const usersWithHashedPasswords = await Promise.all(
    users.map(async (user) => ({
      ...user,
      password: await bcrypt.hash(user.password, 12),
    })),
  );

  // Clear dependent records first so the seed can be safely rerun.
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  for (const user of usersWithHashedPasswords) {
    await prisma.user.create({ data: user });
  }

  for (let postIndex = 0; postIndex < 12; postIndex += 1) {
    const commentCount = 2 + (postIndex % 4);
    const author = users[postIndex % users.length];

    await prisma.post.create({
      data: {
        title: `Blog Post ${postIndex + 1}`,
        body: `This is the body of blog post ${postIndex + 1}.`,
        isPublished: postIndex % 5 !== 0,
        user: {
          connect: { username: author.username },
        },
        comments: {
          create: Array.from({ length: commentCount }, (_, commentIndex) => ({
            body: `Comment ${commentIndex + 1} on blog post ${postIndex + 1}.`,
            user: {
              connect: {
                username: users[(postIndex + commentIndex + 1) % users.length]
                  .username,
              },
            },
          })),
        },
      },
    });
  }

  const [userCount, postCount, commentCount, adminCount] = await Promise.all([
    prisma.user.count(),
    prisma.post.count(),
    prisma.comment.count(),
    prisma.user.count({ where: { isAdmin: true } }),
  ]);

  console.log({ userCount, postCount, commentCount, adminCount });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
