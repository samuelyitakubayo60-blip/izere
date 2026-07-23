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
