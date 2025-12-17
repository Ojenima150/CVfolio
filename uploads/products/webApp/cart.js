import express from "express";
import { ensureAuth } from "../middleware/auth.js";
const router = express.Router();

// =====================
// Show Cart
// =====================
router.get("/", (req, res) => {
  const cart = req.session.cart || [];

  // Calculate total
  const total = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);

  res.render("cart", { cart, total });
});

// =====================
// Add to Cart
// =====================
router.post("/add", ensureAuth, async (req, res) => {
  const { id, name, price } = req.body;

  if (!req.session.cart) req.session.cart = [];

  req.session.cart.push({ id, name, price: parseFloat(price) });

  res.redirect("/cart");
});

// =====================
// Remove from Cart
// =====================
router.post("/remove/:index", (req, res) => {
  if (req.session.cart) {
    req.session.cart.splice(req.params.index, 1);
  }
  res.redirect("/cart");
});

export default router;
