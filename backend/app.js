import "dotenv/config";
import express from "express";
import { postRouter } from "./routers/postRouter";
import { authRouter } from "./routers/authRouter";
import { commentRouter } from "./routers/commentRouter";

const app = express();

const port = process.env.PORT || 3000;


app.use("/post", postRouter);
app.use("/auth", authRouter);
app.use("/post/:postid/comments", commentRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
