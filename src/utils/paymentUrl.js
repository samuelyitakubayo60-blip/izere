export function extractPaymentUrl(payload) {
  if (!payload) return '';
  if (typeof payload === 'string' && /^https?:\/\//i.test(payload.trim())) {
    return payload.trim();
  }
  const nested = payload.data && typeof payload.data === 'object' ? payload.data : {};
  const candidates = [
    payload.payment_url,
    payload.url,
    nested.payment_url,
    nested.url,
    nested.secured_url,
    nested.redirect_url,
    nested.iframe_url,
  ];
  const found = candidates.find((value) => typeof value === 'string' && /^https?:\/\//i.test(value.trim()));
  return found ? found.trim() : '';
}
