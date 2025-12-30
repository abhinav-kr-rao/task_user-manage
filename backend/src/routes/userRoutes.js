import express from "express";
import verifyToken from "../middleware/authMiddleware.js";
import isAdmin from "../middleware/adminMiddleware.js";
import {
  getMe,
  updateMe,
  getAllUsers,
  updateUserStatus,
} from "../controller/userController.js";

const router = express.Router();

// User Routes
router.get("/me", verifyToken, getMe);
router.put("/me", verifyToken, updateMe);

// Admin Routes
router.get("/", verifyToken, isAdmin, getAllUsers);
router.put("/:id/status", verifyToken, isAdmin, updateUserStatus);

export default router;
