import api from './api';

export async function submitContactForm(contactData) {
  const { data } = await api.post('/api/contact/submit', contactData);
  return data;
}
