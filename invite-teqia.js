import { post, wire } from './teqia-api.js';

const form = document.getElementById('invite-form');
const status = document.getElementById('form-status');

if (form && status) {
  wire(form, status, async (data) => {
    const topics = data.getAll('topics').map(String);
    if (topics.length === 0) {
      throw new Error('Choose at least one thing you would like Teqia to talk about.');
    }

    const asked = await post('/outreach/requests', {
      organisation: String(data.get('organisation') || ''),
      state: String(data.get('state') || ''),
      lga: String(data.get('lga') || ''),
      audience: String(data.get('audience') || ''),
      audienceSize: Number(data.get('audienceSize') || 0),
      topics,
      preferredDates: String(data.get('preferredDates') || ''),
      message: String(data.get('message') || ''),
      requesterName: String(data.get('requesterName') || ''),
      requesterRole: String(data.get('requesterRole') || ''),
      email: String(data.get('email') || ''),
      phone: String(data.get('phone') || ''),
    });

    return `Thank you. Your reference is ${asked.reference}. Teqia will write back to the address you gave, either way, so please do not hold a date until you hear.`;
  });
}
