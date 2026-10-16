const CONTACT_EMAIL = "flywithfloekki@gmail.com";
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xaewpjwk";

const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const emailDisplay = document.getElementById('email-display');
if (CONTACT_EMAIL && emailDisplay) {
  emailDisplay.innerHTML = `<a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>`;
}

// Datenschutzfreundliches Zwei-Klick-System für externe Medien.
document.querySelectorAll('.media-consent').forEach((gate) => {
  const loadButton = gate.querySelector('.media-load-button');
  if (!loadButton) return;

  loadButton.addEventListener('click', () => {
    const src = gate.dataset.src;
    const title = gate.dataset.title || 'Externes Video';
    const provider = gate.dataset.provider || '';
    if (!src) return;

    const frame = gate.closest('.video-frame');
    if (!frame) return;

    // Instagram blockiert direkte /embed/-iframes in manchen Browsern.
    // Nach Zustimmung verwenden wir deshalb Instagrams offiziellen Embed-Code
    // und zeigen zusätzlich immer einen Direktlink als Fallback an.
    if (provider === 'instagram') {
      const permalink = src.replace(/\/embed\/?(?:\?.*)?$/, '/');

      frame.innerHTML = '';

      const wrap = document.createElement('div');
      wrap.className = 'instagram-embed-wrap';

      const blockquote = document.createElement('blockquote');
      blockquote.className = 'instagram-media';
      blockquote.setAttribute('data-instgrm-permalink', permalink);
      blockquote.setAttribute('data-instgrm-version', '14');

      const directLink = document.createElement('a');
      directLink.href = permalink;
      directLink.target = '_blank';
      directLink.rel = 'noopener noreferrer';
      directLink.className = 'media-consent-link';
      directLink.textContent = 'Reel direkt auf Instagram öffnen ↗';

      blockquote.appendChild(directLink);
      wrap.appendChild(blockquote);

      const fallback = document.createElement('p');
      fallback.className = 'instagram-fallback';
      const fallbackLink = directLink.cloneNode(true);
      fallback.append('Falls das Reel hier nicht geladen wird: ');
      fallback.appendChild(fallbackLink);
      wrap.appendChild(fallback);

      frame.appendChild(wrap);

      const processEmbeds = () => {
        if (window.instgrm && window.instgrm.Embeds) {
          window.instgrm.Embeds.process();
        }
      };

      const existingScript = document.querySelector('script[data-instagram-embed]');
      if (existingScript) {
        processEmbeds();
      } else {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.instagram.com/embed.js';
        script.setAttribute('data-instagram-embed', 'true');
        script.onload = processEmbeds;
        document.body.appendChild(script);
      }

      return;
    }

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
    }

    frame.innerHTML = '';
    frame.appendChild(iframe);
  });
});

const form = document.getElementById('project-form');
const note = document.getElementById('form-note');

if (form) {
  form.action = FORMSPREE_ENDPOINT;
  form.method = 'POST';

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

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
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Formspree konnte die Anfrage nicht verarbeiten.');
      }

      form.reset();
      if (note) {
        note.textContent = 'Vielen Dank! Deine Anfrage wurde erfolgreich gesendet. Ich melde mich so bald wie möglich.';
      }
    } catch (error) {
      if (note) {
        note.textContent = `Das Senden hat leider nicht funktioniert. Bitte schreib direkt an ${CONTACT_EMAIL}.`;
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    }
  });
}
