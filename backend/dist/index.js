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
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api/v1/blog/*", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield next();
}));
const SECRET_KEY = "mysecretkey";
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const existingUser = yield prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(409).json({ msg: "User already exists" });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = yield prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, SECRET_KEY, {
            expiresIn: "1h",
        });
        return res.status(201).json({
            msg: "New user created",
            token,
        });
    }
    catch (e) {
        return res.status(500).json({ msg: "Internal server error" });
    }
}));
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(403).json({
                msg: "User not found",
            });
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(403).json({
                msg: "Invalid credentials",
            });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, SECRET_KEY, {
            expiresIn: "1h",
        });
        return res.status(200).json({
            msg: "Sign-in successful",
            token,
        });
    }
    catch (e) {
        return res.status(500).json({
            msg: "Internal server error",
        });
    }
}));
app.post("/api/v1/blog", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { authorId, title, content } = req.body;
    try {
        if (!authorId || !title || !content) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const blog = yield prisma.post.create({
            data: {
                title,
                content,
                authorId,
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
