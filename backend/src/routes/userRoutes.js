import express from "express";
import verifyToken from "../middleware/authMiddleware.js";
import { getMe, updateMe } from "../controller/userController.js";

const router = express.Router();

router.get("/me", verifyToken, getMe);
router.put("/me", verifyToken, updateMe);

export default router;
