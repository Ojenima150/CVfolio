// server.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import pool from './db/db.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import session from 'express-session';
import hireRoute from './routes/hireRoute.js';
import fs from 'fs';
import nodemailer from "nodemailer";


dotenv.config();

// ===== Setup paths =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// ===== Middleware =====
app.use(cors());
app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, 'frontend')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/views', express.static(path.join(__dirname, 'views')));

// ===== Ensure uploads folder exists =====
const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// ===== Session =====
app.use(
  session({
    name: 'adminSession',
    secret: process.env.ADMIN_SECRET || 'supersecretkey',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 },
  })
);

// ===== Auth check =====
function checkAuth(req, res, next) {
  if (req.session && req.session.loggedIn) return next();
  res.status(401).json({ error: 'Unauthorized' });
}

// ===== Root route =====
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'))
);

// ===== Admin login/logout =====
app.post('/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASS) {
    req.session.loggedIn = true;
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// ===== Admin logout =====
app.post('/admin/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('adminSession');
    res.json({ success: true });
  });
});




// =================== HERO SECTION =====
app.get('/api/hero', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT heading, subheading, description FROM hero LIMIT 1'
    );
    if (result.rows.length === 0) {
      return res.json({
        heading: "Hi, I'm OJENIMA RAPHEAL",
        subheading: 'Full-Stack Developer & Cloud Engineer',
        description:
          'Building secure, scalable backend systems with PostgreSQL, Node.js, and AWS.',
      });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ Hero fetch error:', err);
    res.status(500).json({ error: 'Error fetching hero content' });
  }
});

// ===========================Update or create hero ==================
app.put('/admin/hero', checkAuth, async (req, res) => {
  const { heading, subheading, description } = req.body;
  if (!heading || !subheading || !description)
    return res.status(400).json({ error: 'All fields required' });

  try {
    const check = await pool.query('SELECT id FROM hero LIMIT 1');
    if (check.rows.length === 0) {
      const insert = await pool.query(
        'INSERT INTO hero (heading, subheading, description) VALUES ($1,$2,$3) RETURNING *',
        [heading, subheading, description]
      );
      res.json({ success: true, message: 'Hero created', data: insert.rows[0] });
    } else {
      const id = check.rows[0].id;
      const update = await pool.query(
        'UPDATE hero SET heading=$1,subheading=$2,description=$3 WHERE id=$4 RETURNING *',
        [heading, subheading, description, id]
      );
      res.json({ success: true, message: 'Hero updated', data: update.rows[0] });
    }
  } catch (err) {
    console.error('❌ Hero update error:', err);
    res.status(500).json({ error: 'Error updating hero' });
  }
});


// ==========================================================
// ✅ HERO IMAGE UPLOAD / REPLACE
// ==========================================================
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'frontend/access/images'));
  },
  filename: (req, file, cb) => {
    cb(null, 'roj.jpeg'); // always overwrite the same image
  },
});

const uploadHero = multer({ storage: imageStorage });

//================ Upload hero image===================
app.post('/admin/upload-hero', checkAuth, uploadHero.single('heroImage'), (req, res) => {
  res.json({
    success: true,
    message: 'Hero image updated successfully.',
    filename: 'roj.jpeg',
  });
});


// ===== ABOUT SECTION =====
app.get('/api/about', async (req, res) => {
  try {
    const result = await pool.query('SELECT content FROM about LIMIT 1');
    if (result.rows.length === 0)
      return res.json({ content: 'About content not available yet.' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ About fetch error:', err);
    res.status(500).json({ error: 'Error fetching about' });
  }
});

// Update or create about
app.put('/admin/about', checkAuth, async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Content is required' });
  try {
    const check = await pool.query('SELECT id FROM about LIMIT 1');
    if (check.rows.length === 0) {
      const insert = await pool.query(
        'INSERT INTO about (content) VALUES ($1) RETURNING *',
        [content]
      );
      res.json({ success: true, message: 'About created', data: insert.rows[0] });
    } else {
      const id = check.rows[0].id;
      const update = await pool.query(
        'UPDATE about SET content=$1 WHERE id=$2 RETURNING *',
        [content, id]
      );
      res.json({ success: true, message: 'About updated', data: update.rows[0] });
    }
  } catch (err) {
    console.error('❌ About update error:', err);
    res.status(500).json({ error: 'Error updating about' });
  }
});



// ===== EXPERIENCE =====
app.get('/experience', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM experience ORDER BY start_date DESC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch experience' });
  }
});

