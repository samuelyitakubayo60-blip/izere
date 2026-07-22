import api from './api';

export const transcribeAudio = async (audioBlob, language = 'rw') => {
  const formData = new FormData();
  formData.append('file', audioBlob, 'recording.webm');

  const response = await api.post(`/api/voice/transcribe?language=${language}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const synthesizeSpeech = async (text, language = 'rw') => {
  const response = await api.post(
    '/api/voice/synthesize',
    { text, language },
    { responseType: 'blob' },
  );
  return response.data;
};
