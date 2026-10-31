import api from './api';

// Verify with the backend, which checks FuturaPay directly. Never trust URL status alone.
export const verifyPaymentStatus = async (customer_transaction_id) => {
  const { data } = await api.post('/api/payment/verify', { customer_transaction_id });
  return data;
};
