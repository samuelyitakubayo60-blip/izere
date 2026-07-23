import api from './api';

export const fetchTranslationBundle = async () => {
  const { data } = await api.get('/api/translations/bundle');
  return data;
};
