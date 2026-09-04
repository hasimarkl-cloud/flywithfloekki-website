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

// Leistungen klarer für Firmen, laufende Social-Media-Begleitung und Privatpersonen darstellen.
const serviceCards = document.querySelectorAll('#leistungen .card');
if (serviceCards.length >= 6) {
  const companyCard = serviceCards[0];
  const companyTitle = companyCard.querySelector('h3');
  const companyText = companyCard.querySelector('p');
  if (companyTitle) companyTitle.textContent = 'Firmenvideos, Werbung & Social Media';
  if (companyText) {
    companyText.textContent = 'Vom einzelnen Image-, Produkt- oder Standortvideo bis zur laufenden Content-Begleitung: Ich produziere Videos für Unternehmen, Firmengelände, Leistungen und Social Media – auf Wunsch auch als mehrmonatige Zusammenarbeit mit regelmäßigem Video-Content.';
  }

  const individualCard = serviceCards[5];
  const individualTitle = individualCard.querySelector('h3');
  const individualText = individualCard.querySelector('p');
  if (individualTitle) individualTitle.textContent = 'Individuelle Projekte & Komplettproduktion';
  if (individualText) {
    individualText.textContent = 'Auch für Privatpersonen: Auto, Motorrad, Photovoltaikanlage, Haus, Grundstück, Hobby oder eine ganz eigene Idee. Von Kamera und Drohne bis Schnitt, Musik, Farbkorrektur und Ton – individuell und komplett aus einer Hand.';
  }
}

const contactIntro = document.querySelector('#kontakt .contact-copy > p');
if (contactIntro) {
  contactIntro.textContent = 'Ob einzelnes privates Video, Firmenprojekt, Drohnenaufnahme oder laufender Social-Media-Content: Schreib mir kurz, was du planst, wo der Dreh stattfindet und welches Ergebnis du dir vorstellst. Ich melde mich anschließend bei dir.';
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

  const typeSelect = form.querySelector('select[name="type"]');
  if (typeSelect) {
    const existingValues = Array.from(typeSelect.options).map(option => option.textContent);
    const addOptionBeforeOther = (label) => {
      if (existingValues.includes(label)) return;
      const option = document.createElement('option');
      option.textContent = label;
      const otherOption = Array.from(typeSelect.options).find(item => item.textContent === 'Sonstiges');
      if (otherOption) {
        typeSelect.insertBefore(option, otherOption);
      } else {
        typeSelect.appendChild(option);
      }
      existingValues.push(label);
    };

    addOptionBeforeOther('Privates / individuelles Video');
    addOptionBeforeOther('Social-Media-Begleitung');
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
