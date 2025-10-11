import multer from "multer";
import { ErrorRequestHandler } from "express";
import { BadRequestError } from "../errors/BadRequestError";
import { EnumStatusCode } from "../enums/status-codes";

// 5 MB file size limit
const fileSize = 5 * 1024 * 1024;

// Use memory storage since files are likely forwarded to S3
const storage = multer.memoryStorage();

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/bmp",
  "image/webp",
  "image/tiff",
  "image/svg+xml",
];

// Base multer instance configured for images
export const imageUpload = multer({
  storage,
  limits: { fileSize },
  fileFilter(req, file, cb) {
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new BadRequestError(
          EnumStatusCode.FILE_TYPE_MISMATCH,
          "Only image files are allowed!"
        )
      );
    }
    cb(null, true);
  },
});

// Error transformer to convert Multer errors into our CustomError format
export const transformMulterError: ErrorRequestHandler = (
  err,
  _req,
  _res,
  next
) => {
  // Multer throws MulterError for limits and other internal validations
  if (err && (err as any).name === "MulterError") {
    const multerErr = err as multer.MulterError;
    if (multerErr.code === "LIMIT_FILE_SIZE") {
      return next(
        new BadRequestError(
          EnumStatusCode.FILE_TOO_LARGE,
          `File too large. Max ${Math.floor(fileSize / (1024 * 1024))}MB`
        )
      );
    }
    return next(
      new BadRequestError(EnumStatusCode.BAD_REQUEST, multerErr.message)
    );
  }
  // If it's already a CustomError or another error, pass it along
  return next(err);
};

// Convenience helpers to use directly in routers
export const uploadSingleImage = (fieldName: string) => [
  imageUpload.single(fieldName),
  transformMulterError,
];

export const uploadArrayImages = (fieldName: string, maxCount: number) => [
  imageUpload.array(fieldName, maxCount),
  transformMulterError,
];
