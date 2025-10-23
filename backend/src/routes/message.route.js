import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import { getUsersSidebar,getMessage,sendMessage } from "../controllers/message.js"

const router = express.Router()

router.get("/users", protectRoute, getUsersSidebar);
router.get("/:id",protectRoute,getMessage);

router.post("/send/:id",protectRoute, sendMessage);


export default router;