import api from './api';

export const getBlogPosts = async (category = null, publishedOnly = true) => {
  const params = { published_only: publishedOnly };
  if (category) params.category = category;
  const response = await api.get('/api/blog/', { params });
  return response.data;
};

export const getBlogPost = async (postId) => {
  const response = await api.get(`/api/blog/${postId}`);
  return response.data;
};
