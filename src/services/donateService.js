import api from './api';

export const getPublicDonationSettings = async () => {
  const { data } = await api.get('/api/donate');
  return data;
};
