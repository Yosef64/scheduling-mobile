import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  TextStyle,
} from 'react-native';
import { ClassSchedule, AttendanceStatus } from '@/types';
import {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
} from '@/constants/theme';
import Animated, { SlideInRight, FadeIn } from 'react-native-reanimated';
import {
  UserCheck,
  UserX,
  Clock,
  UserCog,
  CheckCircle2,
  AlignJustify,
} from 'lucide-react-native';

interface AttendanceFormProps {
  schedule: ClassSchedule;
  onSubmit: (
    status: AttendanceStatus,
    notes: string,
    arrivalTime?: string
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
    <Animated.View
      entering={SlideInRight.delay(
        value === 'present'
          ? 0
          : value === 'late'
          ? 100
          : value === 'absent'
          ? 200
          : 300
      ).duration(400)}
    >
      <TouchableOpacity
        style={[
          styles.statusOption,
          status === value && { backgroundColor: color, borderColor: color },
        ]}
        onPress={() => setStatus(value)}
      >
        <View style={styles.statusIconContainer}>{icon}</View>
        <Text
          style={[styles.statusText, status === value && { color: 'white' }]}
        >
          {label}
        </Text>
        {status === value && (
          <CheckCircle2 size={16} color="white" style={styles.checkIcon} />
        )}
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <Animated.View style={styles.container} entering={FadeIn.duration(300)}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.title}>Mark Attendance</Text>
        <Text style={styles.subtitle}>
          {schedule.subjectName} - {schedule.teacher.name}
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Attendance Status</Text>
          <View style={styles.statusOptionsContainer}>
            <StatusOption
              value="present"
              icon={
                <UserCheck
                  size={20}
                  color={status === 'present' ? 'white' : colors.success[500]}
                />
              }
              label="Present"
              color={colors.success[500]}
            />
            <StatusOption
              value="late"
              icon={
                <Clock
                  size={20}
                  color={status === 'late' ? 'white' : colors.warning[500]}
                />
              }
              label="Late"
              color={colors.warning[500]}
            />
            <StatusOption
              value="absent"
              icon={
                <UserX
                  size={20}
                  color={status === 'absent' ? 'white' : colors.error[500]}
                />
              }
              label="Absent"
              color={colors.error[500]}
            />
            <StatusOption
              value="substitute"
              icon={
                <UserCog
                  size={20}
                  color={
                    status === 'substitute' ? 'white' : colors.secondary[500]
                  }
                />
              }
              label="Substitute"
              color={colors.secondary[500]}
            />
          </View>
        </View>

        {status === 'late' && (
          <Animated.View style={styles.section} entering={FadeIn.duration(300)}>
            <Text style={styles.sectionTitle}>Arrival Time</Text>
            <TextInput
              style={styles.timeInput}
              value={arrivalTime}
              onChangeText={setArrivalTime}
              placeholder="HH:MM"
              keyboardType="numbers-and-punctuation"
            />
          </Animated.View>
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
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() =>
            onSubmit(status, notes, status === 'late' ? arrivalTime : undefined)
          }
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingTop: spacing[4],
    ...shadows.lg,
  },
  contentContainer: {
    paddingHorizontal: spacing[3],
    paddingBottom: spacing[10],
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
    marginBottom: spacing[3],
  },
  section: {
    marginBottom: spacing[4],
  },
  sectionTitle: {
    fontFamily: typography.fontFamily,
    fontWeight: typography.weights.semibold as TextStyle['fontWeight'],
    fontSize: typography.sizes.md,
    color: colors.gray[800],
    marginBottom: spacing[2],
  },
  statusOptionsContainer: {
    gap: spacing[2],
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[2],
    backgroundColor: 'white',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  statusIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[2],
  },
  statusText: {
    fontFamily: typography.fontFamily,
    fontWeight: typography.weights.medium as TextStyle['fontWeight'],
    fontSize: typography.sizes.md,
    color: colors.gray[800],
  },
  checkIcon: {
    position: 'absolute',
    right: spacing[2],
  },
  timeInput: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing[2],
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.md,
  },
  textAreaContainer: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.md,
    padding: spacing[2],
    height: 120,
  },
  textAreaIcon: {
    position: 'absolute',
    top: spacing[2],
    left: spacing[2],
  },
  textArea: {
    flex: 1,
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.md,
    paddingLeft: spacing[4],
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: spacing[3],
    borderTopWidth: 1,
    borderColor: colors.gray[200],
    backgroundColor: 'white',
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
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.md,
  },
  submitButtonText: {
    fontFamily: typography.fontFamily,
    fontWeight: typography.weights.medium as TextStyle['fontWeight'],
    fontSize: typography.sizes.md,
    color: 'white',
  },
});
