import api from './api';

export const createChatSession = async (sessionData) => {
  const response = await api.post('/api/chat/session', sessionData);
  return response.data;
};

export const getChatSession = async (sessionId) => {
  const response = await api.get(`/api/chat/session/${sessionId}`);
  return response.data;
};

export const getChatMessages = async (sessionId) => {
  const response = await api.get(`/api/chat/session/${sessionId}/messages`);
  return response.data;
};

export const sendMessage = async (messageData) => {
  const response = await api.post('/api/chat/message', messageData);
  return response.data;
};
