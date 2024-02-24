import User from "../models/userModel.js";
import HttpError from "../models/errorModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import fs from "fs";
import path from "path";
const __dirname = path.resolve();

export const registerController = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (!name || !email || !password || !confirmPassword) {
      return next(new HttpError("Enter all fields"), 422);
    }

    const newEmail = email.toLowerCase();
    const emailExists = await User.findOne({ email: newEmail });
    if (emailExists) {
      return next(new HttpError("Email already registered"), 422);
    }
    if (password.trim().length < 6) {
      return next(new HttpError("Password should have min 6 chars"), 422);
    }
    if (password != confirmPassword) {
      return next(new HttpError("Password mismatch"), 422);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      name,
      email: newEmail,
      password: hashedPass,
    });

    res.status(201).json(`User ${newUser.email} registered `);
  } catch (error) {
    return next(new HttpError("User Registration Failed"), 422);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new HttpError("Enter all fields"), 422);
    }
    const newEmail = email.toLowerCase();
    const user = await User.findOne({ email: newEmail });
    if (!user) {
      return next(new HttpError("Invalid User"), 422);
    }
    const comparePass = await await bcrypt.compare(password, user.password);

    if (!comparePass) {
      return next(new HttpError("Invalid Credentials"), 422);
    }
    const { _id: id, name } = user;
    const token = jwt.sign(
      {
        id,
        name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.status(200).json({ token, id, name });
  } catch (error) {
    return next(new HttpError("Login failed!!!"), 500);
  }
};

export const getUserController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) {
      return next(new HttpError("User Not Found"), 404);
    }
    res.status(200).json(user);
  } catch (error) {
    return next(new HttpError(error));
  }
};

export const changeAvatarController = async (req, res, next) => {
  try {
    if (!req.files.avatar) {
      return next(new HttpError("Please choose an image"), 404);
    }

    const user = await User.findById(req.user.id);

    if (user.avatar) {
      fs.unlink(path.join(__dirname, "uploads", user.avatar), (err) => {
        if (err) {
          return next(new HttpError(err));
        }
      });
    }

    const { avatar } = req.files;
    if (avatar.size > 500000) {
      next(new HttpError("File size should be less than 500kb"), 404);
    }
    let fileName;
    fileName = avatar.name;
    let splittedFileName = fileName.split(".");
    let newFileName =
      splittedFileName[0] +
      crypto.randomUUID() +
      "." +
      splittedFileName[splittedFileName.length - 1];
    avatar.mv(path.join(__dirname, "uploads", newFileName), async (err) => {
      if (err) {
        return next(new HttpError(err));
      }
      const updatedAvatar = await User.findByIdAndUpdate(
        req.user.id,
        { avatar: newFileName },
        { new: true }
      );
      if (!updatedAvatar) {
        next(new HttpError("Avatar change error"), 404);
      }
      res.status(200).json(updatedAvatar);
    });
  } catch (error) {
    return next(new HttpError(error));
  }
};

export const editUserController = async (req, res, next) => {
  try {
    const { name, email, currentPassword, newPassword, confirmNewPassword } =
      req.body;
    if (
      !name ||
      !email ||
      !newPassword ||
      !confirmNewPassword ||
      !currentPassword
    ) {
      return next(new HttpError("Enter all fields..."), 404);
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new HttpError("User not found"), 404);
    }

    const newEmail = email.toLowerCase();
    const emailExists = await User.findOne({ email: newEmail });
    if (emailExists && emailExists._id != req.user.id) {
      return next(new HttpError("Email already exist"), 404);
    }

    const validatePassword = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!validatePassword) {
      return next(new HttpError("Invalid current password"), 404);
    }

    if (newPassword != confirmNewPassword) {
      return next(new HttpError("Password Mismatch"), 404);
    }
    const salt = await bcrypt.genSalt(10);
    const newHashedPass = await bcrypt.hash(newPassword, salt);

    const newInfo = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        email,
        password: newHashedPass,
      },
      { new: true }
    );

    res.status(200).json(newInfo);
  } catch (error) {
    return next(new HttpError(error));
  }
};

export const getAuthorsController = async (req, res, next) => {
  try {
    const authors = await User.find().select("-password");
    res.status(200).json(authors);
  } catch (error) {
    return next(new HttpError(error));
  }
};
