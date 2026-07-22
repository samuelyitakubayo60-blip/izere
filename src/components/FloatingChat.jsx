import { createContext, useContext, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import ChatWidget from './ChatWidget';
import { useLanguage } from '../contexts/LanguageContext';

const ChatUIContext = createContext(null);

export function ChatUIProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  const openChat = useCallback(() => setIsOpen(true), []);
  const closeChat = useCallback(() => setIsOpen(false), []);
  const toggleChat = useCallback(() => setIsOpen((o) => !o), []);

  const hideFab = location.pathname === '/chat';

  return (
    <ChatUIContext.Provider value={{ isOpen, openChat, closeChat, toggleChat }}>
      {children}

      {!hideFab && (
        <>
          {isOpen && (
            <div
              className="fixed inset-0 bg-black/20 z-40 sm:hidden"
              onClick={closeChat}
              aria-hidden="true"
            />
          )}

          <div
            className={`fixed z-50 flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 ease-out
              bottom-24 right-4 w-[calc(100vw-2rem)] max-w-md
              sm:bottom-28 sm:right-6
              ${isOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none h-0'}
            `}
            style={{ height: isOpen ? 'min(520px, calc(100vh - 8rem))' : 0 }}
            role="dialog"
            aria-label={t('chat.title')}
            aria-hidden={!isOpen}
          >
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white shrink-0">
              <div>
                <p className="font-semibold text-sm">{t('chat.title')}</p>
                <p className="text-xs text-white/80">{t('chat.privacyNote').replace('🔒 ', '')}</p>
              </div>
              <button
                type="button"
                onClick={closeChat}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Close chat"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
              <ChatWidget compact onClose={closeChat} />
            </div>
          </div>

          <button
            type="button"
            onClick={toggleChat}
            className={`fixed bottom-6 right-4 sm:right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-200
              ${isOpen ? 'bg-gray-700 hover:bg-gray-800 rotate-0' : 'bg-gradient-to-br from-pink-500 to-red-600 hover:from-pink-600 hover:to-red-700 hover:scale-105'}
            `}
            aria-label={isOpen ? 'Close chat' : t('nav.askPrivately')}
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            ) : (
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            )}
          </button>
        </>
      )}
    </ChatUIContext.Provider>
  );
}

export function useChatUI() {
  const ctx = useContext(ChatUIContext);
  if (!ctx) throw new Error('useChatUI must be used within ChatUIProvider');
  return ctx;
}
