import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  name: string | null;
  jwt: string | null;
  birthYear: number | null;
}

interface AuthContextType extends AuthState {
  login: (name: string, birthYear: number, jwt: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    name: null,
    jwt: null,
    birthYear: null,
  });

  const login = (name: string, birthYear: number, jwt: string) => {
    setAuthState({ isAuthenticated: true, name, birthYear, jwt });
  };

  const logout = () => {
    setAuthState({ isAuthenticated: false, name: null, birthYear: null, jwt: null });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
