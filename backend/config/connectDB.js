import mongoose from "mongoose";

export const connectDB = async (url) => {
  try {
    const { connection } = await mongoose.connect(url);
    console.log(`DB connected : ${connection.host}`);
  } catch (error) {
    console.log(error);
  }
};
