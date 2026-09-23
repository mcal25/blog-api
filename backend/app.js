import "dotenv/config";
import express from "express";
import { postRouter } from "./routers/postRouter";
import { authRouter } from "./routers/authRouter";

const app = express();

const port = process.env.PORT || 3000;


app.use("/post", postRouter);
app.use("/auth", authRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
