import api from './api';

export const listShopProducts = async (params = {}) => {
  const { data } = await api.get('/api/shop/products', { params });
  return data;
};

export const listLocationChildren = async (params = {}) => {
  const { data } = await api.get('/api/shop/locations', { params });
  return data.names || [];
};

export const getDeliveryQuote = async (method, province) => {
  const { data } = await api.get('/api/shop/delivery-quote', { params: { method, province } });
  return data;
};

export const placeShopOrder = async (payload) => {
  const { data } = await api.post('/api/shop/orders', payload);
  return data;
};

export const adminCreateShopProduct = async (payload) => {
  const { data } = await api.post('/api/shop/admin/products', payload);
  return data;
};

export const adminListShopProducts = async () => {
  const { data } = await api.get('/api/shop/admin/products');
  return data;
};

export const adminUpdateShopProduct = async (id, payload) => {
  const { data } = await api.patch(`/api/shop/admin/products/${id}`, payload);
  return data;
};

export const adminUploadShopProductImage = async (id, file) => {
  const body = new FormData();
  body.append('file', file);
  const { data } = await api.post(`/api/shop/admin/products/${id}/image`, body, {
    timeout: 60000,
  });
  return data;
};

export const adminDeleteShopProduct = async (id) => {
  const { data } = await api.delete(`/api/shop/admin/products/${id}`);
  return data;
};

export const adminListShopOrders = async () => {
  const { data } = await api.get('/api/shop/admin/orders');
  return data;
};

export const adminUpdateShopOrder = async (id, status) => {
  const { data } = await api.patch(`/api/shop/admin/orders/${id}`, { status });
  return data;
};
