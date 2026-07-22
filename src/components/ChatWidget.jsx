import { useState, useEffect, useRef } from 'react';
import { sendMessage } from '../services/chatService';
import { useLanguage } from '../contexts/LanguageContext';
import {
  getAnonymousId,
  getStoredSessionId,
  storeSessionId,
  clearChatSession,
} from '../utils/anonymousSession';

export default function ChatWidget({ compact = false, onClose }) {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState(() => getStoredSessionId());
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const text = input.trim();
    setMessages((prev) => [...prev, { role: 'user', content: text, language }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessage({
        message: text,
        language,
        session_id: sessionId,
        anonymous_id: getAnonymousId(),
      });

      setSessionId(response.session_id);
      storeSessionId(response.session_id);

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: response.response,
          language: response.language,
          needsMedical: response.needs_medical_attention,
        },
      ]);
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

  const handleNewChat = () => {
    clearChatSession();
    setSessionId(null);
    setMessages([]);
  };

  const messageHeight = compact ? 'h-[320px]' : 'h-[500px]';

  return (
    <div className={compact ? 'flex flex-col h-full' : ''}>
      <div className={`${compact ? 'px-4 pt-4 pb-2' : 'bg-white rounded-lg shadow-md p-6 mb-6'}`}>
        {!compact && (
          <>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('chat.title')}</h1>
            <p className="text-gray-600 mb-2">{t('chat.subtitle')}</p>
          </>
        )}
        <p
          className={`text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 ${
            compact ? 'mb-2' : 'mb-4'
          }`}
        >
          {t('chat.privacyNote')}
        </p>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={handleNewChat}
            className="text-sm text-red-600 hover:text-red-800 underline"
          >
            {t('chat.newChat')}
          </button>
        )}
      </div>

      <div
        className={`${
          compact ? 'flex-1 mx-4 bg-gray-50 rounded-lg border border-gray-200' : 'bg-white rounded-lg shadow-md'
        } p-4 mb-4 ${messageHeight} overflow-y-auto`}
      >
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <div className="text-4xl mb-3">💬</div>
            <p className="text-lg font-medium">{t('chat.emptyTitle')}</p>
            <p className="text-sm mt-2 px-4">{t('chat.emptyHint')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                    message.role === 'user'
                      ? 'bg-red-600 text-white'
                      : 'bg-white text-gray-800 shadow-sm border border-gray-100'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.needsMedical && (
                    <p className="mt-2 text-xs font-medium text-orange-700">
                      {t('chat.medicalWarning')}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
                  <div className="flex space-x-1.5">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <form
        onSubmit={handleSendMessage}
        className={compact ? 'p-4 pt-0 border-t border-gray-100 bg-white' : 'bg-white rounded-lg shadow-md p-6'}
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('chat.placeholder')}
            className="flex-1 border border-gray-300 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-red-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shrink-0"
          >
            {isLoading ? '…' : t('chat.send')}
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
