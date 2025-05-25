import {
  User,
  Teacher,
  ClassSchedule,
  Attendance,
  AttendanceStatus,
} from '@/types';
import { format } from 'date-fns';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    class: 'Computer Science 301',
    department: 'Computer Science',
    role: 'representative',
    avatar:
      'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: '2',
    name: 'Samantha Lee',
    email: 'sam@example.com',
    class: 'Physics 202',
    department: 'Physics',
    role: 'representative',
    avatar:
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
];

export const mockTeachers: Teacher[] = [
  {
    id: 't1',
    name: 'Dr. Robert Smith',
    department: 'Computer Science',
    subject: 'Data Structures',
    email: 'rsmith@university.edu',
    avatar:
      'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: 't2',
    name: 'Prof. Emily Chen',
    department: 'Computer Science',
    subject: 'Algorithms',
    email: 'echen@university.edu',
    avatar:
      'https://images.pexels.com/photos/3796217/pexels-photo-3796217.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: 't3',
    name: 'Dr. Michael Jones',
    department: 'Physics',
    subject: 'Quantum Mechanics',
    email: 'mjones@university.edu',
    avatar:
      'https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: 't4',
    name: 'Prof. Sarah Williams',
    department: 'Mathematics',
    subject: 'Calculus',
    email: 'swilliams@university.edu',
    avatar:
      'https://images.pexels.com/photos/3790092/pexels-photo-3790092.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: 't5',
    name: 'Dr. James Taylor',
    department: 'Computer Science',
    subject: 'Artificial Intelligence',
    email: 'jtaylor@university.edu',
    avatar:
      'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
];

export const mockSchedules: ClassSchedule[] = [
  {
    id: 's1',
    subjectName: 'Data Structures',
    teacher: mockTeachers[0],
    room: 'CS-101',
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:30',
    classGroup: 'CS-301',
  },
  {
    id: 's2',
    subjectName: 'Algorithms',
    teacher: mockTeachers[1],
    room: 'CS-102',
    day: 'Monday',
    startTime: '11:00',
    endTime: '12:30',
    classGroup: 'CS-301',
  },
  {
    id: 's3',
    subjectName: 'Artificial Intelligence',
    teacher: mockTeachers[4],
    room: 'CS-103',
    day: 'Tuesday',
    startTime: '09:00',
    endTime: '10:30',
    classGroup: 'CS-301',
  },
  {
    id: 's4',
    subjectName: 'Data Structures',
    teacher: mockTeachers[0],
    room: 'CS-101',
    day: 'Wednesday',
    startTime: '09:00',
    endTime: '10:30',
    classGroup: 'CS-301',
  },
  {
    id: 's5',
    subjectName: 'Algorithms',
    teacher: mockTeachers[1],
    room: 'CS-102',
    day: 'Wednesday',
    startTime: '11:00',
    endTime: '12:30',
    classGroup: 'CS-301',
  },
  {
    id: 's6',
    subjectName: 'Artificial Intelligence',
    teacher: mockTeachers[4],
    room: 'CS-103',
    day: 'Thursday',
    startTime: '09:00',
    endTime: '10:30',
    classGroup: 'CS-301',
  },
  {
    id: 's7',
    subjectName: 'Quantum Mechanics',
    teacher: mockTeachers[2],
    room: 'PH-201',
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:30',
    classGroup: 'PH-202',
  },
  {
    id: 's8',
    subjectName: 'Calculus',
    teacher: mockTeachers[3],
    room: 'MT-101',
    day: 'Tuesday',
    startTime: '11:00',
    endTime: '12:30',
    classGroup: 'PH-202',
  },
];

// Generate attendance records for the past week
export const mockAttendance: Attendance[] = [];

// Get current date
const today = new Date();

// Generate some attendance records
for (let i = 0; i < 14; i++) {
  const date = new Date();
  date.setDate(today.getDate() - i);
  const dateString = format(date, 'yyyy-MM-dd');

  // For each day, add attendance for some schedules
  const schedules = mockSchedules.filter((s, index) => index < 3);

  schedules.forEach((schedule) => {
    const dayOfWeek = format(date, 'EEEE');

    // Only add attendance for matching days
    if (schedule.day === dayOfWeek) {
      const statuses: AttendanceStatus[] = [
        'present',
        'late',
        'absent',
        'substitute',
      ];
      const randomStatus =
        statuses[Math.floor(Math.random() * (i === 0 ? 1 : statuses.length))];

      mockAttendance.push({
        id: `a${mockAttendance.length + 1}`,
        scheduleId: schedule.id,
        teacherId: schedule.teacher.id,
        teacherName: schedule.teacher.name,
        subjectName: schedule.subjectName,
        date: dateString,
        status: randomStatus,
        markedBy: '1',
        markedAt: new Date(date).toISOString(),
        notes:
          randomStatus === 'absent'
            ? 'Teacher notified department of absence'
            : '',
        arrivalTime:
          randomStatus === 'late'
            ? `${
                parseInt(schedule.startTime.split(':')[0]) +
                Math.floor(Math.random() * 30)
              }:${Math.floor(Math.random() * 60)
                .toString()
                .padStart(2, '0')}`
            : schedule.startTime,
        departureTime: schedule.endTime,
      });
    }
  });
}

// Add some pending attendance for today's classes
const todayString = format(today, 'yyyy-MM-dd');
const dayOfWeek = format(today, 'EEEE');
const todaySchedules = mockSchedules.filter((s) => s.day === dayOfWeek);

todaySchedules.forEach((schedule) => {
  // Check if we've already added this schedule
  const exists = mockAttendance.some(
    (a) => a.scheduleId === schedule.id && a.date === todayString
  );

  if (!exists) {
    mockAttendance.push({
      id: `a${mockAttendance.length + 1}`,
      scheduleId: schedule.id,
      teacherId: schedule.teacher.id,
      teacherName: schedule.teacher.name,
      subjectName: schedule.subjectName,
      date: todayString,
      status: 'pending',
      markedBy: '1',
      markedAt: new Date().toISOString(),
      notes: '',
      arrivalTime: undefined,
      departureTime: undefined,
    });
  }
});
