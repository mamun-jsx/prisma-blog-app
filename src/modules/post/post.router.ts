import express, { Router, Request, NextFunction, Response } from "express";
import { postController } from "./post.controller";
import { auth as betterAuth } from "../../lib/auth";

const router = express.Router();

// role type
export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}
// user type
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
        emailVerified: boolean;
      };
    }
  }
}
// auth middle wear-->
export const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await betterAuth.api.getSession({
        headers: req.headers as any,
      });

      if (!session || !session.user) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized",
        });
      }

      // email verification check
      if (session.user.emailVerified !== true) {
        return res.status(403).json({
          success: false,
          message: "Email verification required. Please verify your email.",
        });
      }

      const userRole = session.user.role?.toUpperCase() as UserRole;

      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: userRole,
        emailVerified: session.user.emailVerified,
      };

      // role check
      if (roles.length && !roles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message:
            "Forbidden! You don't have permission to access this resource",
        });
      }

      next();
    } catch (error) {
      console.error("Auth middleware error:", error);
      return res.status(401).json({
        success: false,
        message: "Invalid or expired session",
      });
    }
  };
};

router.get("/posts", postController.getAllPost);

//get by id
router.get("/:id", postController.getPostById);
// create a single  post
router.post(
  "/post",
  auth(UserRole.USER, UserRole.ADMIN),
  postController.createPost
);
// get my post by id
router.get(
  "/my-posts",
  auth(UserRole.ADMIN, UserRole.USER),
  postController.getMyPostById
);
// updateOwnPost
router.patch(
  "/:postId",
  auth(UserRole.ADMIN, UserRole.USER),
  postController.updateMyOwnPost
);
/**
 * =========================================
 * =========================================
 * =========================================
 * =========================================
 * =========================================
 * =========================================
 * =========================================
 * =========================================
 **/
export const postRouter: Router = router;
