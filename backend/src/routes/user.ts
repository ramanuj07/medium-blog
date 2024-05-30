import express from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { signupInput, signinInput } from "@ramanuj07/medium-common";

const userRouter = express.Router();
const prisma = new PrismaClient();

const secretKey = process.env.SECRET_KEY as string;

userRouter.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const { success } = signupInput.safeParse({ name, email, password });

  if (!success) {
    return res.status(411).json({
      msg: "Inputs not correct",
    });
  }

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
        name,
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

userRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const { success } = signinInput.safeParse({ email, password });

  if (!success) {
    return res.status(411).json({
      msg: "Incorrect inputs",
    });
  }

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

export default userRouter;
