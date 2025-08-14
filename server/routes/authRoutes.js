import express from "express";
import { signup, login, logout, refreshToken } from "../controllers/userControllers.js";

const router = express.Router();

// Register
router.post("/signup", signup);

// Login
router.post("/login", login);

//refresh token
router.post("/refresh-token", refreshToken);

//logout
router.post("/logout", logout);

export default router;
