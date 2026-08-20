import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginDto, RegisterDto } from '../types/auth';
import { loginUser, registerUser } from '@/lib/api';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (dto: LoginDto) => Promise<void>;
  register: (dto: RegisterDto) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'startupradar_token';
const USER_KEY = 'startupradar_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = async (dto: LoginDto) => {
    try {
      const res = await loginUser(dto);
      const jwtToken = res.access_token;
      const currentUser: User = res.user || {
        id: 'usr-1',
        email: dto.email,
        name: dto.email.split('@')[0],
      };

      setToken(jwtToken);
      setUser(currentUser);
      localStorage.setItem(TOKEN_KEY, jwtToken);
      localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
      toast.success(`Bienvenue, ${currentUser.name || currentUser.email} !`);
    } catch (error) {
      toast.error((error as Error).message || 'Échec de la connexion.');
      throw error;
    }
  };

  const register = async (dto: RegisterDto) => {
    try {
      const res = await registerUser(dto);
      const jwtToken = res.access_token;
      const currentUser: User = res.user || {
        id: 'usr-1',
        email: dto.email,
        name: dto.name || dto.email.split('@')[0],
      };

      setToken(jwtToken);
      setUser(currentUser);
      localStorage.setItem(TOKEN_KEY, jwtToken);
      localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
      toast.success(`Compte créé avec succès ! Bienvenue, ${currentUser.name || currentUser.email} !`);
    } catch (error) {
      toast.error((error as Error).message || 'Échec de l\'inscription.');
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    toast.info('Vous êtes déconnecté.');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token),
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
}
