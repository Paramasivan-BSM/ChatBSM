import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

// Route imported section
import authRoute from "./routes/auth.routes.js";
import { connectDB } from "./lb/db.js";

let app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);

app.listen(process.env.PORT, () => {
  console.log(`http://localhost:${process.env.PORT}`);
  connectDB();
});