// ===== ADMIN: Add Work Experience =====
app.post('/admin/experience', checkAuth, async (req, res) => {
  const { title, company, start_date, end_date, description } = req.body;

  // Simple validation
  if (!title || !company || !start_date || !description) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO experience (title, company, start_date, end_date, description)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title, company, start_date, end_date || null, description]
    );

    res.json({ success: true, experience: result.rows[0] });
  } catch (err) {
    console.error('❌ Error adding experience:', err);
    res.status(500).json({ success: false, error: 'Failed to add experience' });
  }
});


// ===== SKILLS =====
app.get('/skills', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM skills ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});


// ========== working on post method for skills
app.post('/admin/skills', checkAuth, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ success: false, error: 'Skill name required' });

  try {
    const result = await pool.query(
      'INSERT INTO skills (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.json({ success: true, skill: result.rows[0] });
  } catch (err) {
    console.error('❌ Error inserting skill:', err);
    res.status(500).json({ success: false, error: 'Failed to add skill' });
  }
});



// ===== CORE SKILLS SECTION =====

// ===== CORE SKILLS SECTION =====
app.get('/api/core_skills', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM core_skills ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Core Skills fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch core skills' });
  }
});

// ✅ Create new core skill
app.post('/api/core_skills', checkAuth, async (req, res) => {
  const { name, level } = req.body;
  if (!name) return res.status(400).json({ error: 'Skill name required' });

  try {
    const result = await pool.query(
      'INSERT INTO core_skills (name, level) VALUES ($1, $2) RETURNING *',
      [name, level || null]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('❌ Error inserting core_skill:', err);
    res.status(500).json({ error: 'Failed to add core skill' });
  }
});


// DELETE a core skill
app.delete("/api/core_skills/:id", checkAuth, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("DELETE FROM core_skills WHERE id = $1", [id]);
        res.json({ success: true, message: "Core skill deleted successfully" });
    } catch (err) {
        console.error("❌ Error deleting core_skill:", err);
        res.status(500).json({ error: "Failed to delete core skill" });
    }
});

// ✅ Update a skill
// app.put('/api/core_skills/:id', checkAuth, async (req, res) => {
//   const { id } = req.params;
//   const { name, level } = req.body;

//   try {
//     const result = await pool.query(
//       'UPDATE core_skills SET name=$1, level=$2 WHERE id=$3 RETURNING *',
//       [name, level, id]
//     );
//     res.json({ success: true, data: result.rows[0] });
//   } catch (err) {
//     console.error('❌ Error updating core_skill:', err);
//     res.status(500).json({ error: 'Failed to update core skill' });
//   }
// });

// ✅ Delete a skill
// app.delete('/api/core_skills/:id', checkAuth, async (req, res) => {
//   const { id } = req.params;
//   try {
//     await pool.query('DELETE FROM core_skills WHERE id=$1', [id]);
//     res.json({ success: true, message: 'Core skill deleted successfully' });
//   } catch (err) {
//     console.error('❌ Error deleting core_skill:', err);
//     res.status(500).json({ error: 'Failed to delete core skill' });
//   }
// });











// ===== GET Projects =====
app.get('/projects', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM projects ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// ===== Add Project =====
app.post('/admin/projects', checkAuth, async (req, res) => {
  const { title, description, github_link, live_link } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO projects (title, description, github_link, live_link) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, github_link, live_link]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error adding project' });
  }
});

