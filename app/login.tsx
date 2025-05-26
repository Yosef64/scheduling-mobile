import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextStyle,
} from 'react-native';
import { RelativePathString, useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
} from '@/constants/theme';
import { Lock, ArrowRight } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function LoginScreen() {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!token) {
      setError('Please enter your token');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await signIn(token);
      router.replace('/tabs' as RelativePathString);
    } catch (err: any) {
      if (err?.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err?.message) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Animated.View entering={FadeInDown.duration(1000).delay(100)}>
            <Image
              source={{
                uri: 'https://images.pexels.com/photos/8199562/pexels-photo-8199562.jpeg',
              }}
              style={styles.headerImage}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(1000).delay(200)}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </Animated.View>
        </View>

        <Animated.View
          style={styles.formContainer}
          entering={FadeInUp.duration(1000).delay(300)}
        >
          {error ? (
            <Animated.View
              style={styles.errorContainer}
              entering={FadeInDown.duration(400)}
            >
              <Text style={styles.errorText}>{error}</Text>
            </Animated.View>
          ) : null}

          <View style={styles.inputContainer}>
            <Lock size={20} color={colors.gray[400]} />
            <TextInput
              style={styles.input}
              placeholder="Enter your token"
              value={token}
              onChangeText={setToken}
              placeholderTextColor={colors.gray[400]}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.loginButton,
              isLoading && styles.loginButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <View style={styles.loginButtonContent}>
              {isLoading ? (
                <LoadingSpinner size={24} color="white" />
              ) : (
                <>
                  <Text style={styles.loginButtonText}>Verify Token</Text>
                  <ArrowRight size={20} color="white" />
                </>
              )}
            </View>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Don't have a token? Contact your administrator
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing[8],
    paddingBottom: spacing[4],
  },
  headerImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: spacing[4],
  },
  title: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes['3xl'],
    fontWeight: typography.weights.bold as TextStyle['fontWeight'],
    color: colors.gray[900],
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.lg,
    color: colors.gray[600],
    marginTop: spacing[1],
    textAlign: 'center',
  },
  formContainer: {
    padding: spacing[4],
  },
  errorContainer: {
    backgroundColor: colors.error[50],
    borderRadius: borderRadius.md,
    padding: spacing[3],
    marginBottom: spacing[3],
  },
  errorText: {
    fontFamily: typography.fontFamily,
    color: colors.error[700],
    fontSize: typography.sizes.sm,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: borderRadius.lg,
    marginBottom: spacing[3],
    paddingHorizontal: spacing[3],
    height: 56,
    borderWidth: 1,
    borderColor: colors.gray[200],
    ...shadows.sm,
  },
  input: {
    flex: 1,
    marginLeft: spacing[2],
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.md,
    color: colors.gray[900],
  },
  loginButton: {
    backgroundColor: colors.primary[600],
    borderRadius: borderRadius.lg,
    padding: spacing[2],
    height: 56,
    marginTop: spacing[2],
  },
  loginButtonDisabled: {
    backgroundColor: colors.gray[400],
  },
  loginButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  loginButtonText: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold as TextStyle['fontWeight'],
    color: 'white',
    marginRight: spacing[2],
  },
  footer: {
    marginTop: spacing[6],
    alignItems: 'center',
  },
  footerText: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
    textAlign: 'center',
  },
});
