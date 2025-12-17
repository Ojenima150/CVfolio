import express from "express";
import pool from "../models/db.js";
import { ensureAuth, ensureAdmin, ensureCreateAdmin } from "../middleware/auth.js";
import { sendEmail } from "../utils/mailer.js";


const router = express.Router();

// Middleware: Only allow Main Admin (CEO)
function requireMainAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== "main_admin") {
    return res.status(403).send("Access denied");
  }
  next();
}

// ========================
// CEO Dashboard
// ========================
router.get("/dashboard", ensureAuth, requireMainAdmin, async (req, res) => {
  try {
    // Fetch created admins (pending + approved)
    const adminsResult = await pool.query(
      "SELECT id, name, email, approved FROM users WHERE role = 'created_admin'"
    );

    // Fetch all normal users too
    const usersResult = await pool.query(
      "SELECT id, name, email, role, approved FROM users WHERE role = 'user'"
    );

    res.render("main-admin-dashboard", {
      user: req.session.user,  // CEO info
      admins: adminsResult.rows,
      users: usersResult.rows
    });
  } catch (err) {
    console.error(err);
    res.send("Error loading CEO dashboard");
  }
});

// ========================
// Delete (Admin or User)
// ========================
router.post("/delete/:id", ensureAuth, requireMainAdmin, async (req, res) => {
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [req.params.id]);
    res.redirect("/admin/dashboard");
  } catch (err) {
    console.error(err);
    res.send("Error deleting account");
  }
});

// Show all pending admins (CEO only)
router.get("/admin/pending", ensureAdmin, ensureCreateAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email FROM users WHERE role = 'created_admin' AND approved = false"
    );
    res.render("pending-admins", { admins: result.rows });
  } catch (err) {
    console.error("❌ Error fetching pending admins:", err);
    res.status(500).send("Error fetching pending admins");
  }
});

// ========================
// Approve a Created Admin
// ========================
router.post("/approve/:id", ensureAuth, requireMainAdmin, async (req, res) => {
  try {
    await pool.query(
      "UPDATE users SET approved = true WHERE id = $1 AND role = 'created_admin'",
      [req.params.id]
    );
    res.redirect("/admin/dashboard");
  } catch (err) {
    console.error(err);
    res.send("Error approving admin");
  }
});

// ========================
// Approve a Created Admin and send email notification
// ========================

router.get("/approve/:id", ensureAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "UPDATE users SET approved = true WHERE id = $1 AND role = 'created_admin' RETURNING email, name",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Admin not found or already approved");
    }

    const approvedUser = result.rows[0];

    // ✅ Notify the Created Admin
    await sendEmail(
      approvedUser.email,
      "Your Admin Account Has Been Approved",
      `<p>Hello ${approvedUser.name},</p>
       <p>Your admin account has been approved by the CEO. You can now log in and manage products.</p>
       <p>🚀 <a href="http://localhost:3000/login">Login Here</a></p>`
    );

    res.redirect("/admin/dashboard");
  } catch (err) {
    console.error("❌ Error approving admin:", err);
    res.status(500).send("Error approving admin");
  }
});


// router.get("/approve/:id", ensureAdmin, async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Approve created admin
//     const result = await pool.query(
//       "UPDATE users SET approved = true WHERE id = $1 AND role = 'created_admin' RETURNING email, name",
//       [id]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).send("Admin not found or already approved");
//     }

//     const approvedUser = result.rows[0];

//     // ✅ Send email to the created admin
//     await sendEmail(
//       approvedUser.email,
//       "Your Admin Account Has Been Approved",
//       `<p>Hello ${approvedUser.name},</p>
//        <p>Your admin account has been approved by the CEO. You can now log in and manage products.</p>
//        <p>🚀 <a href="http://localhost:3000/login">Login Here</a></p>`
//     );

//     res.redirect("/admin/dashboard"); // instead of plain text
//   } catch (err) {
//     console.error("❌ Error approving admin:", err);
//     res.status(500).send("Error approving admin");
//   }
// });

export default router;
