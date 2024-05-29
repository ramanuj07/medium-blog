import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());
app.use("/api/v1/blog/*", async (req, res, next) => {
  await next();
});

const secretKey = process.env.SECRET_KEY as string;

app.post("/api/v1/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ userId: user.id }, secretKey, {
      expiresIn: "1h",
    });

    return res.status(201).json({
      msg: "New user created",
      token,
    });
  } catch (e) {
    return res.status(500).json({ msg: "Internal server error" });
  }
});

app.post("/api/v1/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(403).json({
        msg: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(403).json({
        msg: "Invalid credentials",
      });
    }

    const token = jwt.sign({ userId: user.id }, secretKey, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      msg: "Sign-in successful",
      token,
    });
  } catch (e) {
    return res.status(500).json({
      msg: "Internal server error",
    });
  }
});

app.post("/api/v1/blog", async (req, res) => {
  const { authorId, title, content } = req.body;
  try {
    if (!authorId || !title || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const blog = await prisma.post.create({
      data: {
        title,
        content,
        authorId,
      },
    });

    return res.json({
      id: blog.id,
    });
  } catch (e) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/api/v1/blog", (req, res) => {
  return res.send("update blog route");
});

app.get("/api/v1/blog/:id", (req, res) => {
  return res.send("get blog route");
});

app.get("/api/v1/blog/bulk", (req, res) => {
  return res.send("get blog route");
});

app.listen(3000, () => {
  console.log("Server listening at port 3000");
});
