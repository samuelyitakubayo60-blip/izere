import api from './api';

export const listCounselInbox = async (status) => {
  const params = status ? { status } : {};
  const { data } = await api.get('/api/counsel/inbox', { params });
  return data;
};

export const getCounselMessages = async (sessionId) => {
  const { data } = await api.get(`/api/counsel/sessions/${sessionId}/messages`);
  return data;
};

export const replyCounselSession = async (sessionId, content) => {
  const { data } = await api.post(`/api/counsel/sessions/${sessionId}/reply`, { content });
  return data;
};

export const closeCounselSession = async (sessionId) => {
  const { data } = await api.post(`/api/counsel/sessions/${sessionId}/close`);
  return data;
};
