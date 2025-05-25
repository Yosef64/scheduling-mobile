import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  TextStyle,
} from 'react-native';
import { ClassSchedule, AttendanceStatus } from '@/types';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';
import {
  UserCheck,
  UserX,
  Clock,
  UserCog,
  CheckCircle2,
  AlignJustify,
} from 'lucide-react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import SubmitButton from './SubmitButton';

interface AttendanceFormProps {
  schedule: ClassSchedule;
  onSubmit: (
    status: AttendanceStatus,
    notes: string,
    arrivalTime?: string,
    schedule?: ClassSchedule
  ) => void;
  onCancel: () => void;
}

export const AttendanceForm: React.FC<AttendanceFormProps> = ({
  schedule,
  onSubmit,
  onCancel,
}) => {
  const [status, setStatus] = useState<AttendanceStatus>('present');
  const [notes, setNotes] = useState('');
  const [arrivalTime, setArrivalTime] = useState(schedule.startTime);

  const StatusOption = ({
    value,
    icon,
    label,
    color,
  }: {
    value: AttendanceStatus;
    icon: React.ReactNode;
    label: string;
    color: string;
  }) => (
    <TouchableOpacity
      style={[
        styles.statusOption,
        status === value && { backgroundColor: color, borderColor: color },
      ]}
      onPress={() => setStatus(value)}
    >
      <View style={styles.statusIconContainer}>{icon}</View>
      <Text style={[styles.statusText, status === value && { color: 'white' }]}>
        {label}
      </Text>
      {status === value && (
        <CheckCircle2 size={16} color="white" style={styles.checkIcon} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <BottomSheetScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Mark Attendance</Text>
        <Text style={styles.subtitle}>
          {schedule.course.name} - {schedule.teacher.name}
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Attendance Status</Text>
          <View style={styles.statusOptionsContainer}>
            <StatusOption
              value="present"
              icon={<UserCheck size={20} color={colors.success[500]} />}
              label="Present"
              color={colors.success[500]}
            />
            <StatusOption
              value="late"
              icon={<Clock size={20} color={colors.warning[500]} />}
              label="Late"
              color={colors.warning[500]}
            />
            <StatusOption
              value="absent"
              icon={<UserX size={20} color={colors.error[500]} />}
              label="Absent"
              color={colors.error[500]}
            />
            <StatusOption
              value="substitute"
              icon={<UserCog size={20} color={colors.secondary[500]} />}
              label="Substitute"
              color={colors.secondary[500]}
            />
          </View>
        </View>

        {status === 'late' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Arrival Time</Text>
            <TextInput
              style={styles.timeInput}
              value={arrivalTime}
              onChangeText={setArrivalTime}
              placeholder="HH:MM"
              keyboardType="numbers-and-punctuation"
            />
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes (Optional)</Text>
          <View style={styles.textAreaContainer}>
            <AlignJustify
              size={18}
              color={colors.gray[400]}
              style={styles.textAreaIcon}
            />
            <TextInput
              style={styles.textArea}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any additional notes here..."
              placeholderTextColor={colors.gray[400]}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>
      </BottomSheetScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() =>
            onSubmit(
              status,
              notes,
              status === 'late' ? arrivalTime : undefined,
              schedule
            )
          }
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContent: {
    padding: spacing[4],
  },
  title: {
    fontFamily: typography.fontFamily,
    fontWeight: typography.weights.bold as TextStyle['fontWeight'],
    fontSize: typography.sizes['2xl'],
    color: colors.gray[900],
    marginBottom: spacing[1],
  },
  subtitle: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.md,
    color: colors.gray[600],
    marginBottom: spacing[4],
  },
  section: {
    marginBottom: spacing[4],
  },
  sectionTitle: {
    fontFamily: typography.fontFamily,
    fontWeight: typography.weights.semibold as TextStyle['fontWeight'],
    fontSize: typography.sizes.md,
    color: colors.gray[800],
    marginBottom: spacing[3],
  },
  statusOptionsContainer: {
    gap: spacing[2],
  },
  statusOption: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    paddingHorizontal: spacing[3],
    backgroundColor: 'white',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  statusIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  statusText: {
    fontFamily: typography.fontFamily,
    fontWeight: typography.weights.medium as TextStyle['fontWeight'],
    fontSize: typography.sizes.md,
    color: colors.gray[800],
    flex: 1,
  },
  checkIcon: {
    marginLeft: spacing[2],
  },
  timeInput: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing[3],
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.md,
  },
  textAreaContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.gray[200],
    padding: spacing[3],
    marginBottom: spacing[4],
  },
  textAreaIcon: {
    marginRight: spacing[2],
    marginTop: spacing[1],
  },
  textArea: {
    flex: 1,
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.md,
    color: colors.gray[900],
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 0,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
  },
  cancelButton: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.md,
    marginRight: spacing[2],
  },
  cancelButtonText: {
    fontFamily: typography.fontFamily,
    fontWeight: typography.weights.medium as TextStyle['fontWeight'],
    fontSize: typography.sizes.md,
    color: colors.gray[700],
  },
  submitButton: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary[500], // Primary color (e.g., a deep blue like #007AFF)
    borderRadius: borderRadius.lg, // Slightly larger radius for a modern look (e.g., 12)
    shadowColor: '#000', // Subtle shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
    overflow: 'hidden', // Ensures gradient stays within bounds
    // Optional: Add a linear gradient background (requires react-native-linear-gradient)
    // If using LinearGradient, wrap the Text in a LinearGradient component
  },
  submitButtonText: {
    color: '#FFFFFF', // White text for contrast
    fontSize: 16,
    fontWeight: '600', // Semi-bold for a professional look
    letterSpacing: 0.5, // Slight letter spacing for clarity
    textTransform: 'uppercase', // Uppercase for a strong, professional feel
  },
});
