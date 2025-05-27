import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { format, parseISO, isToday, differenceInMinutes } from 'date-fns';
import { ClassSchedule, Attendance, AttendanceStatus } from '@/types';
import { colors, spacing, typography } from '@/constants/theme';
import { ScheduleCard } from './ScheduleCard';
import { AttendanceForm } from './AttendanceForm';
import { AlertCircle } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import Toast from 'react-native-toast-message';

interface DailyScheduleViewProps {
  schedules: ClassSchedule[];
  attendance: Attendance[];
  date: Date;
  onAttendanceSubmit: (
    status: AttendanceStatus,
    notes: string,
    arrivalTime?: string,
    schedule?: ClassSchedule
  ) => void;
  refreshControl?: React.ReactElement<any, any>;
}

export const DailyScheduleView: React.FC<DailyScheduleViewProps> = ({
  schedules,
  attendance,
  date,
  onAttendanceSubmit,
  refreshControl,
}) => {
  const [selectedSchedule, setSelectedSchedule] =
    useState<ClassSchedule | null>(null);
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['85%'], []);

  const dateString = format(date, 'yyyy-MM-dd');
  const dayName = format(date, 'EEEE');

  // Filter schedules for the current day
  const daySchedules = schedules
    .filter((schedule) => schedule.day === dayName)
    .sort((a, b) => {
      const timeA = a.startTime.split(':').map(Number);
      const timeB = b.startTime.split(':').map(Number);
      return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
    });

  const getAttendanceStatus = (
    scheduleId: string
  ): AttendanceStatus | undefined => {
    const found = attendance.find(
      (a) => a.schedule === scheduleId && a.date === dateString
    );
    return found?.status;
  };

  const handleSchedulePress = (schedule: ClassSchedule) => {
    if (!isToday(new Date(date))) {
      Toast.show({
        type: 'warning',
        text1: 'Cannot mark attendance for this day',
        text2: "Please mark attendance for today's schedule",
      });
      return;
    }
    setSelectedSchedule(schedule);
    bottomSheetRef.current?.snapToIndex(0);
  };

  const handleSubmitAttendance = (
    status: AttendanceStatus,
    notes: string,
    arrivalTime?: string,
    schedule?: ClassSchedule
  ) => {
    if (selectedSchedule) {
      onAttendanceSubmit(status, notes, arrivalTime, schedule);
      bottomSheetRef.current?.close();
      setSelectedSchedule(null);
    }
  };

  const closeBottomSheet = useCallback(() => {
    bottomSheetRef.current?.close();
    setSelectedSchedule(null);
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  if (daySchedules.length === 0) {
    return (
      <Animated.View
        style={styles.emptyContainer}
        entering={FadeIn.duration(500)}
      >
        <AlertCircle size={40} color={colors.gray[400]} />
        <Text style={styles.emptyText}>
          No classes scheduled for {format(date, 'EEEE')}
        </Text>
      </Animated.View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={daySchedules}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        refreshControl={refreshControl}
        renderItem={({ item }) => (
          <ScheduleCard
            schedule={item}
            status={getAttendanceStatus(item._id)}
            onPress={handleSchedulePress}
          />
        )}
      />

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        onClose={closeBottomSheet}
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.bottomSheetIndicator}
      >
        {selectedSchedule && (
          <AttendanceForm
            schedule={selectedSchedule}
            onSubmit={handleSubmitAttendance}
            onCancel={closeBottomSheet}
          />
        )}
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: spacing[2],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[4],
  },
  emptyText: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.lg,
    color: colors.gray[500],
    textAlign: 'center',
    marginTop: spacing[2],
  },
  bottomSheetBackground: {
    backgroundColor: 'white',
  },
  bottomSheetIndicator: {
    backgroundColor: colors.gray[300],
    width: 40,
  },
});
