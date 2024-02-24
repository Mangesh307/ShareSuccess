//404
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  next(error);
};

//error - errorHandler
export const errorHandler = (error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  const message = error.message || "Internal Server Error...";
  const statusCode = error.code || 500;

  res.status(statusCode).json({ message });
};
