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
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const medium_common_1 = require("@ramanuj07/medium-common");
const userRouter = express_1.default.Router();
const prisma = new client_1.PrismaClient();
const secretKey = process.env.SECRET_KEY;
userRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    const { success } = medium_common_1.signupInput.safeParse({ name, email, password });
    if (!success) {
        return res.status(411).json({
            msg: "Inputs not correct",
        });
    }
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
                name,
                email,
                password: hashedPassword,
            },
        });
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, secretKey, {
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
userRouter.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const { success } = medium_common_1.signinInput.safeParse({ email, password });
    if (!success) {
        return res.status(411).json({
            msg: "Incorrect inputs",
        });
    }
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
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, secretKey, {
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
exports.default = userRouter;
