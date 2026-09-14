// Mobile menu toggle
const toggle = document.querySelector('.menu-toggle');
const menu = document.getElementById('mobile-menu');

function setMenu(open) {
  menu.hidden = !open;
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}

toggle.addEventListener('click', () => setMenu(menu.hidden));
menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) setMenu(false); });

// Footer year
document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

// Programs slider
const track = document.getElementById('programs-track');

if (track) {
  const buttons = document.querySelectorAll('.slider-btn');

  // Scroll by one card width (plus gap)
  const step = () => {
    const card = track.querySelector('.card');
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return card ? card.offsetWidth + gap : track.clientWidth;
  };

  const slide = (dir) => track.scrollBy({ left: dir * step() });

  const updateButtons = () => {
    const max = track.scrollWidth - track.clientWidth - 1;
    buttons.forEach((btn) => {
      btn.disabled = btn.dataset.dir === '-1' ? track.scrollLeft <= 1 : track.scrollLeft >= max;
    });
  };

  buttons.forEach((btn) => btn.addEventListener('click', () => slide(Number(btn.dataset.dir))));
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      slide(e.key === 'ArrowRight' ? 1 : -1);
    }
  });
  track.addEventListener('scroll', updateButtons, { passive: true });
  window.addEventListener('resize', updateButtons);
  updateButtons();
}

// Contact form: no backend yet, so open the visitor's email app with the message pre-filled
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  const status = document.getElementById('form-status');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(contactForm);
    const name = data.get('name').trim();
    const reason = data.get('reason');
    const subject = `[Website] ${reason} – ${name}`;
    const body = `Name: ${name}\nEmail: ${data.get('email')}\nReason: ${reason}\n\n${data.get('message')}`;

    window.location.href = `mailto:info@teqia.org?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    status.textContent = "Your email app should open with your message ready to send. If it doesn't, email us directly at info@teqia.org.";
    status.hidden = false;
  });
}
