import User from "../models/users.js";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateTokenUtils.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

//signup

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken({ userId: user._id.toString() });

    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      message: "User created successfully",
      accessToken,
      refreshToken,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//login

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//get user

export const getUserDetails = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select("-password -refreshToken");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE USER
export const updateUserDetails = async (req, res) => {
  try {
    const userId = req.user.userId; // from token
    const { username, email, phoneNo, budget } = req.body;

    let updateData = {};

    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (phoneNo) updateData.phoneNo = phoneNo;
    if (budget !== undefined) updateData.budget = budget;

    // Handle profile picture if uploaded
    if (req.file) {
      updateData.profilePicture = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    ).select("-password -refreshToken");

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//generate new access token using refresh token

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);
    if (!refreshToken)
      return res.status(401).json({ message: "Refresh token missing" });

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err)
          return res.status(403).json({ message: "Invalid refresh token" });

        const user = await User.findOne({ _id: decoded.userId, refreshToken });
        if (!user)
          return res.status(403).json({ message: "Invalid refresh token" });

        const newAccessToken = generateAccessToken(user);

        res.json({ accessToken: newAccessToken });
      }
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//create or invite new user

export const createUser = async (req, res) => {
  try {
    const {username,email,password,phoneNo} = req.body;
    const userId = req.user?.userId;

    if(!userId) return res.stat(403).json({message:"Unauthorized"});

    const existingUser = await User.findOne({email});
    if(existingUser) return res.status(404).json({message:"User already exists"});

    const addedByUser = new mongoose.Types.ObjectId(userId);

    const user = new User({
      username,
      email,
      password,
      phoneNo,
      addedBy: addedByUser,
    })
    await user.save();
    res.status(200).json({message:"User Created Successfully"});
  
  } catch (err) {
    res.status(500).json({message:err.message});
  }
};


// get users
export const getUsers = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const users = await User.aggregate([
      {
        $match: {
          addedBy: new mongoose.Types.ObjectId(userId),
        },
      },
    ]);

    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
