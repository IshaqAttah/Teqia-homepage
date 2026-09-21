// Generates a page for every program in programs.data.json.
// Run with:  node build-programs.mjs
// Output:    programs/<slug>/index.html  and  programs/index.html
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const { levels, programs } = JSON.parse(readFileSync(join(root, "programs.data.json"), "utf8"));
const ASSET_VERSION = "5";

const ICONS = {
  monitor: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="4" width="19" height="13" rx="2" fill="currentColor"/><path d="M9 20.5h6M12 17.5v3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" fill="none"/></svg>',
  globe: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3.5 9.5h17M3.5 14.5h17M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  file: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h7.5L19 8.5V21H6V3Z" fill="currentColor"/><path d="M9 12.5h7M9 16h5" stroke="#e5e9ef" stroke-width="1.8" stroke-linecap="round" fill="none"/></svg>',
  keyboard: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 8.5 5.5 12 9 15.5M15 8.5 18.5 12 15 15.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/></svg>',
  code: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 7l-5 5 5 5M16 7l5 5-5 5M13.5 4.5l-3 15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  shield: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5 4.5 5.5v6c0 4.6 3.2 8.8 7.5 10 4.3-1.2 7.5-5.4 7.5-10v-6L12 2.5Z" fill="currentColor"/></svg>',
  chart: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="12" width="4" height="8" rx="1" fill="currentColor"/><rect x="10" y="8" width="4" height="12" rx="1" fill="currentColor"/><rect x="16" y="4" width="4" height="16" rx="1" fill="currentColor"/></svg>',
  cloud: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 18.5a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18 9.5a4.5 4.5 0 0 1-.5 9H7Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  terminal: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2.5" fill="currentColor"/><path d="M7.5 9.5 10 12l-2.5 2.5M12.5 15h4" stroke="#e5e9ef" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
  sparkle: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 3.5l1.6 4.4a3 3 0 0 0 1.8 1.8l4.4 1.6-4.4 1.6a3 3 0 0 0-1.8 1.8L10 19l-1.6-4.3a3 3 0 0 0-1.8-1.8L2.2 11.3l4.4-1.6a3 3 0 0 0 1.8-1.8L10 3.5Z" fill="currentColor"/></svg>',
};

const CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 12.5l2 2 4-4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';

const escape = (value) =>
  String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const head = (title, description) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escape(title)} – Teqia</title>
    <meta name="description" content="${escape(description)}" />
    <link rel="icon" type="image/png" href="/assets/favicon.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@600;700&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="/styles.css?v=${ASSET_VERSION}" />
    <script>
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        document.documentElement.classList.add("reveal-ready");
      }
    </script>
  </head>
  <body>
    <a class="skip-link" href="#main">Skip to content</a>

    <header class="site-header">
      <div class="container header-inner">
        <a class="brand" href="/" aria-label="Teqia home">
          <img src="/assets/teqia-logo.png" alt="" width="53" height="24" />
          <span>Teqia</span>
        </a>

        <nav class="nav-links" aria-label="Primary">
          <a href="/#programs">Programs</a>
          <a href="/#impact">Impact</a>
          <a href="/about.html">About</a>
          <a href="/contact.html">Contact</a>
        </nav>

        <div class="header-actions">
          <a class="link-quiet" href="/login">Log In</a>
          <a class="btn btn-outline-primary btn-sm" href="/become-a-beneficiary">Apply to Learn</a>
          <a class="btn btn-primary btn-sm" href="/donate">Donate</a>
        </div>

        <button
          class="menu-toggle"
          type="button"
          aria-expanded="false"
          aria-controls="mobile-menu"
          aria-label="Open menu"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
        </button>
      </div>

      <div class="mobile-menu container" id="mobile-menu" hidden>
        <a href="/#programs">Programs</a>
        <a href="/#impact">Impact</a>
        <a href="/about.html">About</a>
        <a href="/contact.html">Contact</a>
        <div class="mobile-menu-actions">
          <a class="btn btn-outline-primary" href="/login">Log In</a>
          <a class="btn btn-primary" href="/become-a-beneficiary">Apply to Learn</a>
          <a class="btn btn-outline-primary" href="/donate">Donate</a>
        </div>
      </div>
    </header>
`;

const foot = `
    <footer class="site-footer">
      <div class="container footer-grid">
        <div class="footer-brand">
          <a class="brand" href="/" aria-label="Teqia home">
            <img src="/assets/teqia-logo.png" alt="" width="53" height="24" />
            <span>Teqia</span>
          </a>
          <p>© <span data-year>2026</span> Teqia. Empowering Africa's digital future.</p>
        </div>
        <nav class="footer-col" aria-label="Explore">
          <h4>Explore</h4>
          <a href="/programs/">All programs</a>
          <a href="/#impact">Impact</a>
          <a href="/become-a-beneficiary">Apply to learn</a>
        </nav>
        <nav class="footer-col" aria-label="Company">
          <h4>Company</h4>
          <a href="/about.html">About</a>
          <a href="/contact.html">Contact</a>
        </nav>
        <nav class="footer-col footer-col-small" aria-label="Legal">
          <h4>Legal</h4>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
        </nav>
      </div>
    </footer>

    <script src="/main.js?v=${ASSET_VERSION}" defer></script>
  </body>
</html>
`;

const modulesBlock = (program) =>
  program.modules.length
    ? `        <ol class="timeline">
