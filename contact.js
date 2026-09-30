import { post, wire } from './teqia-api.js';

const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');

if (form && status) {
  wire(form, status, async (data) => {
    const written = await post('/enquiries', {
      name: String(data.get('name') || ''),
      email: String(data.get('email') || ''),
      reason: String(data.get('reason') || ''),
      message: String(data.get('message') || ''),
    });

    return `Thank you. Your reference is ${written.reference}, and Teqia will reply to the address you gave.`;
  });
}
