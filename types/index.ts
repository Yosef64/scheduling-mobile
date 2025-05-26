export interface User {
  _id: string;
  name: string;
  studentGroup: StudentGroup;
}

export interface Teacher {
  _id: string;
  name: string;
  department: string;
  subject: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

export interface ClassSchedule {
  _id: string;
  course: Course;
  teacher: Teacher;
  room: string;
  day: string;
  startTime: string;
  endTime: string;
  classGroup: StudentGroup;
  createdBy: CreatedBy;
}

export type AttendanceStatus =
  | 'present'
  | 'late'
  | 'absent'
  | 'substitute'
  | 'pending';

export interface Attendance {
  _id: string;
  schedule: string;
  teacher: Teacher;
  course: Course;
  date: string;
  status: AttendanceStatus;
  markedBy: User;
  markedAt: string;
  notes?: string;
  arrivalTime?: string;
  departureTime?: string;
}
export interface AttendanceRequest {
  schedule: string;
  date: string;
  status: AttendanceStatus;
  notes?: string;
  arrivalTime?: string;
  departureTime?: string;
  teacher: string;
  course: string;
  markedBy: string;
}

export interface Course {
  _id: string;
  courseCode: string;
  name: string;
}

export interface Lecture {
  _id: string;
  name: string;
  maxLoad: number;
}

export interface CreatedBy {
  _id: string;
  username: string;
  name: string;
  role: string;
}

export interface Activity {
  _id: string;
  course: Course;
  lecture: Lecture;
  studentGroup: StudentGroup;
  semester: string;
  roomRequirement: 'lecture' | 'lab' | 'seminar';
  totalDuration: number;
  split: number;
  createdBy: CreatedBy;
  isDeleted: boolean;
}

export interface Schedule {
  _id: string;
  activity: Activity;
  reservedTimeslots: Timeslot[];
  totalDuration: number;
  room: Room;
  studentGroup: StudentGroup;
  createdBy: CreatedBy;
  semester: string;
  isDeleted: boolean;
  __v: number;
}

export interface StudentGroup {
  _id: string;
  department: string;
  year: number;
  section: string;
  expectedEnrollment: number;
  isDeleted?: boolean;
}

export interface Room {
  _id: string;
  name: string;
  capacity: number;
  type: 'lecture' | 'lab' | 'seminar' | 'other';
  department: string;
  building?: string;
  isDeleted?: boolean;
  active?: boolean;
}

export interface Timeslot {
  _id: string;
  day: string;
  startTime: string;
  endTime: string;
  duration: number;
}

export interface ScheduleResponse {
  studentGroup: StudentGroup;
  entries: Schedule[];
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
}
