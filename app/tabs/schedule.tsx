import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextStyle,
  RefreshControl,
} from 'react-native';
import { DateSelector } from '@/components/DateSelector';
import { colors, spacing, typography } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import {
  mockScheduleResponse,
  mockAttendanceData,
} from '@/data/mockScheduleData';
import { DailyScheduleView } from '@/components/DailyScheduleView';
import { convertToClassSchedule } from '@/utils/scheduleConverter';
import {
  ClassSchedule,
  Attendance,
  AttendanceStatus,
  User,
  AttendanceRequest,
} from '@/types';
import { format } from 'date-fns';
import { createAttendance } from '@/services/attendanceService';
import Toast from 'react-native-toast-message';
import { toastConfig } from '@/components/ToastConfig';

export default function ScheduleScreen() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [studentGroup, setStudentGroup] = useState(
    mockScheduleResponse.studentGroup
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async (refreshing = false) => {
    try {
      if (!user) return;

      if (refreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      // Convert mock data to ClassSchedule format
      const convertedSchedules = mockScheduleResponse.entries.flatMap(
        convertToClassSchedule
      );

      // Get attendance for the selected date
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      const todaysAttendance = mockAttendanceData.filter(
        (a) => a.date === dateString
      );

      setStudentGroup(mockScheduleResponse.studentGroup);
      setSchedules(convertedSchedules);
      setAttendance(todaysAttendance);
    } catch (err: any) {
      console.error('Error loading schedule data:', err);
      setError(err.message || 'Failed to load schedule data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user, selectedDate]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleRefresh = () => {
    loadData(true);
  };

  const handleAttendanceSubmit = async (
    status: AttendanceStatus,
    notes: string,
    arrivalTime?: string,
    schedule?: ClassSchedule
  ) => {
    if (!schedule || !user) return;

    const newAttendance: AttendanceRequest = {
      schedule: schedule._id.split('-')[0],
      date: format(selectedDate, 'yyyy-MM-dd'),
      status,
      notes,
      arrivalTime,
      teacher: schedule.teacher._id,
      course: schedule.course._id,
      markedBy: user._id,
    };

    setIsLoading(true);

    try {
      await createAttendance(newAttendance);
      Toast.show({
        type: 'success',
        text1: 'Attendance Marked',
        text2: `Successfully marked ${status} for ${schedule.course.name}`,
        position: 'bottom',
        visibilityTime: 3000,
      });

      // Refresh the attendance data
      loadData();
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.request?.data?.message || 'Failed to mark attendance',
        position: 'bottom',
        visibilityTime: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          Hello, {user?.name?.split(' ')[0] || 'User'}
        </Text>
        {studentGroup && (
          <Text style={styles.subText}>
            {studentGroup.department} • Year {studentGroup.year} Section{' '}
            {studentGroup.section}
          </Text>
        )}
      </View>

      <DateSelector
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
      />

      <View style={styles.scheduleContainer}>
        <DailyScheduleView
          schedules={schedules}
          date={selectedDate}
          attendance={attendance}
          onAttendanceSubmit={handleAttendanceSubmit}
        />
      </View>
      <Toast config={toastConfig} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
