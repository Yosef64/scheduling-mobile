import { Schedule, StudentGroup, Attendance } from '@/types';
import { format } from 'date-fns';

const today = format(new Date(), 'yyyy-MM-dd');
const now = new Date().toISOString();

export const mockAttendanceData: Attendance[] = [
  {
    _id: '1',
    schedule: 'schedule-1-timeslot-1',
    date: today,
    status: 'present',
    notes: 'On time',
    teacher: {
      _id: 'teacher-1',
      name: 'Dr. Sarah Johnson',
      department: 'Computer Science',
      subject: 'Data Structures',
    },
    course: {
      _id: '680fd644807f4747c23644c8',
      courseCode: 'ENG101',
      name: 'English Literature',
    },
    markedBy: {
      _id: 'user-1',
      name: 'John Doe',
      class: '123',
      year: 2024,
      department: 'Computer Science',
    },
    markedAt: now,
  },
  {
    _id: '2',
    schedule: 'schedule-2-timeslot-3',
    date: today,
    status: 'late',
    notes: 'Arrived 10 minutes late',
    arrivalTime: '09:10',
    teacher: {
      _id: 'teacher-2',
      name: 'Prof. Michael Chen',
      department: 'Computer Science',
      subject: 'Database Systems',
    },
    course: {
      _id: '680fd644807f4747c23644c8',
      courseCode: 'ENG101',
      name: 'English Literature',
    },
    markedBy: {
      _id: 'user-1',
      name: 'John Doe',
      class: '123',
      year: 2024,
      department: 'Computer Science',
    },
    markedAt: now,
  },
  {
    _id: '3',
    schedule: 'schedule-3-timeslot-5',
    date: today,
    status: 'absent',
    notes: 'Student was sick',
    teacher: {
      _id: 'teacher-3',
      name: 'Dr. Emily Brown',
      department: 'Computer Science',
      subject: 'Software Engineering',
    },
    course: {
      _id: '680fd644807f4747c23644c8',
      courseCode: 'ENG101',
      name: 'English Literature',
    },
    markedBy: {
      _id: 'user-1',
      name: 'John Doe',
      class: '123',
      year: 2024,
      department: 'Computer Science',
    },
    markedAt: now,
  },
  {
    _id: '4',
    schedule: '682cd7b9731af9564a7db0b6-68279040dc0ea2f40419aa8e',
    date: today,
    status: 'substitute',
    notes: 'Regular teacher on leave',
    teacher: {
      _id: '68207fde24e8b95d3926cd38',
      name: 'Dr. Sarah Johnson',
      department: 'Computer Science',
      subject: 'Data Structures',
    },
    course: {
      _id: '680fd644807f4747c23644c8',
      courseCode: 'ENG101',
      name: 'English Literature',
    },
    markedBy: {
      _id: 'user-1',
      name: 'John Doe',
      class: '123',
      year: 2024,
      department: 'Computer Science',
    },
    markedAt: now,
  },
];

