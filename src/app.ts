import express, { Application } from "express";
import { postRouter } from "./modules/post/post.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from 'cors'
// --------------------------| Middle wear |----------------------
const app: Application = express();
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());
app.use(cors({
  origin: process.env.APP_URL || 'http://localhost:4001'  , 
  credentials:true
  
}))
// ============================| ROUTER |================================================
app.use("/", postRouter);
// ============================| Test APis |================================================
app.get("/", (req, res) => {
  res.send("Hello world");
});
export default app;
