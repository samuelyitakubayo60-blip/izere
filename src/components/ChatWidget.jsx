import { useState, useEffect, useRef, useCallback } from 'react';
import { sendMessage } from '../services/chatService';
import { transcribeAudio, synthesizeSpeech } from '../services/voiceService';
import { useLanguage } from '../contexts/LanguageContext';
import {
  speakWithBrowser,
  pauseBrowserSpeech,
  resumeBrowserSpeech,
  stopBrowserSpeech,
} from '../utils/browserSpeech';
import {
  getAnonymousId,
  getStoredSessionId,
  storeSessionId,
  clearChatSession,
} from '../utils/anonymousSession';
import Icon from './Icon';

/** idle → recording ↔ paused */
const REC_IDLE = 'idle';
const REC_RECORDING = 'recording';
const REC_PAUSED = 'paused';

export default function ChatWidget({ compact = false, dark = false }) {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState(() => getStoredSessionId());
  const [isLoading, setIsLoading] = useState(false);
  const [recState, setRecState] = useState(REC_IDLE);
  const [voiceBusy, setVoiceBusy] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const [playingId, setPlayingId] = useState(null);
  const [playbackPaused, setPlaybackPaused] = useState(false);
  const [useBrowserTts, setUseBrowserTts] = useState(false);

  const messagesEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const audioRef = useRef(null);
  const audioUrlRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    return () => {
      stopPlayback();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const stopPlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    stopBrowserSpeech();
    setPlayingId(null);
    setPlaybackPaused(false);
    setUseBrowserTts(false);
  }, []);

  const submitText = async (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setVoiceError('');
    setMessages((prev) => [...prev, { role: 'user', content: trimmed, language }]);
    setIsLoading(true);

    try {
      const response = await sendMessage({
        message: trimmed,
        language: 'auto',
        session_id: sessionId,
        anonymous_id: getAnonymousId(),
      });

      setSessionId(response.session_id);
      storeSessionId(response.session_id);

      const assistantMsg = {
        id: Date.now(),
        role: 'assistant',
        content: response.response,
        language: response.detected_language || response.language,
        needsMedical: response.needs_medical_attention,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: t('chat.error'), language },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const text = input.trim();
    setInput('');
    await submitText(text);
  };

  const finishRecording = async () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === 'inactive') {
      setRecState(REC_IDLE);
      return;
    }
    recorder.stop();
  };

  const processRecording = async () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
    chunksRef.current = [];
    setRecState(REC_IDLE);

    if (blob.size < 1000) {
      setVoiceError(t('chat.voiceTooShort'));
      return;
    }

    setVoiceBusy(true);
    setVoiceError('');
    try {
      const { text } = await transcribeAudio(blob, language);
      if (text?.trim()) {
        setInput(text);
        await submitText(text);
      } else {
        setVoiceError(t('chat.voiceNoText'));
      }
    } catch (err) {
      console.error('Transcription failed:', err);
      setVoiceError(t('chat.voiceTranscribeFailed'));
    } finally {
      setVoiceBusy(false);
    }
  };

  const startRecording = async () => {
    setVoiceError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream, { mimeType: getSupportedMimeType() });
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => processRecording();

      mediaRecorderRef.current = recorder;
      recorder.start(250);
      setRecState(REC_RECORDING);
    } catch (err) {
      console.error('Microphone error:', err);
      setVoiceError(t('chat.micDenied'));
    }
  };

  const toggleRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (recState === REC_IDLE) {
      startRecording();
      return;
    }
    if (recState === REC_RECORDING && recorder?.state === 'recording') {
      recorder.pause();
      setRecState(REC_PAUSED);
      return;
    }
    if (recState === REC_PAUSED && recorder?.state === 'paused') {
      recorder.resume();
      setRecState(REC_RECORDING);
    }
  };

  const togglePlayback = async (messageId, text, msgLanguage) => {
    const lang = msgLanguage || language;

    if (playingId === messageId) {
      if (useBrowserTts) {
        if (playbackPaused) {
          resumeBrowserSpeech();
          setPlaybackPaused(false);
        } else if (pauseBrowserSpeech()) {
          setPlaybackPaused(true);
        } else {
          stopPlayback();
        }
        return;
      }
      if (audioRef.current) {
        if (audioRef.current.paused) {
          await audioRef.current.play();
          setPlaybackPaused(false);
        } else {
          audioRef.current.pause();
          setPlaybackPaused(true);
        }
        return;
      }
    }

    stopPlayback();
    setVoiceBusy(true);
    setVoiceError('');

    try {
      const blob = await synthesizeSpeech(text, lang);
      const url = URL.createObjectURL(blob);
      audioUrlRef.current = url;
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => stopPlayback();
      audio.onerror = () => {
        stopPlayback();
        setVoiceError(t('chat.voicePlayFailed'));
      };
      await audio.play();
      setPlayingId(messageId);
      setPlaybackPaused(false);
      setUseBrowserTts(false);
    } catch (err) {
      console.warn('HF TTS failed, using browser speech:', err);
      try {
        setPlayingId(messageId);
        setUseBrowserTts(true);
        setPlaybackPaused(false);
        await speakWithBrowser(text, lang);
        stopPlayback();
      } catch (browserErr) {
        console.error('Browser TTS failed:', browserErr);
        setVoiceError(t('chat.voicePlayFailed'));
        stopPlayback();
      }
    } finally {
      setVoiceBusy(false);
    }
  };

  const handleNewChat = () => {
    stopPlayback();
    if (recState !== REC_IDLE) finishRecording();
    clearChatSession();
    setSessionId(null);
    setMessages([]);
    setVoiceError('');
  };

  const messageHeight = compact ? 'flex-1 min-h-[240px]' : 'h-[500px]';
  const isRecActive = recState !== REC_IDLE;
  const embedded = compact && dark;

  return (
    <div className={compact ? 'flex flex-col h-full bg-transparent' : ''}>
      {!embedded && (
        <div className={`${compact ? 'px-4 pt-4 pb-2' : 'bg-white rounded-lg shadow-md p-6 mb-6'}`}>
          {!compact && (
            <>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('chat.title')}</h1>
              <p className="text-gray-600 mb-2">{t('chat.subtitle')}</p>
            </>
          )}
          <p className={`text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 ${compact ? 'mb-2' : 'mb-4'}`}>
            {t('chat.privacyNote')}
          </p>
          <p className="text-xs text-gray-500 mb-2">{t('chat.autoLangNote')}</p>
          {voiceError && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-2">{voiceError}</p>
          )}
          {messages.length > 0 && (
            <button type="button" onClick={handleNewChat} className="text-sm text-red-600 hover:text-red-800 underline">
              {t('chat.newChat')}
            </button>
          )}
        </div>
      )}

      {embedded && voiceError && (
        <p className="text-xs text-red-400 px-4 py-2">{voiceError}</p>
      )}

      <div
        className={
          embedded
            ? `cb-messages flex-1 ${messageHeight}`
            : `${compact ? 'flex-1 mx-4 bg-gray-50 rounded-lg border border-gray-200' : 'bg-white rounded-lg shadow-md'} p-4 mb-4 ${messageHeight} overflow-y-auto`
        }
      >
        {messages.length === 0 ? (
          <div className={`text-center py-12 ${embedded ? 'text-gray-400' : 'text-gray-500'}`}>
            <Icon name="comments" style={{ fontSize: '2rem', marginBottom: '0.75rem', color: 'var(--primary)' }} />
            <p className="text-lg font-medium">{t('chat.emptyTitle')}</p>
            <p className="text-sm mt-2 px-4">{t('chat.emptyHint')}</p>
          </div>
        ) : (
          <div className={embedded ? 'flex flex-col gap-3' : 'space-y-3'}>
            {messages.map((message, index) => {
              const msgId = message.id ?? index;
              const isPlaying = playingId === msgId;
              return (
                <div key={msgId} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={
                      embedded
                        ? `cb-msg ${message.role === 'user' ? 'user' : 'bot'}`
                        : `max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${message.role === 'user' ? 'bg-red-600 text-white' : 'bg-white text-gray-800 shadow-sm border border-gray-100'}`
                    }
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    {message.role === 'assistant' && (
                      <button
                        type="button"
                        onClick={() => togglePlayback(msgId, message.content, message.language)}
                        disabled={voiceBusy && !isPlaying}
                        className={`mt-2 text-xs flex items-center gap-1 font-medium ${embedded ? 'text-primary-custom' : 'text-red-600 hover:text-red-800'}`}
                      >
                        <Icon name={isPlaying && !playbackPaused ? 'pause' : isPlaying ? 'play' : 'volume-up'} />
                        {isPlaying && !playbackPaused ? t('chat.pauseListen') : isPlaying ? t('chat.resumeListen') : t('chat.listen')}
                      </button>
                    )}
                    {message.needsMedical && (
                      <p className={`mt-2 text-xs font-medium ${embedded ? 'text-yellow-400' : 'text-orange-700'}`}>{t('chat.medicalWarning')}</p>
                    )}
                  </div>
                </div>
              );
            })}
            {isLoading && (
              <div className="flex justify-start">
                <div className={embedded ? 'cb-msg bot' : 'bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100'}>
                  <div className="pmsg-typing">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {embedded && messages.length > 0 && (
        <div className="px-4 pb-2">
          <button type="button" onClick={handleNewChat} className="text-xs text-primary-custom hover:underline">
            {t('chat.newChat')}
          </button>
        </div>
      )}

      <form
        onSubmit={handleSendMessage}
        className={embedded ? 'cb-input-row mx-0 rounded-none border-t border-[var(--border)]' : compact ? 'p-4 pt-0 border-t border-gray-100 bg-white' : 'bg-white rounded-lg shadow-md p-6'}
      >
        {isRecActive && (
          <p className="text-xs text-red-600 mb-2 font-medium">
            {recState === REC_RECORDING ? t('chat.recordingActive') : t('chat.recordingPaused')}
          </p>
        )}
        <div className="flex gap-2 items-center">
          <button
            type="button"
            onClick={toggleRecording}
            disabled={isLoading || voiceBusy}
            className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              recState === REC_RECORDING
                ? 'bg-red-600 text-white animate-pulse'
                : recState === REC_PAUSED
                  ? 'bg-amber-500 text-white'
                  : embedded
                    ? 'bg-[var(--bg-glass)] text-[var(--text-primary)] border border-[var(--border)]'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title={
              recState === REC_IDLE
                ? t('chat.startRecording')
                : recState === REC_RECORDING
                  ? t('chat.pauseRecording')
                  : t('chat.resumeRecording')
            }
          >
            <Icon name={recState === REC_PAUSED ? 'pause' : 'microphone'} />
          </button>

          {isRecActive && (
            <button
              type="button"
              onClick={finishRecording}
              disabled={voiceBusy}
              className="shrink-0 w-10 h-10 rounded-full bg-green-600 text-white hover:bg-green-700 flex items-center justify-center"
              title={t('chat.sendVoice')}
            >
              <Icon name="check" />
            </button>
          )}

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('chat.placeholder')}
            className={embedded ? 'cb-input' : 'flex-1 border border-gray-300 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500'}
            disabled={isLoading || isRecActive}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim() || isRecActive}
            className={
              embedded
                ? 'cb-send'
                : 'bg-red-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shrink-0'
            }
          >
            {isLoading ? '…' : embedded ? <Icon name="paper-plane" /> : t('chat.send')}
          </button>
        </div>
      </form>

      {!compact && (
        <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
          <p className="text-yellow-800 text-sm">
            <strong>{t('common.disclaimer')}:</strong> {t('chat.disclaimer')}
          </p>
        </div>
      )}
    </div>
  );
}

function getSupportedMimeType() {
  const types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'];
  return types.find((t) => MediaRecorder.isTypeSupported(t)) || '';
}
