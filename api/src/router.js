const { Router } = require("express");
const path = require("path");
const multer = require("multer");
const imageProcessor = require("./imageProcessor");

const router = Router();
const photoPath = path.resolve(__dirname, "../../client/photo-viewer.html");

const filename = (request, file, callback) => callback(null, file.originalname);

const storage = multer.diskStorage({
  destination: "api/uploads/",
  filename: filename,
});

const fileFilter = (request, file, callback) => {
  if (file.mimetype !== "image/png") {
    const err = "Wrong file type";
    request.fileValidationError = err;
    callback(null, false, new Error(err));
  } else {
    callback(null, true);
  }
};

const upload = multer({ fileFilter, storage });

router.post("/upload", upload.single("photo"), async (request, response) => {
  if (request.fileValidationError) {
    return response.status(400).json({ error: request.fileValidationError });
  }

  try {
    await imageProcessor(request.file.filename);
  } catch (error) {}

  return response.status(201).json({ success: true });
});

router.get("/photo-viewer", (request, response) => {
  response.sendFile(photoPath);
});

module.exports = router;
