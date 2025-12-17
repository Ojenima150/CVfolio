// ROJR/routes/hireRoute.js
import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import archiver from "archiver";
import pool from "../db/db.js";

const router = express.Router();

// ---------- Multer storage setup ----------
let folderNameForSession = null; // persistent folder name per upload

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      // If no folder created yet for this request, create one now
      if (!folderNameForSession) {
        const cleanName = req.body.projectName?.replace(/\s+/g, "_") || "project";
        folderNameForSession = `${cleanName}_${Date.now()}`;
        fs.mkdirSync(path.join("uploads", folderNameForSession), { recursive: true });
      }
      cb(null, path.join("uploads", folderNameForSession));
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

// ---------- Upload route ----------
router.post("/upload", upload.array("files"), async (req, res) => {
  const { projectName, hireName, hireEmail } = req.body;
  const folderName = folderNameForSession;
  folderNameForSession = null; // reset after upload

  try {
    // ✅ Insert into PostgreSQL
    await pool.query(
      "INSERT INTO hire_projects (project_name, hire_name, hire_email, folder_path) VALUES ($1, $2, $3, $4)",
      [projectName, hireName, hireEmail, folderName]
    );

    res.status(200).json({ success: true, message: "Upload successful!" });
  } catch (err) {
    console.error("❌ Upload DB error:", err);
    res.status(500).json({ success: false, message: "Error saving project." });
  }
});

// ---------- Get all projects ----------
router.get("/projects", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM hire_projects ORDER BY uploaded_at DESC");
    const formatted = result.rows.map((p) => ({
      projectName: p.project_name,
      hireName: p.hire_name,
      hireEmail: p.hire_email,
      folderPath: p.folder_path,
      uploadedAt: p.uploaded_at,
      link: `/views/display_hire.html?project=${encodeURIComponent(p.folder_path)}`,
      downloadLink: `/hire/download/${encodeURIComponent(p.folder_path)}`
    }));

    res.json(formatted);
  } catch (err) {
    console.error("❌ Fetch projects error:", err.message);
    res.status(500).json({ success: false, message: "Error fetching projects." });
  }
});

// ---------- Download ZIP ----------
router.get("/download/:folderName", (req, res) => {
  const folderName = req.params.folderName;
  const folderPath = path.join("uploads", folderName);

  if (!fs.existsSync(folderPath)) {
    return res.status(404).send("Folder not found");
  }

  res.setHeader("Content-Disposition", `attachment; filename="${folderName}.zip"`);
  res.setHeader("Content-Type", "application/zip");

  const archive = archiver("zip", { zlib: { level: 9 } });
  archive.pipe(res);

  // ✅ Recursively include all files/subfolders
  archive.directory(folderPath, false);

  archive.finalize();

  archive.on("error", (err) => {
    console.error("❌ Zip creation error:", err);
    res.status(500).send("Error creating zip file");
  });
});

export default router;
