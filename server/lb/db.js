import mongoose from "mongoose";

export const connectDB = async (req, res) => {
  try {
    let conn = await mongoose.connect(process.env.MONGOURI);
    console.log(`db connected: ${conn.connection.host}`);
  } catch (e) {
    console.log("failld to connect :" + e);
  }
};
