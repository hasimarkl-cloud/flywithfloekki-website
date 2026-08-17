const CONTACT_EMAIL = "flywithfloekki@gmail.com";
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xaewpjwk";

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
if (CONTACT_EMAIL && emailDisplay) {
  emailDisplay.innerHTML = `<a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>`;
}

// Kundenstimmen einheitlich anonymisieren
const testimonialFooters = document.querySelectorAll('.testimonial-card footer');
testimonialFooters.forEach((footer) => {
  footer.textContent = '— Kundenfeedback';
});

const form = document.getElementById('project-form');
const note = document.getElementById('form-note');

if (form) {
  form.action = FORMSPREE_ENDPOINT;
  form.method = 'POST';

  // E-Mail-Feld für Rückfragen ergänzen, falls es noch nicht im HTML vorhanden ist.
  if (!form.querySelector('input[name="email"]')) {
    const emailLabel = document.createElement('label');
    emailLabel.innerHTML = 'E-Mail<input type="email" name="email" required autocomplete="email" placeholder="Deine E-Mail-Adresse">';
    const firstLabel = form.querySelector('label');
    if (firstLabel) {
      firstLabel.insertAdjacentElement('afterend', emailLabel);
    } else {
      form.prepend(emailLabel);
    }
  }

  if (note) {
    note.textContent = 'Deine Anfrage wird direkt über dieses Formular gesendet.';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton ? submitButton.textContent : '';

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Wird gesendet …';
    }
    if (note) {
      note.textContent = 'Anfrage wird gesendet …';
      note.style.fontWeight = '700';
    }

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: new FormData(form),
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Formspree konnte die Anfrage nicht verarbeiten.');
      }

      form.reset();
      if (note) {
        note.textContent = 'Vielen Dank! Deine Anfrage wurde erfolgreich gesendet. Ich melde mich so bald wie möglich.';
        note.style.fontWeight = '700';
      }
    } catch (error) {
      if (note) {
        note.textContent = `Das Senden hat leider nicht funktioniert. Bitte schreib direkt an ${CONTACT_EMAIL}.`;
        note.style.fontWeight = '700';
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    }
  });
}
