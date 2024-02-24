import { Schema, model } from "mongoose";

const schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Computer",
        "Information_Technology",
        "Electronics_and_telecommunication",
        "Electronics",
        "Mechanical",
        "Civil",
        "Chemical",
        "Design",
      ],
      message: "VALUE is not supported",
    },
    description: {
      type: String,
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    thumbnail: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const postSchema = model("post", schema);
export default postSchema;
