import express, { Application } from "express";
import { postRouter } from "./modules/post/post.router";

const app: Application = express();
app.use(express.json());
// ============================| ROUTER |================================================
app.use("/", postRouter);
// ============================| Test APis |================================================
app.get("/", (req, res) => {
  res.send("Hello world");
});
export default app;
