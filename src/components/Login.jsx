import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useChatUI } from './FloatingChat';
import { fetchGoogleConfig } from '../services/authService';

const GSI_SRC = 'https://accounts.google.com/gsi/client';

function loadGsiScript() {
  if (document.querySelector(`script[src="${GSI_SRC}"]`)) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = GSI_SRC;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error('Failed to load Google sign-in'));
    document.head.appendChild(script);
  });
}

const Login = () => {
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);
  const buttonRef = useRef(null);
  const { login } = useAuth();
  const { t } = useLanguage();
  const { openChat } = useChatUI();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  useEffect(() => {
    let cancelled = false;

    const start = async () => {
      try {
        const config = await fetchGoogleConfig();
        const clientId = config.client_id || import.meta.env.VITE_GOOGLE_CLIENT_ID;
        if (!config.enabled && !clientId) {
          setError(t('login.googleError'));
          return;
        }
        await loadGsiScript();
        if (cancelled || !window.google?.accounts?.id || !buttonRef.current) return;

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response) => {
            if (!response?.credential) {
              setError(t('login.googleError'));
              return;
            }
            const result = await login(response.credential);
            if (!result.success) {
              setError(result.error || t('login.authError'));
              return;
            }
            if (result.user?.role === 'admin') {
              navigate('/admin', { replace: true });
            } else {
              navigate(from, { replace: true });
            }
          },
        });

        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: 'outline',
          size: 'large',
          width: 320,
          text: 'continue_with',
        });
        setReady(true);
      } catch (err) {
        console.error('Google sign-in setup error:', err);
        if (!cancelled) setError(t('login.googleError'));
      }
    };

    start();
    return () => {
      cancelled = true;
    };
  }, [from, login, navigate, t]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-pink-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">{t('login.title')}</h1>
        <p className="text-gray-600 text-center mb-4">{t('login.noAccount')}</p>
        <p className="text-sm text-gray-500 text-center mb-8">{t('login.optionalNote')}</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex justify-center min-h-[44px]" ref={buttonRef} />
        {!ready && !error && (
          <p className="text-center text-sm text-gray-500 mt-2">{t('common.loading')}</p>
        )}

        <button
          type="button"
          onClick={openChat}
          className="block w-full text-center mt-4 text-red-600 hover:text-red-800 font-medium"
        >
          {t('login.skip')}
        </button>
      </div>
    </div>
  );
};

export default Login;
