import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../lb/utilis.js";
import cloudinary from "../lb/cloudinary.js";

export let signup = async (req, res) => {
  try {
    let { u_fullname, u_email, u_password } = req.body;

    // Check if password length is sufficient
    if (u_password.length < 6) {
      return res
        .status(400)
        .json({ msg: "Password length must be at least 6 characters." });
    }

    // Check if email already exists
    let user = await User.findOne({ email: u_email });
    if (user) {
      return res.status(400).json({ msg: "Email already exists!" });
    }

    // Hashing the password
    let salt = await bcrypt.genSalt(10);
    let hashedPwd = await bcrypt.hash(u_password, salt);

    // Create new user
    let newUser = new User({
      fullName: u_fullname,
      email: u_email,
      password: hashedPwd,
    });

    if (newUser) {
      // Save user to DB

      // Generate token and respond with user data
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilepic: newUser.profilepic,
      });
    }
  } catch (e) {
    console.error(e); // Log the error for debugging
    res.status(500).json({
      msg: "An error occurred while creating an account.",
      status: false,
    });
  }
};

export let login = async (req, res) => {
  try {
    let { u_email, u_password } = req.body;

    let user = await User.findOne({ email: u_email });

    if (!user) {
      return res.status(400).json({
        msg: "Invalid Credintial",
      });
    }

    let IsCorrectpassword = await bcrypt.compare(u_password, user.password);

    if (!IsCorrectpassword) {
      return res.status(400).json({
        msg: "Invalid Credintial",
      });
    }

    generateToken(user._id, res);

    res.status(200).json({
      msg: "login done",
      _id: user._id,
      fullname: user.fullName,
      email: user.email,
      profilepic: user.profilepic,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Internal server Error",
    });
  }
};

export let logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({
      msg: "Logout done!",
    });
  } catch (e) {}
};

// export const updateProfile = async (req, res) => {
//   try {
//     const { profilePic } = req.body;
//     const userId = req.user._id;

//     if (!profilePic) {
//       return res.status(400).json({ message: "Profile pic is required" });
//     }

//     const uploadResponse = await cloudinary.uploader.upload(profilePic);
//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { profilePic: uploadResponse.secure_url },
//       { new: true }
//     );

//     res.status(200).json(updatedUser);
//   } catch (error) {
//     console.log("error in update profile:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    console.log("Profile Pic Received:", profilePic);
    console.log("User ID:", userId);

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader
      .upload(profilePic)
      .catch((err) => {
        console.error("Cloudinary upload error:", err);
        return res
          .status(500)
          .json({ message: "Failed to upload image to Cloudinary" });
      });

    console.log("Cloudinary Upload Response:", uploadResponse);

    // Update MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilepic: uploadResponse.secure_url },
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ message: "User not found or update failed" });
    }

    console.log("Updated User Document:", updatedUser);

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error in updateProfile:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
