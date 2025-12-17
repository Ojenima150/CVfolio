async function loadProjects() {
  const res = await fetch('/projects'); // ✅ Correct public route
  const projects = await res.json();

  const container = document.getElementById('projectsContainer');
  container.innerHTML = ''; // Clear old data

  if (projects.length === 0) {
    container.innerHTML = '<p>No projects added yet.</p>';
    return;
  }

  projects.forEach(p => {
    const card = document.createElement('div');
    card.classList.add('project-card');
    card.innerHTML = `
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <a href="${p.github_link}" target="_blank">GitHub</a> |
      <a href="${p.live_link}" target="_blank">Live Demo</a>
    `;
    container.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', loadProjects);
