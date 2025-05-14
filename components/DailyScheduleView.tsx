import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal } from 'react-native';
import { format, parseISO, isToday, differenceInMinutes } from 'date-fns';
import { ClassSchedule, Attendance, AttendanceStatus } from '@/types';
import { colors, spacing, typography } from '@/constants/theme';
import { ScheduleCard } from './ScheduleCard';
import { AttendanceForm } from './AttendanceForm';
import { AlertCircle } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

interface DailyScheduleViewProps {
  schedules: ClassSchedule[];
  attendance: Attendance[];
  date: Date;
  onAttendanceSubmit: (scheduleId: string, status: AttendanceStatus, notes: string, arrivalTime?: string) => void;
}

export const DailyScheduleView: React.FC<DailyScheduleViewProps> = ({
  schedules,
  attendance,
  date,
  onAttendanceSubmit
}) => {
  const [selectedSchedule, setSelectedSchedule] = useState<ClassSchedule | null>(null);
  
  const dateString = format(date, 'yyyy-MM-dd');
  const dayName = format(date, 'EEEE');
  
  // Filter schedules for the current day
  const daySchedules = schedules
    .filter(schedule => schedule.day === dayName)
    .sort((a, b) => {
      const timeA = a.startTime.split(':').map(Number);
      const timeB = b.startTime.split(':').map(Number);
      return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
    });
  
  // Get attendance status for each schedule
  const getAttendanceStatus = (scheduleId: string): AttendanceStatus | undefined => {
    const found = attendance.find(a => a.scheduleId === scheduleId && a.date === dateString);
    return found?.status;
  };
  
  const handleSchedulePress = (schedule: ClassSchedule) => {
    if (isToday(date)) {
      setSelectedSchedule(schedule);
    }
  };
  
  const handleSubmitAttendance = (status: AttendanceStatus, notes: string, arrivalTime?: string) => {
    if (selectedSchedule) {
      onAttendanceSubmit(selectedSchedule.id, status, notes, arrivalTime);
      setSelectedSchedule(null);
    }
  };
  
  const closeModal = () => {
    setSelectedSchedule(null);
  };
  
  if (daySchedules.length === 0) {
    return (
      <Animated.View 
        style={styles.emptyContainer}
        entering={FadeIn.duration(500)}
      >
        <AlertCircle size={40} color={colors.gray[400]} />
        <Text style={styles.emptyText}>No classes scheduled for {format(date, 'EEEE')}</Text>
      </Animated.View>
    );
  }
  
  return (
    <View style={styles.container}>
      <FlatList
        data={daySchedules}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <ScheduleCard
            schedule={item}
            status={getAttendanceStatus(item.id)}
            onPress={handleSchedulePress}
          />
        )}
      />
      
      <Modal
        visible={!!selectedSchedule}
        animationType="slide"
        transparent
        onRequestClose={closeModal}
      >
        {selectedSchedule && (
          <View style={styles.modalContainer}>
            <TouchableOpacity 
              style={styles.modalOverlay} 
              onPress={closeModal}
              activeOpacity={1}
            />
            <AttendanceForm
              schedule={selectedSchedule}
              onSubmit={handleSubmitAttendance}
              onCancel={closeModal}
            />
          </View>
        )}
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});