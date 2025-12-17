import express from "express";
const router = express.Router();

// Checkout page
router.get("/checkout", (req, res) => {
  const cart = req.session.cart || [];
  res.render("checkout", { cart });
});

// Payment success
router.get("/success", (req, res) => {
  req.session.cart = []; // clear cart
  res.render("success");
});

// Payment cancel
router.get("/cancel", (req, res) => {
  res.render("cancel");
});

export default router;
