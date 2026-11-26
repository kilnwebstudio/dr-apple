import { createContext, useContext, useState, useCallback } from 'react';
import { api, getStoredAdmin, getToken } from '@/lib/api';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredAdmin());
  const [loading] = useState(false);

  const signIn = useCallback(async (username, password) => {
    try {
      const admin = await api.login(username, password);
      setUser(admin);
      return { error: null };
    } catch (err) {
      return { error: err.message || 'Invalid username or password' };
    }
  }, []);

  const signOut = useCallback(() => {
    api.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
