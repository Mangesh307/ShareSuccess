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
        "Uncategorized",
        "Computer",
        "Information_Technology",
        "Electronics_&_Telecommunication",
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
