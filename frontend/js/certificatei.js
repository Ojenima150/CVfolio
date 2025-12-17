// Fetch certificates dynamically from backend
async function loadCertificates() {
  try {
    const res = await fetch("/certificates");
    const data = await res.json();

    const container = document.getElementById("certificateList");
    container.innerHTML = ""; // clear old content

    if (data.success && data.certificates.length > 0) {
      data.certificates.forEach(cert => {
        container.innerHTML += `
          <div class="cert-card" oncontextmenu="return false;">
            <img src="${cert.image_path}" alt="${cert.title}" draggable="false" style="user-select:none;">
            <div class="cert-title">${cert.title}</div>
            <div class="cert-issuer">Issued by: ${cert.name_school}</div>
          </div>
        `;
      });
    } else {
      container.innerHTML = "<p>No certificates found.</p>";
    }
  } catch (err) {
    console.error("Error loading certificates:", err);
  }
}

window.addEventListener("DOMContentLoaded", loadCertificates);