${program.modules
  .map(
    (module, index) => `          <li class="tl-item${module.capstone ? " tl-item-capstone" : ""}">
            <span class="tl-dot">${index + 1}</span>
            <div class="tl-body">
              <div class="tl-head">
                <h3>${index + 1}. ${escape(module.title)}${module.capstone ? ' <span class="tl-tag">Final project</span>' : ""}</h3>
                <span class="tl-weeks">${escape(module.weeks)}</span>
              </div>
              <p>${escape(module.description)}</p>
              <p class="tl-meta"><span>${CHECK} You finish with: ${escape(module.deliverable)}</span></p>
            </div>
          </li>`,
  )
  .join("\n")}
        </ol>`
    : `        <p class="note-plain">
          The week by week outline for this program is still being finalised with the
          programs team. The skills above are confirmed. Ask us for the detail and we
          will tell you where it stands.
        </p>`;

const page = (program) => {
  const level = levels[program.level];
  const next = program.next ? programs.find((item) => item.slug === program.next) : null;
  const facts = [
    ["How long", program.duration ?? "To be confirmed"],
    ["Level", level.label],
    ["Certification", program.certification ?? "Portfolio projects"],
    ["Cost to you", "Free, always"],
  ];

  return `${head(program.title, program.summary)}
    <main id="main">
      <div class="container program-page">
        <a class="back-link" href="/programs/">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          All programs
        </a>

        <section class="panel program-hero-panel">
          <div class="panel-row">
            <div>
              <p class="chip-row">
                <span class="pill pill-track">${ICONS[program.icon]} ${escape(program.track)}</span>
                <span class="pill pill-level-${program.level}">${escape(level.label)}</span>
                <span class="pill pill-free">Free for students</span>
              </p>
              <h1>${escape(program.title)}</h1>
              <p class="lead">${escape(program.description)}</p>
            </div>
            <div class="hero-actions">
              <a class="btn btn-primary" href="/become-a-beneficiary">Apply to learn this</a>
              <a class="btn btn-outline-primary" href="/donate">Fund this program</a>
            </div>
          </div>

          <ul class="fact-row">
${facts
  .map(([label, value]) => `            <li><span>${escape(label)}</span><strong>${escape(value)}</strong></li>`)
  .join("\n")}
          </ul>
        </section>

        <section class="panel">
          <h2 class="panel-title">Is this the right start for you?</h2>
          <p class="panel-lead">
            Every program has a level. Pick the one that matches where you are today,
            not where you wish you were.
          </p>
          <div class="split">
            <div class="mini-card">
              <h3>Who this is for</h3>
              <p>${escape(level.who)}</p>
            </div>
            <div class="mini-card">
              <h3>What you need</h3>
              <p>
                Time to study each week, and a laptop if you have one. If you do not
                have a laptop or steady internet, say so on your application. It will
                not count against you.
              </p>
            </div>
          </div>
        </section>

        <section class="panel">
          <h2 class="panel-title">What you will learn</h2>
          <p class="panel-lead">The skills you leave with, and use in the work you build.</p>
          <ul class="skill-list">
${program.skills.map((skill) => `            <li>${escape(skill)}</li>`).join("\n")}
          </ul>
        </section>

        <section class="panel">
          <h2 class="panel-title">Curriculum roadmap</h2>
          <p class="panel-lead">
            Every module is hands on, reviewed by a mentor, and finishes with something
            you can show.
          </p>
${modulesBlock(program)}
        </section>

        ${
          next
            ? `<section class="panel">
          <h2 class="panel-title">Where this leads</h2>
          <p class="panel-lead">Finish this one and you are ready for the next step.</p>
          <a class="next-card" href="/programs/${next.slug}/">
            <span class="pill pill-level-${next.level}">${escape(levels[next.level].label)}</span>
            <span>
              <strong>${escape(next.title)}</strong>
              <span>${escape(next.summary)}</span>
            </span>
            <span class="next-arrow" aria-hidden="true">&rarr;</span>
          </a>
        </section>`
            : ""
        }
      </div>

      <section class="cta">
        <div class="cta-inner">
          <h2>Ready to start?</h2>
          <p class="cta-lead">
            Teqia training is free. Tell us what you want to learn and where you are
            starting from, and we will take it from there.
          </p>
          <div class="button-row button-row-center">
            <a class="btn btn-light" href="/become-a-beneficiary">Apply to learn</a>
            <a class="btn btn-outline-light" href="/contact.html">Ask a question</a>
          </div>
        </div>
      </section>
    </main>
${foot}`;
};

const indexPage = () => {
  const groups = Object.entries(levels).map(([value, level]) => ({
    value,
    ...level,
    items: programs.filter((program) => program.level === value),
  }));

  return `${head("All Programs", "Every Teqia program, from your first time using a computer through to software engineering, cloud, cybersecurity and AI.")}
    <main id="main">
      <section class="container program-hero">
        <h1>All Programs</h1>
        <p class="lead">
          Start where you are. Every program is free, and each level prepares you for
          the next.
        </p>
      </section>

${groups
  .map(
    (group) => `      <section class="container section program-body">
        <h2 class="section-title">${escape(group.label)}</h2>
        <p class="section-lead">${escape(group.who)}</p>
        <div class="program-grid">
${group.items
  .map(
    (program) => `          <a class="card" href="/programs/${program.slug}/">
            <div class="card-top">
              <span class="card-level card-level-${program.level}">${escape(group.label)}</span>
            </div>
            <h3>${escape(program.title)}</h3>
            <p>${escape(program.summary)}</p>
            <span class="card-link">Learn More <span aria-hidden="true">→</span></span>
          </a>`,
  )
  .join("\n")}
        </div>
      </section>`,
  )
  .join("\n\n")}
    </main>
${foot}`;
};

for (const program of programs) {
  const dir = join(root, "programs", program.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), page(program));
}
mkdirSync(join(root, "programs"), { recursive: true });
writeFileSync(join(root, "programs", "index.html"), indexPage());

console.log(`Wrote ${programs.length} program pages and the index.`);
