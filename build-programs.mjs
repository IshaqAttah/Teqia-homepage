// Generates a page for every program in programs.data.json.
// Run with:  node build-programs.mjs
// Output:    programs/<slug>/index.html  and  programs/index.html
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const { levels, programs } = JSON.parse(readFileSync(join(root, "programs.data.json"), "utf8"));
const ASSET_VERSION = "5";

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
    ? `        <ol class="module-list">
${program.modules
  .map(
    (module, index) => `          <li class="module">
            <span class="module-step" aria-hidden="true">${index + 1}</span>
            <div>
              <p class="module-weeks">${escape(module.weeks)}</p>
              <h3>${escape(module.title)}</h3>
              <p>${escape(module.description)}</p>
              <p class="module-deliverable">You finish with: ${escape(module.deliverable)}</p>
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
    ["Level", level.label],
    ["How long", program.duration ?? "To be confirmed"],
    ["Certification", program.certification ?? "Portfolio projects"],
    ["Cost to you", "Free, always"],
  ];

  return `${head(program.title, program.summary)}
    <main id="main">
      <section class="container program-hero">
        <a class="back-link" href="/#programs">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          All programs
        </a>

        <p class="program-tags">
          <span class="card-level card-level-${program.level}">${escape(level.label)}</span>
          <span class="program-track">${escape(program.track)}</span>
        </p>
        <h1>${escape(program.title)}</h1>
        <p class="lead">${escape(program.description)}</p>

        <div class="button-row">
          <a class="btn btn-primary" href="/become-a-beneficiary">Apply to learn this</a>
          <a class="btn btn-outline-primary" href="/donate">Fund this program</a>
        </div>
      </section>

      <section class="band section-tight" aria-label="Key facts">
        <div class="container">
          <ul class="facts">
${facts
  .map(([label, value]) => `            <li><span>${escape(label)}</span><strong>${escape(value)}</strong></li>`)
  .join("\n")}
          </ul>
        </div>
      </section>

      <section class="container section program-body">
        <h2 class="section-title">Who this is for</h2>
        <p class="section-lead">${escape(level.who)}</p>

        <h2 class="section-title section-title-spaced">What you will learn</h2>
        <ul class="skill-list">
${program.skills.map((skill) => `          <li>${escape(skill)}</li>`).join("\n")}
        </ul>

        <h2 class="section-title section-title-spaced">What we cover</h2>
${modulesBlock(program)}

        <h2 class="section-title section-title-spaced">What you need</h2>
        <p class="section-lead">
          Time to study each week, and a laptop if you have one. If you do not have a
          laptop or steady internet, say so on your application. It will not count
          against you, and we will tell you what support we can offer.
        </p>
      </section>

      ${
        next
          ? `<section class="container section program-body">
        <h2 class="section-title">Where this leads</h2>
        <a class="next-card" href="/programs/${next.slug}/">
          <span class="card-level card-level-${next.level}">${escape(levels[next.level].label)}</span>
          <span>
            <strong>${escape(next.title)}</strong>
            <span>${escape(next.summary)}</span>
          </span>
          <span class="next-arrow" aria-hidden="true">→</span>
        </a>
      </section>`
          : ""
      }

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
