// main.js
const API_BASE = '';

document.addEventListener('DOMContentLoaded', () => {
  // Load sections
  loadHero();
  loadAbout();
  loadExperience();
  loadSkills();
  loadRatings(); // ✅ load ratings on homepage

  //================= Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('roj_theme');
  if (savedTheme === 'light') document.body.classList.add('light-mode');

  themeToggle?.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    localStorage.setItem(
      'roj_theme',
      document.body.classList.contains('light-mode') ? 'light' : 'dark'
    );
  });
});

// ========= Helper =========
async function fetchJSON(path) {
  try {
    const res = await fetch(API_BASE + path);
    if (!res.ok) throw new Error(`Bad response for ${path}`);
    return await res.json();
  } catch (err) {
    console.error('Fetch error:', path, err);
    return null;
  }
}

// ========= HERO =========
async function loadHero() {
  const data = await fetchJSON('/api/hero');
  if (!data) return;

  const heading = document.getElementById('hero-heading');
  const subheading = document.getElementById('hero-subheading');
  const desc = document.getElementById('hero-description');

  if (heading) heading.textContent = data.heading;
  if (subheading) subheading.textContent = data.subheading;
  if (desc) desc.textContent = data.description;
}

// ========= ABOUT =========
async function loadAbout() {
  const data = await fetchJSON('/api/about');
  if (!data) return;
  const aboutContent = document.getElementById('about-content');
  if (aboutContent) aboutContent.textContent = data.content;
}

// ========= EXPERIENCE =========
async function loadExperience() {
  const data = await fetchJSON('/experience');
  const container = document.getElementById('experienceContainer');
  if (!container) return;

  container.innerHTML = '';
  if (!Array.isArray(data) || data.length === 0) {
    container.innerHTML = '<p>No experience added yet.</p>';
    return;
  }
  data.forEach((exp) => {
    const div = document.createElement('div');
    div.className = 'experience-card';
    div.innerHTML = `
      <h3>${exp.title} @ ${exp.company}</h3>
      <p><small>${exp.start_date} - ${exp.end_date || 'Present'}</small></p>
      <p>${exp.description || ''}</p>
    `;
    container.appendChild(div);
  });
}

// ========= SKILLS =========
async function loadSkills() {
  const data = await fetchJSON('/skills');
  const container = document.getElementById('skillsContainer');
  if (!container) return;
  container.innerHTML = data
    .map((s) => `<div class="skill-card">${s.name}</div>`)
    .join('');
}

// ========= RATING =========

async function loadRatings() {
  try {
    const res = await fetch('/hire/ratings');
    if (!res.ok) throw new Error('Failed to fetch ratings');
    const ratings = await res.json();

    const container = document.getElementById('ratings');
    if (!container) {
      console.warn('⚠️ No #ratings element found in DOM');
      return;
    }

    if (!Array.isArray(ratings) || ratings.length === 0) {
      container.innerHTML = '<p>No ratings yet. Be the first!</p>';
      return;
    }

    container.innerHTML = `
      <div class="rate-grid">
        ${ratings
          .map(
            (r) => `
          <div class="rate-card">
            <h3>${r.name}</h3>
            <p><strong>Rating:</strong> ${'⭐'.repeat(r.rating)}</p>
            <p class="reference-text">"${r.reference}"</p>
            <small>${new Date(r.created_at).toLocaleDateString()}</small>
          </div>
        `
          )
          .join('')}
      </div>
    `;
  } catch (err) {
    console.error('❌ Error loading ratings:', err);
  }
}













// ========= CONTACT =========
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');

  if (!form) return; // Skip if not on contact page

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch('/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Message sent successfully!');
        form.reset();
      } else {
        alert('❌ ' + (data.error || 'Failed to send message.'));
      }
    } catch (err) {
      console.error('❌ Network error:', err);
      alert('Something went wrong. Please try again later.');
    }
  });
});
