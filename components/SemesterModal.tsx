import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Pressable,
} from 'react-native';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';
import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';

interface SemesterModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (semester: 1 | 2) => void;
}

export const SemesterModal: React.FC<SemesterModalProps> = ({
  visible,
  onClose,
  onSelect,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        style={styles.overlay}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />
        <Animated.View
          entering={FadeInDown.springify().damping(15)}
          style={styles.modalContainer}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Select Semester</Text>
            <Text style={styles.subtitle}>
              Please choose a semester to continue
            </Text>
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => onSelect(1)}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>First Semester</Text>
              <Text style={styles.buttonSubtext}>Aug - Dec</Text>
            </TouchableOpacity>

            <View style={styles.buttonDivider} />

            <TouchableOpacity
              style={styles.button}
              onPress={() => onSelect(2)}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>Second Semester</Text>
              <Text style={styles.buttonSubtext}>Jan - May</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: borderRadius.lg,
    width: Math.min(300, Dimensions.get('window').width - spacing[8] * 2),
    elevation: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    paddingBottom: spacing[3],
  },
  title: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.lg,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing[1],
  },
  subtitle: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.sm,
    color: colors.gray[500],
    textAlign: 'center',
  },
  buttonsContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  button: {
    padding: spacing[3],
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDivider: {
    height: 1,
    backgroundColor: colors.gray[200],
  },
  buttonText: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.md,
    fontWeight: '500',
    color: colors.primary[600],
  },
  buttonSubtext: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.xs,
    color: colors.gray[500],
    marginTop: 2,
  },
});