// ===== Multer Setup for Certificates =====
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public/uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ===== Upload Certificate =====
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { title, name_school, type_of_certificate, end_date, certificate_link } = req.body;
    const image_path = req.file ? `/uploads/${req.file.filename}` : null;

    const result = await pool.query(
      `INSERT INTO certificates (title, name_school, type_of_certificate, end_date, certificate_link, image_path)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [title, name_school, type_of_certificate, end_date, certificate_link, image_path]
    );

    res.json({ success: true, certificate: result.rows[0] });
  } catch (err) {
    console.error('❌ Upload error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ===== Get all Certificates =====
app.get('/certificates', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM certificates ORDER BY id DESC');
    res.json({ success: true, certificates: result.rows });
  } catch (err) {
    console.error('❌ Fetch certificates error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});




//==================== ⭐ RATE & REFERENCE ROUTES
//------------------------------------------------------

//========================= POST — Save a new rating and reference
app.post('/hire/save_rating', async (req, res) => {
  try {
    const { name, rating, reference } = req.body;

    if (!name || !rating || !reference) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    await pool.query(
      `INSERT INTO hire_ratings (name, rating, reference, created_at)
       VALUES ($1, $2, $3, NOW())`,
      [name, rating, reference]
    );

    res.json({ success: true, message: 'Rating saved successfully.' });
  } catch (error) {
    console.error('❌ Error saving rating:', error);
    res.status(500).json({ error: 'Failed to save rating.' });
  }
});

// ======================GET — Fetch all ratings
app.get('/hire/ratings', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, rating, reference, created_at
       FROM hire_ratings
       ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error fetching ratings:', error);
    res.status(500).json({ error: 'Failed to load ratings.' });
  }
});




// ================SEARCH PROJECTS===============================
// 🔍 SEARCH PROJECTS (by project_name, hire_name, or hire_email)
// ===============================================
app.get('/hire/search', async (req, res) => {
  const { query } = req.query;
  if (!query || query.trim() === '') return res.json([]);

  try {
    const sql = `
      SELECT 
        id,
        project_name, 
        hire_name, 
        hire_email, 
        folder_path, 
        uploaded_at
      FROM hire_projects
      WHERE project_name ILIKE $1
         OR hire_name ILIKE $1
         OR hire_email ILIKE $1
      ORDER BY uploaded_at DESC
    `;

    const result = await pool.query(sql, [`%${query}%`]);

    // Build full download link
    const formatted = result.rows.map(row => ({
      id: row.id,
      project_name: row.project_name,
      hire_name: row.hire_name,
      hire_email: row.hire_email,
      uploaded_at: row.uploaded_at,
      downloadLink: `/hire/download/${encodeURIComponent(row.project_name)}`
    }));

    res.json(formatted);
  } catch (err) {
    console.error('❌ Error in /hire/search:', err);
    res.status(500).json({ error: 'Database search failed' });
  }
});


// ==========================================================
// ✅ ADMIN DATA MANAGEMENT FOR SKILLS / EXPERIENCE / PROJECTS / CERTIFICATES
// ==========================================================
   // ✅================= FETCH ADMIN DATA============
app.get("/admin/data", checkAuth, async (req, res) => {
  try {
    const [skills, experiences, projects, certificates] = await Promise.all([
      pool.query("SELECT * FROM skills ORDER BY id ASC"), // ← plural
      pool.query("SELECT * FROM experience ORDER BY id ASC"),
      pool.query("SELECT * FROM projects ORDER BY id ASC"),
      pool.query("SELECT * FROM certificates ORDER BY id ASC"),
    ]);

    res.status(200).json({
      skills: skills.rows || [],
      experiences: experiences.rows || [],
      projects: projects.rows || [],
      certificates: certificates.rows || [],
    });
  } catch (err) {
    console.error("❌ Admin data fetch error:", err);
    res.status(500).json({ error: "Failed to load admin data" });
  }
});

// ==================== ADMIN  ROUTES  for  deleteing in admin ====================
app.get("/admin/ratings", checkAuth, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM hire_ratings ORDER BY created_at DESC");
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error("❌ Error fetching ratings:", err);
    res.status(500).json({ success: false, error: "Failed to load ratings" });
  }
});

app.delete("/admin/ratings/:id", checkAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM hire_ratings WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, error: "Rating not found" });
    }
    res.json({ success: true, message: "Rating deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting rating:", err);
    res.status(500).json({ success: false, error: "Failed to delete rating" });
  }
});


// ========================DELETE RECORD==================================
// ;=================================✅ DELETE RECORD
// ==========================================================
app.delete("/admin/:table/:id", checkAuth, async (req, res) => {
  const { table, id } = req.params;
  const allowed = ["skills", "experience", "projects", "certificates", "hire_ratings", "contacts"];
  if (!allowed.includes(table))
    return res.status(400).json({ error: "Invalid table name" });

  try {
    await pool.query(`DELETE FROM ${table} WHERE id=$1`, [id]);
    res.json({ success: true, message: `${table} deleted successfully.` });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ error: "Failed to delete record" });
  }
});

// ====================EDIT RECORD (PUT)======================================
// ✅ EDIT RECORD (PUT)
// ==========================================================
app.put("/admin/:table/:id", checkAuth, async (req, res) => {
  const { table, id } = req.params;
  const data = req.body;
  const editable = ["skills", "experience", "projects"];
  if (!editable.includes(table))
    return res.status(400).json({ error: "Editing not allowed for this table" });

  try {
    let query = "";
    let values = [];

    if (table === "skills") {
      query = "UPDATE skills SET name=$1 WHERE id=$2";
      values = [data.name, id];
    } else if (table === "experience") {
      query = `
        UPDATE experience 
        SET title=$1, company=$2, start_date=$3, end_date=$4, description=$5 
        WHERE id=$6
      `;
      values = [
        data.title,
        data.company,
        data.start_date,
        data.end_date,
        data.description,
        id,
      ];
    } else if (table === "projects") {
      query = "UPDATE projects SET title=$1, description=$2 WHERE id=$3";
      values = [data.title, data.description, id];
    }

    await pool.query(query, values);
    res.json({ success: true, message: `${table} updated successfully.` });
  } catch (err) {
    console.error("❌ Update error:", err);
    res.status(500).json({ error: "Failed to update record" });
  }
});


// //✅============= Update (Save) skills
  async function updateItem(table, id) {
    let payload = {};
    if (table === "skills") {
      payload.name = document.getElementById(`skill_${id}`).value.trim();
    } else if (table === "experience") {
      payload.title = document.getElementById(`exp_title_${id}`).value.trim();
      payload.company = document.getElementById(`exp_company_${id}`).value.trim();
      payload.start_date = document.getElementById(`exp_start_${id}`).value.trim();
      payload.end_date = document.getElementById(`exp_end_${id}`).value.trim();
      payload.description = document.getElementById(`exp_desc_${id}`).value.trim();
    } else if (table === "projects") {
      payload.title = document.getElementById(`proj_title_${id}`).value.trim();
      payload.description = document.getElementById(`proj_desc_${id}`).value.trim();
    }

    const res = await fetch(`/admin/${table}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    alert(result.message || "✅ Updated successfully");
    loadAdminData();
  }


