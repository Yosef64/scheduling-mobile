import api from './api';
import * as SecureStore from 'expo-secure-store';
import { User } from '@/types';

export const verifyToken = async (token: string): Promise<User> => {
  const response = await api.post('/auth/verify', { token });
  const user = response.data.user;
  await SecureStore.setItemAsync('token', token);
  await SecureStore.setItemAsync('user', JSON.stringify(user));

  return user;
};

export const getStoredToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync('token');
  } catch (error) {
    return null;
  }
};

export const clearToken = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('user');
  } catch (error) {
    console.error('Error clearing token:', error);
  }
};
