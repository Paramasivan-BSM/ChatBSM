import express from "express";
const router = express.Router();

// Controller import section
import {
  login,
  logout,
  signup,
  updateProfile,
} from "../controllers/auth.controllers.js";
import protectRoute from "../middlewares/auth.middleware.js";

router.post("/signup", signup);
router.post("/signin", login);
router.post("/logout", logout);
router.put("update-profile", protectRoute, updateProfile);
export default router;
