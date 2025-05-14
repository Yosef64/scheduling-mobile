export interface User {
  id: string;
  name: string;
  email: string;
  class: string;
  department: string;
  role: 'representative';
  avatar?: string;
}

export interface Teacher {
  id: string;
  name: string;
  department: string;
  subject: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

export interface ClassSchedule {
  id: string;
  subjectName: string;
  teacher: Teacher;
  room: string;
  day: string;
  startTime: string;
  endTime: string;
  classGroup: string;
}

export type AttendanceStatus = 'present' | 'late' | 'absent' | 'substitute' | 'pending';

export interface Attendance {
  id: string;
  scheduleId: string;
  teacherId: string;
  teacherName: string;
  subjectName: string;
  date: string;
  status: AttendanceStatus;
  markedByUserId: string;
  markedAt: string;
  notes?: string;
  arrivalTime?: string;
  departureTime?: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}