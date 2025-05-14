import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { User, AuthContextType } from '@/types';
import { mockUsers } from '@/data/mockData';

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
        const userJson = await SecureStore.getItemAsync('user');
        if (userJson) {
          setUser(JSON.parse(userJson));
        }
      } catch (error) {
        console.error('Failed to load user data', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      console.log('Signing in with email:', email);
      const foundUser = mockUsers.find((u) => u.email === email);
      console.log('Found user', foundUser);
      if (!foundUser) {
        throw new Error('User not found');
      }
      await SecureStore.setItemAsync('user', JSON.stringify(foundUser));
      setUser(foundUser);
    } catch (error) {
      console.error('Sign in failed', error);
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync('user');
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
