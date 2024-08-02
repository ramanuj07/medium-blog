"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const blog_1 = __importDefault(require("./routes/blog"));
const user_1 = __importDefault(require("./routes/user"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.set("view engine", "ejs");
app.set("views", path_1.default.join(__dirname, "views"));
app.use("/api/v1/user", user_1.default);
app.use("/api/v1/blog", blog_1.default);
app.listen(3000, () => {
    console.log("Server listening at port 3000");
});
exports.default = app;
