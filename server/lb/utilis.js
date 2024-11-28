import jwt from "jsonwebtoken";
export let generateToken = (userID, res) => {
  let token = jwt.sign({ userID }, process.env.JWT_KEY, { expiresIn: "7d" });
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 1000,
    httpOnly: true, //prevents xss attacks cross-site scripting attacks
    sameSite: "strict", // CSRF attacks  cross-site request forgery attacks
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};
