import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useChatUI } from '../components/FloatingChat';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';

const Login = () => {
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { t } = useLanguage();
  const { openChat } = useChatUI();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const handleGoogleSignIn = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      const response = await login(result.user, idToken);
      if (!response.success) {
        setError(response.error || t('login.authError'));
        return;
      }
      if (response.user?.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error('Google sign-in error:', err);
      setError(t('login.googleError'));
    }
  };

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

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg px-4 py-3 hover:bg-gray-50 transition-colors"
        >
          <span className="text-gray-700 font-medium">{t('login.google')}</span>
        </button>

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
