import multer from "multer";
import path from "path";

// Use memory storage for safety, especially if deploying to serverless environments
// It can also be switched to diskStorage if files need to be saved locally first
const storage = multer.memoryStorage();

// File filter to allow only image files
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only JPEG, PNG, and WEBP image files are allowed."));
    }
};

export const uploadMiddleware = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});
