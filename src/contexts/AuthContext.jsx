import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { verifyFirebaseToken, getCurrentUser } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const persistUser = useCallback((u) => {
    setUser(u);
    if (u) localStorage.setItem('user', JSON.stringify(u));
    else localStorage.removeItem('user');
  }, []);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      persistUser(null);
      return null;
    }
    try {
      const me = await getCurrentUser();
      persistUser(me);
      return me;
    } catch {
      localStorage.removeItem('token');
      persistUser(null);
      return null;
    }
  }, [persistUser]);

  useEffect(() => {
    (async () => {
      const cached = localStorage.getItem('user');
      if (cached) {
        try {
          setUser(JSON.parse(cached));
        } catch {
          /* ignore */
        }
      }
      await refreshUser();
      setLoading(false);
    })();
  }, [refreshUser]);

  const login = useCallback(async (idToken) => {
    try {
      const response = await verifyFirebaseToken(idToken);
      localStorage.setItem('token', response.token);
      persistUser(response.user);
      return { success: true, user: response.user };
    } catch (error) {
      console.error('Login error:', error);
      const detail = error.response?.data?.detail;
      return {
        success: false,
        error: typeof detail === 'string' ? detail : error.message,
      };
    }
  }, [persistUser]);

  const logout = () => {
    localStorage.removeItem('token');
    persistUser(null);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{ user, isAdmin, login, logout, loading, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
