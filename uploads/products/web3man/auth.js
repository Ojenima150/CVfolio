import express from "express";
import bcrypt from "bcrypt";
import pool from "../models/db.js";
// import { ensureAdmin } from "../middleware/auth.js"
import { ensureCreateAdmin } from "../middleware/auth.js";

import { sendEmail } from "../utils/mailer.js";

const router = express.Router();

// =========================
// Register (User or Created Admin)
// =========================
router.get("/register", async (req, res) => {
  try {
    const ceoCheck = await pool.query("SELECT * FROM users WHERE role = 'main_admin'");
    const ceoExists = ceoCheck.rows.length > 0;

    res.render("register", { 
      error: null, 
      user: req.session.user || null, 
      ceoExists 
    });
  } catch (err) {
    console.error(err);
    res.render("register", { 
      error: "Error loading register page", 
      user: req.session.user || null, 
      ceoExists: true   // default to true to hide CEO button on error
    });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (name, email, password, role, approved) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [
        name,
        email,
        hashed,
        role || "user",
        role === "created_admin" ? false : true, // Created Admin must be approved by Main Admin
      ]
    );

    res.redirect("/login");
  } catch (err) {
    console.error(err);
    // also pass ceoExists again in error case
    const ceoCheck = await pool.query("SELECT * FROM users WHERE role = 'main_admin'");
    const ceoExists = ceoCheck.rows.length > 0;

    res.render("register", { 
      error: "Email already exists", 
      user: null, 
      ceoExists 
    });
  }
});

// =========================
// CEO Registration (Main Admin)
// =========================
router.get("/register-ceo", async (req, res) => {
  try {
    const existingCEO = await pool.query("SELECT * FROM users WHERE role = 'main_admin'");
    if (existingCEO.rows.length > 0) {
      return res.send("CEO already exists. Only one CEO allowed.");
    }
    res.render("register-ceo", { error: null });
  } catch (err) {
    console.error("❌ Error in GET /register-ceo:", err.message);
    res.send("Error loading CEO registration form: " + err.message);
  }
});

router.post("/register-ceo", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingCEO = await pool.query("SELECT * FROM users WHERE role = 'main_admin'");
    if (existingCEO.rows.length > 0) {
      return res.send("CEO already exists. Only one CEO allowed.");
    }

    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (name, email, password, role, approved) VALUES ($1,$2,$3,$4,$5)",
      [name, email, hashed, "main_admin", true]
    );

    res.redirect("/login");
  } catch (err) {
    
    console.error("❌ Error in POST /register-ceo:", err.message);
    res.render("register-ceo", { error: "Failed to create CEO account: " + err.message });
  
  }
});

// =========================
// Approve Created Admin (only CEO can do this)
// =========================
router.get("/admin/approve/:id", ensureCreateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Update approved status
    await pool.query(
      "UPDATE users SET approved = true WHERE id = $1 AND role = 'created_admin'",
      [id]
    );

    // ✅ Use flash message if you want
    req.flash("success", "Admin approved successfully!");

    // Redirect back to admin dashboard or homepage
    res.redirect("/admin/dashboard");
  } catch (err) {
    console.error("❌ Error approving admin:", err);
    req.flash("error", "Error approving admin");
    res.redirect("/admin/dashboard");
  }
});

// import { sendEmail } from "../utils/mailer.js";
// =========================
// Created Admin Registration.
// Notify CEO for approval.
// =========================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (role === "created_admin") {
      // hash password
      const hashed = await bcrypt.hash(password, 10);

      const result = await pool.query(
        "INSERT INTO users (name, email, password, role, approved) VALUES ($1,$2,$3,$4,$5) RETURNING id",
        [name, email, hashed, role, false]
      );

      // ✅ Notify CEO
      const ceoEmail = "ceo@example.com"; // or fetch from DB if you like
      await sendEmail(
        ceoEmail,
        "New Admin Registration Request",
        `<p>Dear CEO,</p>
         <p>A new admin <b>${name}</b> has registered and is awaiting your approval.</p>
         <p>👉 <a href="http://localhost:3000/admin/approve/${result.rows[0].id}">Approve Now</a></p>`
      );

      return res.render("login", { error: "Account created! Wait for CEO approval." });
    }

    // Otherwise register normal user
    const hashed = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (name, email, password, role, approved) VALUES ($1,$2,$3,$4,$5)",
      [name, email, hashed, "user", true]
    );

    res.redirect("/login");
  } catch (err) {
    console.error("❌ Error registering user:", err);
    res.render("register", { error: "Registration failed" });
  }
});



// =========================
// Login
// =========================
router.get("/login", (req, res) => {
  res.render("login", { error: null, user: req.session.user || null });
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query("SELECT * FROM users WHERE email=$1", [email]);

    if (result.rows.length === 0) {
      return res.render("login", { error: "Invalid email or password", user: null });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.render("login", { error: "Invalid email or password", user: null });
    }

    if (user.role === "created_admin" && !user.approved) {
      return res.render("login", { error: "Admin not yet approved by Main Admin", user: null });
    }

    req.session.user = user;

    if (user.role === "main_admin") {
      return res.redirect("/admin/dashboard");
    } else if (user.role === "created_admin") {
      return res.redirect("/products/mine");
    } else {
      return res.redirect("/");
    }
  } catch (err) {
    console.error(err);
    res.render("login", { error: "Login failed", user: null });
  }
});

// =========================
// Logout
// =========================
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

export default router;
