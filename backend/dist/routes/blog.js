"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const medium_common_1 = require("@ramanuj07/medium-common");
const blogRouter = express_1.default.Router();
const prisma = new client_1.PrismaClient();
blogRouter.use(express_1.default.json());
blogRouter.use((0, cors_1.default)());
const secretKey = process.env.SECRET_KEY;
// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.sendStatus(401); // Unauthorized
    }
    jsonwebtoken_1.default.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }
        req.user = user;
        next();
    });
};
blogRouter.post("/", authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content } = req.body;
    const { success } = medium_common_1.createBlogInput.safeParse({ title, content });
    if (!success) {
        return res.status(411).json({
            msg: "Incorrect inputs",
        });
    }
    try {
        if (!title || !content) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const blog = yield prisma.post.create({
            data: {
                title,
                content,
                authorId: req.user.userId,
            },
        });
        return res.json({
            id: blog.id,
        });
    }
    catch (e) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
}));
blogRouter.put("/", authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, title, content } = req.body;
    const { success } = medium_common_1.updateBlogInput.safeParse({ id, title, content });
    if (!success) {
        return res.status(411).json({
            msg: "Incorrect inputs",
        });
    }
    if (!title || !content) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    const existingPost = yield prisma.post.findUnique({
        where: { id: Number(id) },
    });
    if (!existingPost) {
        return res.status(404).json({ error: "Post not found" });
    }
    if (existingPost.authorId !== req.user.userId) {
        return res
            .status(403)
            .json({ error: "Unauthorized to update this post" });
    }
    const updatedPost = yield prisma.post.update({
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
}));
blogRouter.get("/bulk", authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogs = yield prisma.post.findMany();
        return res.json(blogs);
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}));
blogRouter.get("/:id", authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const blog = yield prisma.post.findFirst({
            where: { id: Number(id) },
        });
        if (!blog) {
            return res.status(404).json({ error: "Post not found" });
        }
        return res.status(200).json(blog);
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}));
exports.default = blogRouter;
