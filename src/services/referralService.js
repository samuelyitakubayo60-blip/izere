import api from './api';

export const getReferralMeta = async () => {
  const { data } = await api.get('/api/referrals/meta');
  return data;
};

export const listReferralLocations = async (params = {}) => {
  const { data } = await api.get('/api/referrals/locations', { params });
  return data.names || [];
};

export const resolveReferralLocation = async (params) => {
  const { data } = await api.get('/api/referrals/locations/resolve', { params });
  return data;
};

export const searchFacilities = async (params) => {
  const { data } = await api.get('/api/referrals/facilities', { params });
  return data;
};

export const requestReferral = async (payload) => {
  const { data } = await api.post('/api/referrals/request', payload);
  return data;
};

export const lookupReferral = async (code) => {
  const { data } = await api.get(`/api/referrals/lookup/${encodeURIComponent(code)}`);
  return data;
};

export const applyAsPartner = async (payload) => {
  const { data } = await api.post('/api/referrals/partners/apply', payload);
  return data;
};

export const adminListFacilities = async () => {
  const { data } = await api.get('/api/referrals/admin/facilities');
  return data;
};

export const adminSaveFacility = async (payload, id) => {
  if (id) {
    const { data } = await api.put(`/api/referrals/admin/facilities/${id}`, payload);
    return data;
  }
  const { data } = await api.post('/api/referrals/admin/facilities', payload);
  return data;
};

export const adminDeleteFacility = async (id) => {
  await api.delete(`/api/referrals/admin/facilities/${id}`);
};

export const adminListApplications = async () => {
  const { data } = await api.get('/api/referrals/admin/applications');
  return data;
};

export const adminDecideApplication = async (id, { approve = true, as_partner = false } = {}) => {
  const { data } = await api.post(`/api/referrals/admin/applications/${id}/decide`, null, {
    params: { approve, as_partner },
  });
  return data;
};

export const adminListReferrals = async () => {
  const { data } = await api.get('/api/referrals/admin/referrals');
  return data;
};
