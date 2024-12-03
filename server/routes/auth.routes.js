import express from "express";
const router = express.Router();

// Controller import section
import {
  checkAuth,
  login,
  logout,
  signup,
} from "../controllers/auth.controllers.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/check", protectRoute, checkAuth);

export default router;
