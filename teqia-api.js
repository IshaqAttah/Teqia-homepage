// Talking to the Teqia API from the public site.
//
// This site is static files on GitHub Pages, so there is no server here to post to. Forms
// go straight to the API on another origin, which is why it is named in one place: when
// the address changes, it changes here and nowhere else.
//
// The API allows exactly the origins it is configured with and never a wildcard, so
// https://teqia.org has to be in ALLOWED_ORIGINS on the API for any of this to work.

const API = location.hostname === 'teqia.org' || location.hostname === 'www.teqia.org'
  ? 'https://api.teqia.org/api/v1'
  : 'http://localhost:8080/api/v1';

/** Where to tell somebody to go when the form cannot get through. */
export const TEQIA_PHONE = '+234 902 330 2308';
export const TEQIA_EMAIL = 'info@teqia.org';

/**
 * Sends a form to the API.
 *
 * Returns what came back, or throws with a sentence to show the person. Never a status
 * code and never "an error occurred": somebody who has just typed for five minutes needs
 * to know whether to try again or pick up the phone.
 */
export async function post(path, body) {
  let response;
  try {
    response = await fetch(`${API}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error(
      `Teqia could not be reached, and nothing was saved. Please call ${TEQIA_PHONE} or email ${TEQIA_EMAIL}.`
    );
  }

  let answer = null;
  try {
    answer = await response.json();
  } catch {
    answer = null;
  }

  if (!response.ok) {
    // The API names the field that is wrong. One complaint is more use than a list.
    const problem = answer && answer.error;
    const field = problem && problem.fields && Object.values(problem.fields)[0];
    throw new Error(
      field ||
        (problem && problem.message) ||
        `Teqia could not take this just now. Please call ${TEQIA_PHONE}.`
    );
  }
  return answer;
}

/**
 * A field no person ever fills in.
 *
 * A form on a public site is found by machines within days. They fill in everything they
 * can see, including this, which is hidden from anybody using the page and from anybody
 * using a screen reader. Anything that arrives with it filled in is not a person.
 */
export function addHoneypot(form) {
  const trap = document.createElement('input');
  trap.type = 'text';
  trap.name = 'website';
  trap.tabIndex = -1;
  trap.autocomplete = 'off';
  trap.setAttribute('aria-hidden', 'true');
  trap.style.cssText =
    'position:absolute;left:-9999px;width:1px;height:1px;opacity:0;pointer-events:none';
  form.appendChild(trap);
  return () => trap.value.trim() !== '';
}

/**
 * Wires a form up: honeypot, one submission at a time, and a message either way.
 *
 * `send` is given the form's values and returns what to say on success. Throwing shows the
 * message to the person, so a failure never looks like nothing happened.
 */
export function wire(form, statusEl, send) {
  const caughtABot = addHoneypot(form);
  const button = form.querySelector('button[type=submit]');
  const wording = button ? button.innerHTML : '';
  let busy = false;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (busy) return;

    statusEl.hidden = true;
    statusEl.classList.remove('form-status-error');

    // Quietly done: a bot told it failed simply tries again differently.
    if (caughtABot()) {
      statusEl.textContent = 'Thank you. Teqia has your message.';
      statusEl.hidden = false;
      form.reset();
      return;
    }

    busy = true;
    if (button) {
      button.disabled = true;
      button.textContent = 'Sending…';
    }

    try {
      statusEl.textContent = await send(new FormData(form));
      form.reset();
    } catch (problem) {
      statusEl.textContent = problem.message;
      statusEl.classList.add('form-status-error');
    } finally {
      statusEl.hidden = false;
      busy = false;
      if (button) {
        button.disabled = false;
        button.innerHTML = wording;
      }
    }
  });
}
