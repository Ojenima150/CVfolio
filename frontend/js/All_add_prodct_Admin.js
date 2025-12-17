// ==================// frontend/js/skills.js ===================
async function loadSkills() {
  try {
    const response = await fetch('http://localhost:5000/skills');
    const skills = await response.json();

    const container = document.getElementById('skillsContainer');
    container.innerHTML = '';

    if (skills.length === 0) {
      container.innerHTML = '<p>No skills added yet.</p>';
      return;
    }

    skills.forEach(skill => {
      const skillBox = document.createElement('div');
      skillBox.classList.add('skill-box');
      skillBox.innerHTML = `
        <span class="skill-icon">⚡</span>
        <span class="skill-name">${skill.name}</span>
      `;
      container.appendChild(skillBox);
    });
  } catch (err) {
    console.error(err);
    document.getElementById('skillsContainer').innerHTML = '<p>Failed to load skills</p>';
  }
}

document.addEventListener('DOMContentLoaded', loadSkills);

// ==================experience.js===================================
// frontend/js/experience.js
async function loadExperience() {
  try {
    const response = await fetch('http://localhost:5000/experience');
    const experiences = await response.json();

    const container = document.getElementById('experienceContainer');
    container.innerHTML = '';

    if (!Array.isArray(experiences) || experiences.length === 0) {
      container.innerHTML = '<p>No experience added yet.</p>';
      return;
    }

    experiences.forEach(item => {
      const expCard = document.createElement('div');
      expCard.className = 'experience-card';

      // Build DOM nodes explicitly (avoids accidental markup nesting)
      const header = document.createElement('h3');
      header.className = 'experience-header';

      const titleSpan = document.createElement('span');
      titleSpan.className = 'experience-title';
      titleSpan.textContent = `${item.title} – ${item.company}`;

      const dateSpan = document.createElement('span');
      dateSpan.className = 'experience-date';
      dateSpan.textContent = `(${item.start_date} - ${item.end_date || 'Present'})`;

      header.appendChild(titleSpan);
      header.appendChild(dateSpan);

      const desc = document.createElement('p');
      desc.className = 'description';
      // preserve newlines
      desc.innerHTML = (item.description || '').replace(/\n/g, '<br>');

      expCard.appendChild(header);
      expCard.appendChild(desc);
      container.appendChild(expCard);
    });

  } catch (err) {
    console.error('Error loading experience:', err);
    document.getElementById('experienceContainer').innerHTML = '<p>Unable to load experience data.</p>';
  }
}

document.addEventListener('DOMContentLoaded', loadExperience);


// ==================projects.js===================================

// frontend/js/projects.js// ✅ Frontend: Load and Display Projects
document.getElementById('addProjectForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('projectTitle').value;
  const description = document.getElementById('projectDescription').value;
  const github = document.getElementById('projectGithub').value;
  const live = document.getElementById('projectLive').value;

  try {
    const response = await fetch('http://localhost:5000/admin/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, github_link: github, live_link: live })
    });

    const result = await response.json();
    if (result.success) {
      alert('✅ Project added successfully!');
      e.target.reset();
    } else {
      alert('❌ Failed to add project.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('⚠️ Server error.');
  }
});



// ===== Update About Section =====
