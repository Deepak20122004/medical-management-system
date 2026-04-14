import multer from "multer";

// multer config: stores uploaded files in memory with 5MB size limit
// - used for profile picture uploads, processes files before sending to Cloudinary
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export default upload;
