import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  BaseToast,
  ErrorToast,
  BaseToastProps,
} from 'react-native-toast-message';
import { colors, typography, borderRadius } from '@/constants/theme';
import { CheckCircle2, XCircle } from 'lucide-react-native';

export const toastConfig = {
  success: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      style={styles.successToast}
      contentContainerStyle={styles.contentContainer}
      text1Style={styles.title}
      text2Style={styles.message}
      renderLeadingIcon={() => (
        <View style={styles.iconContainer}>
          <CheckCircle2 size={24} color={'white'} />
        </View>
      )}
    />
  ),
  error: (props: BaseToastProps) => (
    <ErrorToast
      {...props}
      style={styles.errorToast}
      contentContainerStyle={styles.contentContainer}
      text1Style={styles.title}
      text2Style={styles.message}
      renderLeadingIcon={() => (
        <View style={styles.iconContainer}>
          <XCircle size={24} color={'white'} />
        </View>
      )}
    />
  ),
  warning: (props: BaseToastProps) => (
    <ErrorToast
      {...props}
      style={styles.warningToast}
      contentContainerStyle={styles.contentContainer}
      text1Style={styles.title}
      text2Style={styles.message}
      renderLeadingIcon={() => (
        <View style={styles.iconContainer}>
          <XCircle size={24} color={'white'} />
        </View>
      )}
    />
  ),
};

const styles = StyleSheet.create({
  successToast: {
    backgroundColor: colors.success[600],
    color: 'white',
    borderRadius: borderRadius.lg,
    marginHorizontal: 16,
    height: 'auto',
    minHeight: 70,
    paddingVertical: 12,
  },
  errorToast: {
    color: 'white',
    backgroundColor: colors.error[500],
    borderRadius: borderRadius.lg,
    marginHorizontal: 16,
    height: 'auto',
    minHeight: 70,
    paddingVertical: 12,
  },
  warningToast: {
    color: 'white',
    backgroundColor: colors.warning[500],
    borderRadius: borderRadius.lg,
    marginHorizontal: 16,
    height: 'auto',
    minHeight: 70,
    paddingVertical: 12,
  },
  contentContainer: {
    paddingHorizontal: 12,
  },
  title: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.md,
    fontWeight: '600',
    color: 'white',
  },
  message: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.sm,
    color: 'white',
  },
  iconContainer: {
    paddingLeft: 16,
    justifyContent: 'center',
  },
});
