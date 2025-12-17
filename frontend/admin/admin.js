// ====== SELECT ELEMENTS ======
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const loginError = document.getElementById('loginError');
const loginForm = document.getElementById('loginForm');
const adminActions = document.getElementById('adminActions');

// ====== LOGIN FUNCTION ======
loginBtn.addEventListener('click', async () => {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!email || !password) {
    alert('Please enter email and password');
    return;
  }

  try {
    const res = await fetch('/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (data.success) {
      loginForm.style.display = 'none';
      adminActions.style.display = 'block';
      loginError.style.display = 'none';
      alert('✅ Login successful!');
    } else {
      loginError.textContent = data.error || 'Login failed';
      loginError.style.display = 'block';
    }
  } catch (err) {
    alert('Error connecting to server');
    console.error(err);
  }
});

// ====== LOGOUT FUNCTION ======
logoutBtn.addEventListener('click', async () => {
  try {
    const res = await fetch('/admin/logout', { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      adminActions.style.display = 'none';
      loginForm.style.display = 'block';
      alert('✅ Logged out successfully!');
    }
  } catch (err) {
    console.error(err);
  }
});

// ====== ADD SKILL ======
async function addSkill() {
  const skillName = document.getElementById('skillName').value.trim();

  if (!skillName) {
    alert('Please enter a skill name');
    return;
  }

  try {
    const res = await fetch('/admin/skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: skillName })
    });

    const data = await res.json();
    if (data.success || data.id) {
      alert('✅ Skill added!');
      document.getElementById('skillName').value = '';
    }
  } catch (err) {
    alert('❌ Failed to add skill');
    console.error(err);
  }
}

// ====== ADD EXPERIENCE ======
async function addExperience() {
  const expTitle = document.getElementById('expTitle').value.trim();
  const expCompany = document.getElementById('expCompany').value.trim();
  const expStart = document.getElementById('expStart').value;
  const expEnd = document.getElementById('expEnd').value;
  const expDesc = document.getElementById('expDesc').value.trim();

  if (!expTitle || !expCompany || !expStart || !expDesc) {
    alert('Please fill in all required fields for experience');
    return;
  }

  try {
    const res = await fetch('/admin/experience', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: expTitle,
        company: expCompany,
        start_date: expStart,
        end_date: expEnd,
        description: expDesc
      })
    });

    const data = await res.json();
    if (data.success) {
      alert('✅ Work experience added!');
      document.getElementById('expTitle').value = '';
      document.getElementById('expCompany').value = '';
      document.getElementById('expStart').value = '';
      document.getElementById('expEnd').value = '';
      document.getElementById('expDesc').value = '';
    }
  } catch (err) {
    alert('❌ Failed to add experience');
    console.error(err);
  }
}

// ====== ADD PROJECT ======
async function addProject() {
  const projTitle = document.getElementById('projTitle').value.trim();
  const projDesc = document.getElementById('projDesc').value.trim();
  const projGithub = document.getElementById('projGithub').value.trim();
  const projLive = document.getElementById('projLive').value.trim();

  if (!projTitle || !projDesc) {
    alert('Please enter at least a title and description');
    return;
  }

  try {
  const res = await fetch('/admin/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',   // ✅ important
    body: JSON.stringify({
      title: projTitle,
      description: projDesc,
      github_link: projGithub,
      live_link: projLive
    })
  });


    const data = await res.json();
    if (data.success) {
      alert('✅ Project added successfully!');
      document.getElementById('projTitle').value = '';
      document.getElementById('projDesc').value = '';
      document.getElementById('projGithub').value = '';
      document.getElementById('projLive').value = '';
    } else {
      alert('❌ Failed to add project: ' + (data.error || 'Unknown error'));
    }
  } catch (err) {
    alert('❌ Server error while adding project');
    console.error(err);
  }
}


