import express from "express";
import path from "path";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import session from "express-session";
import multer from "multer";
import flash from "connect-flash";
import { fileURLToPath } from "url";
import fs from "fs";

import authRoutes from "./routes/auth.js";
import productsRouter from "./routes/products.js";
import adminRoutes from "./routes/admin.js";
import cartRoutes from "./routes/cart.js";
import paymentRoutes from "./routes/payment.js";
import indexRoutes from "./routes/index.js";   // 👈 added

dotenv.config();
const app = express();

// Needed because __dirname is not available in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "public", "uploads");
console.log("Uploads directory path:", uploadsDir); // <-- add this line to confirm
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(flash());

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Multer for image uploads
// Multer is configured per-route in routes/products.js using upload.single('image')

// Make user available in all views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Serve static assets (must be before routers so /uploads/* is served reliably)
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", indexRoutes);
app.use("/", authRoutes);
app.use("/", productsRouter); // home = products
app.use("/admin", adminRoutes);
app.use("/cart", cartRoutes);
app.use("/payment", paymentRoutes);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(
  PORT, () => 
    console.log(`🚀 Server running on http://localhost:${PORT}`)
);
