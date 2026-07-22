/**
 * Anonymous guest ID — no email, name, or login required.
 * Stored locally only; used to link chat messages on this device.
 */
export function getAnonymousId() {
  const key = 'izere_anonymous_id';
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export function getStoredSessionId() {
  const raw = localStorage.getItem('izere_chat_session_id');
  return raw ? parseInt(raw, 10) : null;
}

export function storeSessionId(sessionId) {
  localStorage.setItem('izere_chat_session_id', String(sessionId));
}

export function clearChatSession() {
  localStorage.removeItem('izere_chat_session_id');
}
