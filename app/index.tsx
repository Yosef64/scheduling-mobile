import { useAuth } from '@/contexts/AuthContext';
import { Redirect, RelativePathString } from 'expo-router';

// Redirect to tabs layout
export default function Home() {
  const { user } = useAuth();
  console.log('User:', user);
  return (
    <Redirect
      href={
        user
          ? ('/tabs' as RelativePathString)
          : ('/login' as RelativePathString)
      }
    />
  );
}