export const mockScheduleResponse: {
  studentGroup: StudentGroup;
  entries: Schedule[];
} = {
  studentGroup: {
    _id: '680d46b6ce09d35d77c63bc7',
    department: 'Computer Science',
    year: 1,
    section: 'B',
    expectedEnrollment: 50,
  },
  entries: [
    {
      _id: '682cd7b9731af9564a7db0b5',
      activity: {
        _id: '682cd0445803081405b75022',
        course: {
          _id: '680fd644807f4747c23644c8',
          courseCode: 'ENG101',
          name: 'English Literature',
        },
        lecture: {
          _id: '680b5e6cfd53f1328c3e4422',
          name: 'Prof. Bob',
          maxLoad: 77,
        },
        studentGroup: {
          _id: '680d46b6ce09d35d77c63bc7',
          department: 'Computer Science',
          year: 1,
          section: 'B',
          expectedEnrollment: 50,
        },
        semester: '2024 semester 1',
        roomRequirement: 'lecture' as const,
        totalDuration: 6,
        split: 1,
        createdBy: {
          _id: '66f1a2b3c4d5e6f789012360',
          username: 'teddy@gmail.com',
          name: 'teddy',
        },
        isDeleted: false,
      },
      reservedTimeslots: [
        {
          _id: '68279040dc0ea2f40419aa9d',
          day: 'Wednesday',
          startTime: '3:00',
          endTime: '4:00',
          duration: 60,
        },
      ],
      totalDuration: 60,
      room: {
        _id: '6811ec76053bbfe93c1178d9',
        name: 'Room C',
        capacity: 70,
        type: 'lecture',
        department: 'General',
      },
      studentGroup: {
        _id: '680d46b6ce09d35d77c63bc7',
        department: 'Computer Science',
        year: 1,
        section: 'B',
        expectedEnrollment: 50,
      },
      createdBy: {
        _id: '66f1a2b3c4d5e6f789012360',
        username: 'teddy@gmail.com',
        name: 'teddy',
      },
      semester: '2024 semester 1',
      isDeleted: false,
      __v: 0,
    },
    {
      _id: '682cd7b9731af9564a7db0b6',
      activity: {
        _id: '682cd0445803081405b75022',
        course: {
          _id: '680fd644807f4747c23644c5',
          courseCode: 'CS202',
          name: 'Data Structures',
        },
        lecture: {
          _id: '68207fde24e8b95d3926cd38',
          name: 'Dr. Smith',
          maxLoad: 88,
        },
        studentGroup: {
          _id: '680d46b6ce09d35d77c63bc7',
          department: 'Computer Science',
          year: 1,
          section: 'B',
          expectedEnrollment: 50,
        },
        semester: '2024 semester 1',
        roomRequirement: 'lab' as const,
        totalDuration: 7,
        split: 2,
        createdBy: {
          _id: '66f1a2b3c4d5e6f789012360',
          username: 'teddy@gmail.com',
          name: 'teddy',
        },
        isDeleted: false,
      },
      reservedTimeslots: [
        {
          _id: '68279040dc0ea2f40419aa8e',
          day: 'Monday',
          startTime: '9:00',
          endTime: '10:00',
          duration: 60,
        },
        {
          _id: '68279040dc0ea2f40419aa8f',
          day: 'Monday',
          startTime: '10:00',
          endTime: '11:00',
          duration: 60,
        },
      ],
      totalDuration: 120,
      room: {
        _id: '680b5e6cfd53f1328c3e441b',
        name: 'Lab 101',
        capacity: 50,
        type: 'lab',
        department: 'Computer Science',
      },
      studentGroup: {
        _id: '680d46b6ce09d35d77c63bc7',
        department: 'Computer Science',
        year: 1,
        section: 'B',
        expectedEnrollment: 50,
      },
      createdBy: {
        _id: '66f1a2b3c4d5e6f789012360',
        username: 'teddy@gmail.com',
        name: 'teddy',
      },
      semester: '2024 semester 1',
      isDeleted: false,
      __v: 0,
    },
    {
      _id: '682cd7b9731af9564a7db0b7',
      activity: {
        _id: '682cd0445803081405b75023',
        course: {
          _id: '680fd644807f4747c23644c9',
          courseCode: 'CHEM101',
          name: 'General Chemistry',
        },
        lecture: {
          _id: '680b5e6cfd53f1328c3e4423',
          name: 'Prof. Johnson',
          maxLoad: 60,
        },
        studentGroup: {
          _id: '680d46b6ce09d35d77c63bc7',
          department: 'Computer Science',
          year: 1,
          section: 'B',
          expectedEnrollment: 50,
        },
        semester: '2024 semester 1',
        roomRequirement: 'lab' as const,
        totalDuration: 8,
        split: 2,
        createdBy: {
          _id: '66f1a2b3c4d5e6f789012360',
          username: 'teddy@gmail.com',
          name: 'teddy',
        },
        isDeleted: false,
      },
      reservedTimeslots: [
        {
          _id: '68279040dc0ea2f40419aa8c',
          day: 'Friday',
          startTime: '14:00',
          endTime: '15:00',
          duration: 60,
        },
        {
          _id: '68279040dc0ea2f40419aa8d',
          day: 'Friday',
          startTime: '15:00',
          endTime: '16:00',
          duration: 60,
        },
      ],
      totalDuration: 120,
      room: {
        _id: '680b5e6cfd53f1328c3e441c',
        name: 'Chemistry Lab',
        capacity: 40,
        type: 'lab',
        department: 'Chemistry',
      },
      studentGroup: {
        _id: '680d46b6ce09d35d77c63bc7',
        department: 'Computer Science',
        year: 1,
        section: 'B',
        expectedEnrollment: 50,
      },
      createdBy: {
        _id: '66f1a2b3c4d5e6f789012360',
        username: 'teddy@gmail.com',
        name: 'teddy',
      },
      semester: '2024 semester 1',
      isDeleted: false,
      __v: 0,
    },
  ],
};
