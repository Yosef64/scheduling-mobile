import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

// Assuming these props are passed to the component
const SubmitButton = ({
  onSubmit,
  status,
  notes,
  arrivalTime,
  schedule,
  colors,
  borderRadius,
}: {
  onSubmit: (
    status: string,
    notes: string,
    arrivalTime: string,
    schedule: any
  ) => void;
  status: string;
  notes: string;
  arrivalTime: string;
  schedule: any;
  colors: any;
  borderRadius: any;
}) => {
  const scale = useSharedValue(1); // Animation value for press effect

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95); // Slightly scale down on press
  };

  const handlePressOut = () => {
    scale.value = withSpring(1); // Return to original size
  };

  return (
    <Animated.View style={[styles.submitButton, animatedStyle]}>
      <LinearGradient
        colors={[
          colors.primary[500] || '#FF6B6B',
          colors.primary[700] || '#FF3D3D',
        ]} // Vibrant red gradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <TouchableOpacity
          style={styles.innerButton}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() =>
            onSubmit(
              status,
              notes,
              status === 'late' ? arrivalTime : '',
              schedule
            )
          }
          activeOpacity={1} // Handled by animation
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  submitButton: {
    height: 56, // Taller button for prominence
    borderRadius: 16, // Rounded corners for a modern look
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8, // Stronger shadow for Android
    overflow: 'visible', // Allow shadow to render
  },
  gradient: {
    flex: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerButton: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)', // Subtle border for depth
    borderRadius: 16,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18, // Larger text for impact
    fontWeight: '700', // Bold for emphasis
    letterSpacing: 1, // Wider spacing for readability
    textTransform: 'uppercase', // Uppercase for a strong look
    textShadowColor: 'rgba(0, 0, 0, 0.2)', // Subtle text shadow
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default SubmitButton;
