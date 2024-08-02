import express from "express";
import cors from "cors";
import blogRouter from "./routes/blog";
import userRouter from "./routes/user";
import path from "path";

const app = express();

app.use(express.json());
app.use(cors());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/blog", blogRouter);

app.listen(3000, () => {
  console.log("Server listening at port 3000");
});

export default app;
