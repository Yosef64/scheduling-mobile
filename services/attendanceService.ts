import {
  Attendance,
  AttendanceRequest,
  AttendanceStatus,
  ClassSchedule,
  Course,
  User,
} from '@/types';
import api from './api';

export const createAttendance = async (newAttendance: AttendanceRequest) => {
  const response = await api.post('/representatives/attendance', newAttendance);
  return response.data;
};
export const getAttendances = async (id: string) => {
  const response = await api.get(
    `/representatives/attendance?representativeId=${id}`
  );
  return response.data;
};
