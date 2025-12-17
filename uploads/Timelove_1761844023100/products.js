import express from "express";
import pool from "../models/db.js";
import multer from "multer";
import { ensureAuth, ensureCreateAdmin } from "../middleware/auth.js";
import path from "path";
import fs from "fs";

const router = express.Router();

// configure multer (use absolute path)
const uploadsPath = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsPath),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// ========================
// Show ALL products
// ========================
router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM products ORDER BY id DESC");
  res.render("products", { user: req.session?.user, products: result.rows });
});

// ========================
// Show Add Product Form (only create_admin can see this)
// ========================
router.get("/add", ensureCreateAdmin, (req, res) => {
  res.render("add-product", { user: req.session.user });
});

// ========================
// Add a new product
// ========================
router.post("/add", ensureCreateAdmin, upload.single("image"), async (req, res) => {
  try {
    console.log("=== ADD PRODUCT START ===");
    console.log("Session user:", req.session?.user);
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);

    // support both form names: keep using req.body.name in the form but insert into DB column `title`
    const title = req.body.title || req.body.name;
    const { description } = req.body;
    let { price, stock } = req.body;

    price = price ? parseFloat(price) : 0;
    stock = stock ? parseInt(stock, 10) : 0;

    if (!title || isNaN(price)) {
      console.error("Validation failed: title or price missing/invalid", { title, price });
      return res.status(400).send("Title and valid price are required");
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const createdBy = req.session?.user?.id;
    if (!createdBy) {
      console.error("ERROR: No session user id found when adding product");
      return res.status(401).send("Not authenticated");
    }

    // Defensive: ensure uploads dir exists
    const uploadsPath = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath, { recursive: true });

    // insert into the actual DB columns (title is NOT NULL in your schema)
    const query = `
      INSERT INTO products (title, description, price, stock, image_url, created_by)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    const values = [title, description || null, price, stock, imagePath, createdBy];

    console.log("DB insert values:", values);
    await pool.query(query, values);

    console.log("Product added successfully");
    return res.redirect("/products");
  } catch (err) {
    console.error("❌ Error adding product (full):", err);
    if (err.stack) console.error(err.stack);
    return res.status(500).send("Error adding product: " + (err.message || "internal"));
  }
});

// GET /products/mine — show products owned/created by logged-in user
router.get("/mine", ensureAuth, ensureCreateAdmin, async (req, res) => {
  try {
    console.log("session user:", req.session.user); // temporary debug
    const userId = req.session?.user?.id || req.user?.id;
    if (!userId) return res.redirect("/login");

    // use the same column name used when inserting products (created_by)
    const result = await pool.query("SELECT * FROM products WHERE created_by = $1 ORDER BY id DESC", [userId]);
    res.render("my-products", { user: req.session.user, products: result.rows });
  } catch (err) {
    console.error("Error loading your products:", err);
    res.status(500).send("Error loading your products");
  }
});

export default router;
