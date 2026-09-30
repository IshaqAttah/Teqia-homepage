import { post, wire, TEQIA_EMAIL } from './teqia-api.js';

const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');

/**
 * The old way, kept as a fallback.
 *
 * This form worked before it posted anywhere: it opened the visitor's own email client.
 * That is a poor way to send a message, because a machine with no mail client configured
 * does nothing at all and says nothing. It is still better than a dead end, so it is what
 * happens when the API cannot be reached rather than showing somebody a failure and
 * leaving them to work out what to do.
 */
function openTheirMailClient(data) {
  const name = String(data.get('name') || '').trim();
  const reason = String(data.get('reason') || '');
  const subject = `[Website] ${reason} - ${name}`;
  const body = [
    `Name: ${name}`,
    `Email: ${data.get('email')}`,
    '',
    String(data.get('message') || ''),
  ].join('\n');

  window.location.href =
    `mailto:${TEQIA_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

if (form && status) {
  wire(form, status, async (data) => {
    try {
      const written = await post('/enquiries', {
        name: String(data.get('name') || ''),
        email: String(data.get('email') || ''),
        reason: String(data.get('reason') || ''),
        message: String(data.get('message') || ''),
      });
      return `Thank you. Your reference is ${written.reference}, and Teqia will reply to the address you gave.`;
    } catch (problem) {
      // Anything the API actually answered is a complaint about what they typed, and they
      // should see it. Only a failure to reach it at all falls back.
      if (!/could not be reached/i.test(problem.message)) throw problem;

      openTheirMailClient(data);
      return `Teqia's website could not send this directly, so your email app should open with the message ready. If it does not, write to ${TEQIA_EMAIL}.`;
    }
  });
}