// ===================== CONTACT FORM ROUTE  send mail =====================
// ===== CONTACT FORM  sendng message receiver  email=====

app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'All fields are required' });
  }

  try {
    // 1️⃣ Save message to database
    await pool.query(
      'INSERT INTO contacts (name, email, message, created_at) VALUES ($1, $2, $3, NOW())',
      [name, email, message]
    );

    // 2️⃣ Set up email transporter (Gmail + App Password)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.ADMIN_EMAIL,   // your Gmail address
        pass: process.env.GOOGLE_APP_PASS, // your App Password
      },
    });

    // 3️⃣ Send email both to client and admin
    const mailOptions = {
      from: `"OJ.Rapheal Contact" <${process.env.ADMIN_EMAIL}>`, // must be your email
      to: [email, process.env.ADMIN_EMAIL], // ✅ send to both friend & admin
      replyTo: process.env.ADMIN_EMAIL,
      subject: `Message from ${name} via Portfolio`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h3>New Message from Portfolio Contact Form</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
          <hr>
          <p style="font-size: 12px; color: #888;">Sent via OJ.Rapheal Portfolio Contact</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: '✅ Message sent successfully!' });
  } catch (err) {
    console.error('❌ Email send error:', err);
    res.status(500).json({ success: false, error: '❌ Server error while sending email' });
  }
});



// ===== ADMIN: Load all contact messages =====
app.get("/admin/contacts", checkAuth, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, message, created_at FROM contacts ORDER BY created_at DESC');
    console.log(`✅ Contacts fetched: ${result.rows.length}`);
    // Return array directly (this is what admini.js expects)
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching contacts:", err);
    // Keep response shape simple so frontend can handle it
    res.status(500).json({ success: false, error: "Failed to fetch contacts" });
  }
});

// ===== ADMIN: Delete a contact message =====
app.delete("/admin/contacts/:id", checkAuth, async (req, res) => {
  const { id } = req.params;
  console.log(`🗑️ Attempting to delete contact with ID: ${id}`);

  try {
    const contactId = parseInt(id, 10);
    if (isNaN(contactId)) {
      console.warn("⚠️ Invalid contact ID:", id);
      return res.status(400).json({ success: false, error: "Invalid contact ID" });
    }

    // Check existence first (gives clearer messages / avoids ambiguous DB errors)
    const check = await pool.query('SELECT id FROM contacts WHERE id = $1', [contactId]);
    if (check.rowCount === 0) {
      console.warn(`⚠️ No contact found with ID: ${contactId}`);
      return res.status(404).json({ success: false, error: "Message not found" });
    }

    const result = await pool.query('DELETE FROM contacts WHERE id = $1', [contactId]);

    console.log(`✅ Contact message deleted successfully (ID: ${contactId})`);
    res.json({ success: true, message: "Message deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting contact message:", err);
    res.status(500).json({ success: false, error: "Failed to delete contact" });
  }
});


// ===== HIRE ROUTE =====
app.use('/hire', hireRoute);


// ===== Serve static frontend files =====
app.use(express.static(path.join(__dirname, 'frontend')));

// ===== SPA fallback ===Then fallback for unknown routes (e.g., React/SPA routing)==
app.use((req, res) =>
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'))
);



// ===== Start Server =====
app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);
