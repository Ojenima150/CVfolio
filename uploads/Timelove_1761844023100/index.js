import express from "express";
import pool from "../models/db.js";

const router = express.Router();

// Home Page - Show products
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY created_at DESC");
    res.render("index", {
      user: req.session.user || null,
      products: result.rows
    });
  } catch (err) {
    console.error(err);
    res.render("index", { user: req.session.user || null, products: [] });
  }
});

export default router;
