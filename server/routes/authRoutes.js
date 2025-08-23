import express from "express";
import { signup, login, refreshToken, updateUserDetails, getUserDetails } from "../controllers/userControllers.js";
import { upload } from "../middleware/multer.js";
import { verifyAccessToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register
router.post("/signup", signup);

// Login
router.post("/login", login);

//refresh token
router.post("/refresh-token", refreshToken);

//get-user data
router.get("/get-user",verifyAccessToken,getUserDetails);

//update user data
router.put("/update",verifyAccessToken, upload.single("profilePicture"), updateUserDetails);

// //logout
// router.post("/logout", logout);

export default router;
