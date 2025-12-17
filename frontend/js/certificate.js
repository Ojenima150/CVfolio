document.addEventListener("DOMContentLoaded", () => {
  fetch('/api/certificates')
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('certificate-list');
      container.innerHTML = '';

      data.forEach(cert => {
        const card = document.createElement('div');
        card.classList.add('certificate-card');

        card.innerHTML = `
          <img src="${cert.image_url}" alt="${cert.title}">
          <h3>${cert.title}</h3>
          <p><strong>School:</strong> ${cert.name_school}</p>
          <p><strong>Type:</strong> ${cert.type_of_certificate}</p>
          <p><strong>Completed:</strong> ${new Date(cert.end_date).toDateString()}</p>
          ${cert.certificate_link ? `<a href="${cert.certificate_link}" target="_blank">View Credential</a>` : ''}
        `;
        container.appendChild(card);
      });
    })
    .catch(error => {
      document.getElementById('certificate-list').innerHTML = '<p>Error loading certificates.</p>';
      console.error('Error:', error);
    });
});
