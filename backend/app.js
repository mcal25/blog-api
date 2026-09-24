import "dotenv/config";
import express from "express";
import { postRouter } from "./routers/postRouter.js";
import { authRouter } from "./routers/authRouter.js";
import { commentRouter } from "./routers/commentRouter.js";

const app = express();

const port = process.env.PORT || 3000;

// Need this to tell express to interpret req as json so it can read 🥸
app.use(express.json());
app.use("/post", postRouter);
app.use("/auth", authRouter);
app.use("/post/:postid/comments", commentRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
