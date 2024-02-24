import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import HttpError from "../models/errorModel.js";
import crypto from "crypto";
import fs from "fs";
import path from "path";
const __dirname = path.resolve();

export const createPostController = async (req, res, next) => {
  try {
    const { title, description, category } = req.body;
    if (!title || !description || !category || !req.files) {
      return next(new HttpError("Enter all fields and thumbnail"), 404);
    }
    const { thumbnail } = req.files;

    if (thumbnail.size > 2000000) {
      next(new HttpError("File size should be less than 2mb"), 404);
    }
    let fileName = thumbnail.name;
    let splittedFileName = fileName.split(".");
    let newFileName =
      splittedFileName[0] +
      crypto.randomUUID() +
      "." +
      splittedFileName[splittedFileName.length - 1];

    thumbnail.mv(path.join(__dirname, "uploads", newFileName), async (err) => {
      if (err) {
        return next(new HttpError(err));
      } else {
        const newPost = await Post.create({
          title,
          category,
          description,
          thumbnail: newFileName,
          creator: req.user.id,
        });
        if (!newPost) {
          return next(new HttpError("Post not created error"), 404);
        }
        const currentUser = await User.findById(req.user.id);
        const userPostCount = currentUser.posts + 1;
        await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });
        res.status(201).json(newPost);
      }
    });
  } catch (error) {
    return next(new HttpError(error));
  }
};

export const getAllPostsController = async (req, res, next) => {
  try {
    const allPosts = await Post.find().sort({ updatedAt: -1 });
    res.status(200).json(allPosts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

export const getPostController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return next(new HttpError("Post Not Found"), 404);
    }
    res.status(200).json(post);
  } catch (error) {
    return next(new HttpError(error));
  }
};

export const getPostsByCategoryController = async (req, res, next) => {
  try {
    const { category } = req.params;
    const posts = await Post.find({ category }).sort({ createdAt: -1 });
    if (!posts) {
      return next(new HttpError("Posts Not Found"), 404);
    }
    res.status(200).json(posts);
  } catch (error) {
    return next(new HttpError(error));
  }
};
export const getUserPostsController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const posts = await Post.find({ creator: id }).sort({ createdAt: -1 });
    if (!posts) {
      return next(new HttpError("Post Not Found"), 404);
    }
    res.status(200).json(posts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

export const deletePostController = async (req, res, next) => {
  try {
    const postId = req.params.id;
    if (!postId) {
      return next(new HttpError("Post Unavailable"), 400);
    }

    const post = await Post.findById(postId);
    const fileName = post?.thumbnail;

    //delete thumbnail
    if (req.user.id === post.creator.toString()) {
      fs.unlink(path.join(__dirname, "uploads", fileName), async (err) => {
        if (err) {
          return next(new HttpError(err));
        } else {
          await Post.findByIdAndDelete(postId);
          const currentUser = await User.findById(req.user.id);
          const userPostCount = currentUser?.posts - 1;
          await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });
          res.status(200).json(`Post ${postId} deleted successfully!!!`);
        }
      });
    } else {
      return next(new HttpError("Invalid post delete operation"));
    }
  } catch (error) {
    return next(new HttpError(error));
  }
};

export const editPostController = async (req, res, next) => {
  try {
    let updatedPost;
    let fileName;
    let newFileName;
    const postId = req.params.id;

    const { title, category, description } = req.body;
    if (!title && !category && !description && description.length < 12) {
      return next(new HttpError("Enter all fields..."), 404);
    }
    const oldPost = await Post.findById(postId);
    if (req.user.id == oldPost.creator.toString()) {
      if (!req.files) {
        updatedPost = await Post.findByIdAndUpdate(
          postId,
          {
            title,
            category,
            description,
          },
          { new: true }
        );
      } else {
        //delete old thumbnail
        const oldPost = await Post.findById(postId);
        fs.unlink(path.join(__dirname, "uploads", oldPost.thumbnail), (err) => {
          if (err) {
            return next(new HttpError(err));
          }
        });
        //new thumbnail
        const { thumbnail } = req.files;
        if (thumbnail.size > 2000000) {
          next(new HttpError("File size should be less than 2mb"), 404);
        }
        fileName = thumbnail.name;
        let splittedFileName = fileName.split(".");
        newFileName =
          splittedFileName[0] +
          crypto.randomUUID() +
          "." +
          splittedFileName[splittedFileName.length - 1];
        thumbnail.mv(
          path.join(__dirname, "uploads", newFileName),
          async (err) => {
            if (err) {
              return next(new HttpError(err));
            }
          }
        );

        updatedPost = await Post.findByIdAndUpdate(
          postId,
          { title, category, description, thumbnail: newFileName },
          { new: true }
        );
      }

      if (!updatedPost) {
        return next(new HttpError("Update post failed"), 400);
      }
      res.status(200).json(updatedPost);
    } else {
      return next(new HttpError("Invalid post edit operation"));
    }
  } catch (error) {
    return next(new HttpError(error));
  }
};
