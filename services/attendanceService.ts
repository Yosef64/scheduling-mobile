import { Attendance, AttendanceStatus, ClassSchedule } from '@/types';

export const updateAttendance = (
  attendance: Attendance[],
  scheduleId: string,
  schedule: ClassSchedule,
  dateString: string,
  status: AttendanceStatus,
  notes: string,
  userId: string,
  arrivalTime?: string
): Attendance[] => {
  const existingIndex = attendance.findIndex(
    (a) => a.scheduleId === scheduleId && a.date === dateString
  );

  if (existingIndex === -1) {
    const newAttendance: Attendance = {
      id: `a${attendance.length + 1}`,
      scheduleId,
      teacherId: schedule.teacher.id,
      teacherName: schedule.teacher.name,
      subjectName: schedule.subjectName,
      date: dateString,
      status,
      markedByUserId: userId,
      markedAt: new Date().toISOString(),
      notes,
      arrivalTime: status === 'late' ? arrivalTime : schedule.startTime,
      departureTime: schedule.endTime,
    };

    return [...attendance, newAttendance];
  }

  // Update existing record
  const updatedAttendance = [...attendance];
  updatedAttendance[existingIndex] = {
    ...updatedAttendance[existingIndex],
    status,
    notes,
    arrivalTime: status === 'late' ? arrivalTime : schedule.startTime,
    markedAt: new Date().toISOString(),
  };

  return updatedAttendance;
};
