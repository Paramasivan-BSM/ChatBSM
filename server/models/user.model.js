import mongoose from "mongoose";

let userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilepic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

let userModel = mongoose.model("user", userSchema);

export default userModel;
