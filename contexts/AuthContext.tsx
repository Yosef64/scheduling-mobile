import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { User, AuthContextType } from '@/types';
import {
  getStoredToken,
  verifyToken,
  clearToken,
} from '@/services/authServices';

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await getStoredToken();
        if (token) {
          const userData = await verifyToken(token);
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to load user data', error);
        await clearToken();
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const signIn = async (_email: string, token: string): Promise<void> => {
    try {
      const userData = await verifyToken(token);
      setUser(userData);
    } catch (error) {
      console.error('Sign in failed', error);
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await clearToken();
      setUser(null);
    } catch (error) {
      console.error('Sign out failed', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
