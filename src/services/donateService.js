import api from './api';

export const getPublicDonationSettings = async () => {
  const { data } = await api.get('/api/donate');
  return data;
};

export const initiateDonationPayment = async (payload) => {
  const { data } = await api.post('/api/donate/initiate', payload);
  return data;
};
