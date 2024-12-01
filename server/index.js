import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

// Route imported section
import authRoute from "./routes/auth.routes.js";
import msgRoute from "./routes/message.routes.js";
import { connectDB } from "./lb/db.js";

let app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend origin
    credentials: true, // To allow cookies or authorization headers
  })
);
app.use("/api/auth", authRoute);
app.use("/api/message", msgRoute);

app.listen(process.env.PORT, () => {
  console.log(`http://localhost:${process.env.PORT}`);
  connectDB();
});
