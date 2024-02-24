import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    posts: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const userSchema = mongoose.model("user", schema);
export default userSchema;
