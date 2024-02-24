import express, { urlencoded } from "express";
import cors from "cors";
import dotenv from "dotenv";
import upload from "express-fileupload";
import path from "path";

// file imports
import { connectDB } from "./config/connectDB.js";
import userRoute from "./routes/userRoute.js";
import postRoute from "./routes/postRoute.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

//config and env variables
const app = express();
dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL;
connectDB(MONGO_URI);
const __dirname = path.resolve();

const corsOrigin = {
  origin: FRONTEND_URL,
  credentials: true,
  optionSuccessStatus: 200,
};

//middleware
app.use(express.json());
app.use(cors(corsOrigin));
app.use(urlencoded({ extended: true }));
app.use(upload());
app.use("/uploads", express.static(__dirname + "/uploads"));

//API routes
app.use("/api/v1/users", userRoute);
app.use("/api/v1/posts", postRoute);

//Default route
app.get("/", (req, res) => {
  res
    .status(200)
    .send(
      `<h1>Welcome to Blog App Server🚀. Click <a href=${FRONTEND_URL}>here</a> to visit frontend </h1>`
    );
});

//error handling routes
app.use(notFound);
app.use(errorHandler);

//server call
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
