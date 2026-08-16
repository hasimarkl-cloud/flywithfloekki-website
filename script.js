const CONTACT_EMAIL = ""; // Hier später z.B. kontakt@flywithfloekki.at eintragen

const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
}

const emailDisplay = document.getElementById('email-display');
if (CONTACT_EMAIL && emailDisplay) emailDisplay.textContent = CONTACT_EMAIL;

// Kundenstimmen einheitlich anonymisieren
const testimonialFooters = document.querySelectorAll('.testimonial-card footer');
testimonialFooters.forEach((footer) => {
  if (footer.textContent.includes('Mathias')) {
    footer.textContent = '— Kundenfeedback';
  }
});

const form = document.getElementById('project-form');
const note = document.getElementById('form-note');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!CONTACT_EMAIL) {
      note.textContent = 'Die E-Mail-Adresse ist noch nicht hinterlegt. Sobald du sie mir gibst, aktiviere ich das Formular.';
      note.style.fontWeight = '700';
      return;
    }
    const data = new FormData(form);
    const subject = encodeURIComponent(`Projektanfrage – ${data.get('type')}`);
    const body = encodeURIComponent(`Name: ${data.get('name')}\nProjektart: ${data.get('type')}\nOrt: ${data.get('location')}\n\n${data.get('message')}`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  });
}
