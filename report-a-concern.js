import { post, wire } from './teqia-api.js';

const form = document.getElementById('concern-form');
const status = document.getElementById('form-status');

if (form && status) {
  wire(form, status, async (data) => {
    // The name and contact go only if they chose to give them. Anything left empty stays
    // empty: the API records nothing at all about a reporter who did not name themselves,
    // including their address, and that promise is only worth keeping if it is kept here.
    const reporter = String(data.get('reporter') || '').trim();
    const contact = String(data.get('contact') || '').trim();

    const sent = await post('/concerns', {
      category: String(data.get('category') || ''),
      detail: String(data.get('detail') || ''),
      about: String(data.get('about') || '').trim() || undefined,
      reporter: reporter || undefined,
      contact: contact || undefined,
    });

    return `Thank you for telling us. Your reference is ${sent.reference}. Write it down. This has reached Teqia's safeguarding lead, and nobody else can open it.`;
  });
}
