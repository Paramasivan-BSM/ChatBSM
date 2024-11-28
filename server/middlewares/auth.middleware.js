import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    // Retrieve the token from cookies or headers
    const token = req.cookies?.jwt || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized - No Token Provided",
      });
    }

    // Verify and decode the token
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_KEY);
    } catch (err) {
      return res.status(401).json({
        message: "Unauthorized - Invalid Token",
      });
    }

    // Fetch the user object from the database
    const user = await User.findById(decodedToken.userId).select("-password");
    if (!user) {
      return res.status(404).json({
        msg: "User Not Found!",
      });
    }

    // Attach user to the request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);
    res.status(500).json({ msg: "Internal server error in AuthMiddleware" });
  }
};