// ===== Add certificate Form =====
async function addCertificate() {
  const form = document.getElementById("certificateForm");
  const status = document.getElementById("certStatus");
  const preview = document.getElementById("certificatePreview");
  const formData = new FormData(form);

  // Debug: log formData entries
  console.log("Form Data Entries:", [...formData.entries()]);

  try {
    const res = await fetch("/upload", { method: "POST", body: formData });
    const data = await res.json();

    if (data.success) {
      form.reset();
      status.style.display = "block";
      status.style.color = "green";
      status.textContent = "Certificate saved successfully!";
      setTimeout(() => { status.style.display = "none"; }, 5000);

      // Reload certificates to show the new one
      await loadCertificates();

      // Optionally, show newly added certificate
      const cert = data.certificate;
      const div = document.createElement("div");
      div.className = "cert-card";
      div.innerHTML = `
        <img src="${cert.image_path}" alt="${cert.title}">
        <div><strong>${cert.title}</strong></div>
        <div>Issued by: ${cert.name_school}</div>
      `;
      preview.prepend(div);
    } else {
      status.style.display = "block";
      status.style.color = "red";
      status.textContent = "Error: " + data.error;
    }
  } catch (err) {
    status.style.display = "block";
    status.style.color = "red";
    status.textContent = "Server error: " + err.message;
  }
}

// Load existing certificates when admin panel opens
async function loadCertificates() {
  const preview = document.getElementById("certificatePreview");
  try {
    const res = await fetch("/certificates");
    const data = await res.json();

    if (data.success) {
      preview.innerHTML = "";
      data.certificates.forEach(cert => {
        const div = document.createElement("div");
        div.className = "cert-card";
        div.innerHTML = `
          <img src="${cert.image_path}" alt="${cert.title}">
          <div><strong>${cert.title}</strong></div>
          <div>Issued by: ${cert.name_school}</div>
        `;
        preview.appendChild(div);
      });
    } else {
      preview.innerHTML = "<p>No certificates found.</p>";
    }
  } catch (err) {
    console.error("Error loading certificates:", err);
  }
}

window.addEventListener("DOMContentLoaded", loadCertificates);


// ====== UPDATE ABOUT ======
async function updateAbout() {
  const aboutContent = document.getElementById('aboutContent').value.trim();

  if (!aboutContent) {
    alert('Please enter content for About section');
    return;
  }

  try {
    const res = await fetch('/admin/about', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',   // ✅ important
      body: JSON.stringify({ content: aboutContent })
    });


    const data = await res.json();
    if (data.success) {
      alert('✅ About section updated!');
      document.getElementById('aboutContent').value = '';
    }
  } catch (err) {
    alert('❌ Failed to update About section');
    console.error(err);
  }
}


// ====== UPDATE HERO SECTION ======
document.getElementById('heroForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(e.target));
  const res = await fetch('/admin/hero', {
    method: 'PUT', // ✅ FIXED
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // ✅ Also important if using sessions
    body: JSON.stringify(formData)
  });
  const result = await res.json();
  if (result.success) alert('✅ Hero section updated!');
  else alert('❌ Failed to update hero: ' + (result.error || 'Unknown error'));
});



//========= core skills display ========
// admin.js

// Fetch and display core skills
async function loadCoreSkills() {
    const container = document.getElementById("cSkills");
    container.innerHTML = "Loading...";

    try {
        const res = await fetch("/api/core_skills");
        if (!res.ok) throw new Error("Failed to fetch skills");

        const skills = await res.json();

        if (!skills.length) {
            container.innerHTML = "<p>No skills found.</p>";
            return;
        }

        container.innerHTML = skills.map(skill => `
            <div class="skill-item" data-id="${skill.id}">
                <span>${skill.name} (${skill.level})</span>
                <button class="delete">Delete</button>
            </div>
        `).join("");

    } catch (err) {
        container.innerHTML = "<p>Error loading skills.</p>";
        console.error(err);
    }
}

// Event delegation for delete buttons
document.getElementById("cSkills").addEventListener("click", async (e) => {
    if (!e.target.classList.contains("delete")) return;

    const div = e.target.closest(".skill-item");
    const id = div.dataset.id;

    if (!confirm("Are you sure you want to delete this skill?")) return;

    try {
        const res = await fetch(`/api/core_skills/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Delete failed");

        loadCoreSkills(); // refresh list after deletion
    } catch (err) {
        alert(err.message);
    }
});

// Load skills on page load
window.addEventListener("DOMContentLoaded", loadCoreSkills);













// ====== EXPOSE FUNCTIONS ======
window.addSkill = addSkill;
window.addExperience = addExperience;
window.addProject = addProject;
window.updateAbout = updateAbout;
