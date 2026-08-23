const CONTACT_EMAIL = "flywithfloekki@gmail.com";
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xaewpjwk";

// Einsatzgebiet klar kommunizieren – sichtbar auf der Seite und in den wichtigsten Meta-Angaben.
const metaDescription = document.querySelector('meta[name="description"]');
if (metaDescription) {
  metaDescription.setAttribute('content', 'Flywithfloekki – Videograf und Videoproduktion für Firmen, Events, Medien, Hochzeiten sowie Drohnen- und FPV-Aufnahmen in ganz Tirol, Vorarlberg und Südtirol.');
}
const ogDescription = document.querySelector('meta[property="og:description"]');
if (ogDescription) {
  ogDescription.setAttribute('content', 'Videoproduktion für Firmen, Events, Hochzeiten sowie Drohnen- und FPV-Aufnahmen in ganz Tirol, Vorarlberg und Südtirol.');
}

const heroEyebrow = document.querySelector('.hero .eyebrow');
if (heroEyebrow) {
  heroEyebrow.textContent = 'Videograf & Videoproduktion · ganz Tirol · Vorarlberg · Südtirol';
}
const heroCopy = document.querySelector('.hero-copy');
if (heroCopy) {
  heroCopy.textContent = 'Professionelle Videoproduktion für Firmen, Events, Medien und besondere Momente – in ganz Tirol, Vorarlberg und Südtirol, von klassischer Kamera bis Drohne & FPV.';
}
const introRegion = document.querySelector('#intro .intro-grid > div p:nth-of-type(2)');
if (introRegion) {
  introRegion.innerHTML = 'Mit Sitz in <strong>Schönwies im Tiroler Oberland</strong> bin ich für Produktionen in Landeck und Imst genauso unterwegs wie in <strong>ganz Tirol, Vorarlberg und Südtirol</strong> – von der ersten Aufnahme bis zum fertigen Video.';
}

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

// Datenschutzfreundliches Zwei-Klick-System für externe Videos.
// Erst nach einem bewussten Klick wird eine Verbindung zu YouTube, Vimeo oder Instagram aufgebaut.
document.querySelectorAll('.media-consent').forEach((gate) => {
  const loadButton = gate.querySelector('.media-load-button');
  if (!loadButton) return;

  loadButton.addEventListener('click', () => {
    const src = gate.dataset.src;
    const title = gate.dataset.title || 'Externes Video';
    const provider = gate.dataset.provider || '';

    if (!src) return;

    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.title = title;
    iframe.loading = 'lazy';
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');

    if (provider === 'youtube') {
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
    } else if (provider === 'vimeo') {
      iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
    } else if (provider === 'instagram') {
      iframe.setAttribute('allow', 'encrypted-media; picture-in-picture; web-share');
      iframe.setAttribute('allowtransparency', 'true');
    }

    const frame = gate.closest('.video-frame');
    if (frame) {
      frame.innerHTML = '';
      frame.appendChild(iframe);
    }
  });
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
