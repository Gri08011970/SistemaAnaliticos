import multer from "multer";
import path from "path";
import fs from "fs";

const carpetaUploads = path.join(
  process.cwd(),
  "uploads",
  "fotia",
);

if (!fs.existsSync(carpetaUploads)) {
  fs.mkdirSync(carpetaUploads, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, carpetaUploads);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(
      file.originalname,
    );

    const nombreBase = path
      .basename(file.originalname, extension)
      .replace(/[^a-zA-Z0-9-_]/g, "_");

    const nombreFinal =
      `${Date.now()}-${nombreBase}${extension}`;

    cb(null, nombreFinal);
  },
});

const uploadFotia = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024,
  },
});

export default uploadFotia;