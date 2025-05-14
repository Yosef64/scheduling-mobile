import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { DailyScheduleView } from '@/components/DailyScheduleView';
import { DateSelector } from '@/components/DateSelector';
import { AttendanceStatus } from '@/types';
import { mockSchedules, mockAttendance } from '@/data/mockData';
import { colors, spacing, typography } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { updateAttendance } from '@/services/attendanceService';

export default function ScheduleScreen() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendance, setAttendance] = useState(mockAttendance);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAttendanceSubmit = (
    scheduleId: string,
    status: AttendanceStatus,
    notes: string,
    arrivalTime?: string
  ) => {
    if (!user) return;

    const dateString = format(selectedDate, 'yyyy-MM-dd');

    // Find the schedule
    const schedule = mockSchedules.find((s) => s.id === scheduleId);
    if (!schedule) return;

    // Create or update attendance record
    const updatedAttendance = updateAttendance(
      attendance,
      scheduleId,
      schedule,
      dateString,
      status,
      notes,
      user.id,
      arrivalTime
    );

    // Update state
    setAttendance(updatedAttendance);
  };

  return (
    <SafeAreaView style={styles.container as ViewStyle}>
      <View style={styles.header as ViewStyle}>
        <Text style={styles.welcomeText as TextStyle}>
          Hello, {user?.name?.split(' ')[0] || 'User'}
        </Text>
        <Text style={styles.subText as TextStyle}>
          {user?.class} • {user?.department}
        </Text>
      </View>

      <DateSelector
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
      />

      <View style={styles.scheduleContainer as ViewStyle}>
        <DailyScheduleView
          schedules={mockSchedules}
          attendance={attendance}
          date={selectedDate}
          onAttendanceSubmit={handleAttendanceSubmit}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  header: {
    paddingHorizontal: spacing[3],
    paddingTop: spacing[4],
    paddingBottom: spacing[2],
    backgroundColor: 'white',
  },
  welcomeText: {
    fontFamily: typography.fontFamily,
    fontWeight: typography.weights.bold as TextStyle['fontWeight'],
    fontSize: typography.sizes.xl,
    color: colors.gray[900],
  },
  subText: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.sm,
    color: colors.gray[500],
    marginTop: spacing['0.5'],
  },
  scheduleContainer: {
    flex: 1,
  },
});
