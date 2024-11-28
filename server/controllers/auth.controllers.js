import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../lb/utilis.js";

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

export let logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({
      msg: "logout done",
    });
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
};

export let updateProfile = (req, res) => {};
