function showCV(country) {
  document.querySelectorAll('.cv-template').forEach(cv => cv.style.display = 'none');
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  document.getElementById(country).style.display = 'block';
  event.target.classList.add('active');
}
