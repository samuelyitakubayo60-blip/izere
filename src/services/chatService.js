import api from './api';
import { getAnonymousId } from '../utils/anonymousSession';

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

const CHAT_TIMEOUT_MS = 240000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isWaitPlaceholder(text) {
  const value = (text || '').toLowerCase();
  if (!value.trim()) return true;
  return (
    value.includes('irimo kwandika') ||
    value.includes('writing your answer') ||
    value.includes('keep this chat open') ||
    value.includes('ntuhagarike')
  );
}

function assistantAfterUser(rows, userText) {
  for (let i = rows.length - 1; i >= 0; i -= 1) {
    if (rows[i].role === 'user' && rows[i].content === userText) {
      const next = rows[i + 1];
      if (next?.role === 'assistant' && !isWaitPlaceholder(next.content)) return next;
      return null;
    }
  }
  return null;
}

export async function waitForAssistantReply(sessionId, userText) {
  const deadline = Date.now() + CHAT_TIMEOUT_MS;
  while (Date.now() < deadline) {
    await sleep(2500);
    const rows = await getChatMessages(sessionId);
    const found = assistantAfterUser(rows, userText);
    if (found?.content) {
      return {
        response: found.content,
        language: found.language,
        detected_language: found.language,
        session_id: sessionId,
        message_id: found.id,
        needs_medical_attention: false,
        model: null,
        provider: 'kakugo-local',
        grounded: true,
        escalated: false,
        pending: false,
      };
    }
  }
  const err = new Error('timeout');
  err.code = 'ECONNABORTED';
  throw err;
}

export const sendMessage = async (messageData) => {
  const response = await api.post('/api/chat/message', messageData, {
    timeout: 30000,
  });
  const data = response.data;
  const shouldWait =
    Boolean(data?.session_id && messageData.message) &&
    (data.pending || isWaitPlaceholder(data.response));
  if (shouldWait) {
    return waitForAssistantReply(data.session_id, messageData.message);
  }
  return data;
};

export const escalateChat = async (sessionId) => {
  const response = await api.post('/api/chat/escalate', {
    session_id: sessionId,
    anonymous_id: getAnonymousId(),
  });
  return response.data;
};
