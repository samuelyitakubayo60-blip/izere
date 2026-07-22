import api from './api';

export const verifyFirebaseToken = async (idToken) => {
  const response = await api.post('/api/auth/verify', { id_token: idToken });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/api/auth/me');
  return response.data;
};
