import api from './api';

export const listKnowledge = async () => {
  const { data } = await api.get('/api/admin/knowledge');
  return data;
};

export const getKnowledge = async (id) => {
  const { data } = await api.get(`/api/admin/knowledge/${id}`);
  return data;
};

export const createKnowledge = async (payload) => {
  const { data } = await api.post('/api/admin/knowledge', payload);
  return data;
};

export const updateKnowledge = async (id, payload) => {
  const { data } = await api.put(`/api/admin/knowledge/${id}`, payload);
  return data;
};

export const deleteKnowledge = async (id) => {
  await api.delete(`/api/admin/knowledge/${id}`);
};

export const listTranslations = async (namespace) => {
  const params = namespace ? { namespace } : {};
  const { data } = await api.get('/api/admin/translations', { params });
  return data;
};

export const createTranslation = async (payload) => {
  const { data } = await api.post('/api/admin/translations', payload);
  return data;
};

export const updateTranslation = async (id, payload) => {
  const { data } = await api.put(`/api/admin/translations/${id}`, payload);
  return data;
};

export const bulkTranslations = async (items) => {
  const { data } = await api.post('/api/admin/translations/bulk', { items });
  return data;
};

export const importDefaultTranslations = async (overwrite = false) => {
  const { data } = await api.post('/api/admin/translations/import-defaults', null, {
    params: { overwrite },
  });
  return data;
};

export const upsertTranslationByPath = async (payload) => {
  const { data } = await api.put('/api/admin/translations/by-path', payload);
  return data;
};

export const listUsers = async () => {
  const { data } = await api.get('/api/admin/users');
  return data;
};

export const updateUserRole = async (id, role) => {
  const { data } = await api.patch(`/api/admin/users/${id}`, { role });
  return data;
};

export const getDonationSettingsAdmin = async () => {
  const { data } = await api.get('/api/admin/donations');
  return data;
};

export const updateDonationSettings = async (payload) => {
  const { data } = await api.put('/api/admin/donations', payload);
  return data;
};
