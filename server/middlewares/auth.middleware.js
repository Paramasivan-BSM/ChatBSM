import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
let protectRoute = async (req, res, next) => {
  try {
    let token = req.cookie.jwt;

    if (!token) {
      res.status(401).json({ message: "Unauthorised - No token provided" });
    }

    let decode = jwt.verify(token, process.env.JWT_SECRET);

    if (!decode) {
      res.status(401).json({ message: "Unauthorised - Invalid Token" });
    }

    const user = await User.findById(decode.userID).select("-password");

    if (!user) {
      res.status(404).json({ message: "User not found!" });
    }

    req.user = user;
    next();
  } catch (e) {
    res.status(500).json({ message: "internal server Error" });
  }
};

export default protectRoute;
