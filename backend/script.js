import { prisma } from "./lib/prisma.js";

async function main() {
  // Create an admin user with a post and a comment on that post
  const adminUser = await prisma.user.create({
    data: {
      username: "Big Deal Randy",
      password: "BDR2026",
      isAdmin: true, // Overriding default false
      posts: {
        create: {
          title: "Hello World",
          body: "This is my first post!",
          isPublished: true,
          comments: {
            create: {
              body: "Great first post, Randy!",
              // userId will automatically link to the created user inside nested write
              user: {
                connect: { username: "Big Deal Randy" },
              },
            },
          },
        },
      },
    },
    include: {
      posts: {
        include: {
          comments: true,
        },
      },
    },
  });
  console.log("Created user with post and comment:", JSON.stringify(adminUser, null, 2));

  // Create a second regular user (isAdmin defaults to false)
  const regularUser = await prisma.user.create({
    data: {
      username: "JaneDoe",
      password: "password123",
      // isAdmin defaults to false automatically
    },
  });

  // Add a second comment on Randy's post from JaneDoe
  const newComment = await prisma.comment.create({
    data: {
      body: "Welcome to the platform!",
      postId: adminUser.posts[0].id,
      userId: regularUser.id,
    },
  });
  console.log("Created second comment:", newComment);

  // Fetch all users with their posts and comments
  const allUsers = await prisma.user.findMany({
    include: {
      posts: {
        include: {
          comments: true,
        },
      },
      comments: true,
    },
  });
  console.log("All users in DB:", JSON.stringify(allUsers, null, 2));
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