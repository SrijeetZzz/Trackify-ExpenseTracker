import express from "express";
import { signup, login, refreshToken, updateUserDetails, getUserDetails } from "../controllers/userControllers.js";
import { upload } from "../middleware/multer.js";
import { verifyAccessToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.get("/get-user",verifyAccessToken,getUserDetails);
router.put("/update",verifyAccessToken, upload.single("profilePicture"), updateUserDetails);

export default router;
