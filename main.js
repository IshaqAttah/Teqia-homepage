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

  // Program level filter: novice, mid-level, advanced
  const levelFilters = document.querySelectorAll('[data-level-filter]');

  if (levelFilters.length) {
    const cards = [...track.querySelectorAll('.card')];
    const count = document.getElementById('programs-count');
    const labels = { all: 'programs', novice: 'novice programs', mid: 'mid-level programs', advanced: 'advanced programs' };

    const apply = (level) => {
      let shown = 0;
      cards.forEach((card) => {
        const match = level === 'all' || card.dataset.level === level;
        card.hidden = !match;
        if (match) shown += 1;
      });

      levelFilters.forEach((btn) => {
        const active = btn.dataset.levelFilter === level;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', String(active));
      });

      if (count) {
        count.textContent = `Showing ${shown} ${shown === 1 ? labels[level].replace(/s$/, '') : labels[level]}.`;
      }

      track.scrollTo({ left: 0 });
      updateButtons();
    };

    levelFilters.forEach((btn) => btn.addEventListener('click', () => apply(btn.dataset.levelFilter)));
    apply('all');
  }
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

// Coming soon (404): name the page the visitor was looking for
const soonTitle = document.getElementById('soon-title');

if (soonTitle) {
  const path = window.location.pathname.replace(/\/+$/, '').toLowerCase();
  const pages = [
    ['/login', 'Log In is coming soon.', 'Portals for donors, mentors, volunteers and beneficiaries are on the way.'],
    ['/register', 'Sign Up is coming soon.', 'Portals for donors, mentors, volunteers and beneficiaries are on the way.'],
    ['/donate', 'Online donations are coming soon.', "We're setting up a secure way to give online. Until then, contact us and we'll share how you can support Teqia today."],
    ['/become-a-beneficiary', 'Applications to learn are coming soon.', "We're building the application form now. Until it's ready, contact us and tell us what you want to learn and where you are starting from — no experience needed."],
    ['/register?role=beneficiary', 'Applications to learn are coming soon.', "We're building the application form now. Until it's ready, contact us and tell us what you want to learn."],
    ['/become-a-mentor', 'Mentor applications are coming soon.', "We'd love your expertise. Until the application form is ready, send us a message about your skills and availability."],
    ['/become-a-volunteer', 'Volunteer applications are coming soon.', 'Thank you for wanting to help. Until the application form is ready, send us a message and tell us how you would like to get involved.'],
    ['/programs/', 'Program details are coming soon.', "We're putting together full details for each of our programs. Contact us if you'd like to join or learn more now."],
    ['/privacy', 'Our Privacy Policy is coming soon.', "We're finalising our Privacy Policy. If you have questions about how we handle your information, contact us."],
    ['/terms', 'Our Terms of Service are coming soon.', "We're finalising our Terms of Service. If you have any questions in the meantime, contact us."],
  ];
  const match = pages.find(([prefix]) => path === prefix || (prefix.endsWith('/') && path.startsWith(prefix)));

  if (match) {
    soonTitle.textContent = match[1];
    document.getElementById('soon-text').textContent = match[2];
  }
}
