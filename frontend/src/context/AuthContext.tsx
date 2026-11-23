// src/context/AuthContext.tsx

'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

interface AuthContextValue {
  token: string | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setToken(localStorage.getItem('proteca_token'));
    setLoading(false);
  }, []);

  const login = (accessToken: string) => {
    localStorage.setItem('proteca_token', accessToken);
    setToken(accessToken);
  };

  const logout = () => {
    localStorage.removeItem('proteca_token');
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }

  return context;
}