import api from './api';

export const getEducationalContent = async (category = null) => {
  const params = category ? { category } : {};
  const response = await api.get('/api/content/', { params });
  return response.data;
};

export const getContentById = async (contentId) => {
  const response = await api.get(`/api/content/${contentId}`);
  return response.data;
};

export const getContentByCategory = async (category) => {
  const response = await api.get(`/api/content/category/${category}`);
  return response.data;
};
