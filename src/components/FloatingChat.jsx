import { createContext, useContext, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import ChatWidget from './ChatWidget';
import { useLanguage } from '../contexts/LanguageContext';
import Icon from './Icon';

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
        <div id="chatbot-fab" aria-label="IZERE Chat">
          <div
            id="chatbot-panel"
            className={isOpen ? 'open' : ''}
            role="dialog"
            aria-label={t('chat.title')}
            aria-modal="true"
            aria-hidden={!isOpen}
          >
            <div className="cb-header">
              <div className="cb-avatar">
                <Icon name="heartbeat" />
              </div>
              <div className="cb-header-info">
                <h4>{t('chat.title')}</h4>
                <span>
                  <span className="cb-status-dot" />
                  {t('chat.privacyNote')}
                </span>
              </div>
              <button type="button" className="cb-close" onClick={closeChat} aria-label="Close chat">
                <Icon name="times" />
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden flex flex-col" style={{ minHeight: '360px', maxHeight: '420px' }}>
              <ChatWidget compact onClose={closeChat} dark />
            </div>
          </div>

          <button
            type="button"
            className="fab-btn"
            onClick={toggleChat}
            aria-label={isOpen ? 'Close chat' : t('nav.chatNow')}
            aria-expanded={isOpen}
            aria-controls="chatbot-panel"
          >
            <Icon name={isOpen ? 'chevron-down' : 'comments'} />
          </button>
        </div>
      )}
    </ChatUIContext.Provider>
  );
}

export function useChatUI() {
  const ctx = useContext(ChatUIContext);
  if (!ctx) throw new Error('useChatUI must be used within ChatUIProvider');
  return ctx;
}
