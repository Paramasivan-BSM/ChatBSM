import express from "express";

import {
  getuserForSidebar,
  getMessages,
  sendMessage,
} from "../controllers/message.controllers.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

let router = express.Router();

router.get("/users", protectRoute, getuserForSidebar);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);

export default router;
