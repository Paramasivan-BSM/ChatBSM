import express from "express";

import {
  getuserForSidebar,
  getMessages,
} from "../controllers/message.controllers.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

let router = express.Router();

router.get("/users", protectRoute, getuserForSidebar);
router.get("/:id", protectRoute, getMessages);

export default router;
