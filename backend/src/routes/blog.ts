import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

const blogRouter = express.Router();
const prisma = new PrismaClient();

blogRouter.use(express.json());
blogRouter.use(cors());

const secretKey = process.env.SECRET_KEY as string;

interface AuthenticatedRequest extends Request {
  user?: { userId: string };
}

// Authentication middleware

const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden
    }
    req.user = user as { userId: string };
    next();
  });
};

blogRouter.post(
  "/",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    const { title, content } = req.body;
    try {
      if (!title || !content) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const blog = await prisma.post.create({
        data: {
          title,
          content,
          authorId: req.user!.userId,
        },
      });

      return res.json({
        id: blog.id,
      });
    } catch (e) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

blogRouter.put(
  "/",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    const { id, title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existingPost = await prisma.post.findUnique({
      where: { id: Number(id) },
    });

    if (!existingPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (existingPost.authorId !== req.user!.userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to update this post" });
    }

    const updatedPost = await prisma.post.update({
      where: { id: Number(id) },
      data: {
        title,
        content,
      },
    });

    return res.status(200).json({
      msg: "Blog updated successfully",
      id,
    });
  }
);

blogRouter.get(
  "/bulk",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const blogs = await prisma.post.findMany();

      return res.json(blogs);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

blogRouter.get(
  "/:id",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    try {
      const blog = await prisma.post.findFirst({
        where: { id: Number(id) },
      });

      if (!blog) {
        return res.status(404).json({ error: "Post not found" });
      }

      return res.status(200).json(blog);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

export default blogRouter;