import api from './api';
import { ScheduleResponse, StudentGroup } from '@/types';

export const fetchSchedules = async (
  studentGroupId: string,
  semester: string,
  own: boolean = false
): Promise<ScheduleResponse> => {
  try {
    const response = await api.get(`/schedule/group/${studentGroupId}`, {
      params: {
        semester,
        own,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching schedules:', error);
    if (error.response?.status === 404) {
      // Return empty response with default values when no schedules found
      return {
        studentGroup: {
          _id: studentGroupId,
          department: 'Unknown',
          year: 0,
          section: 'N/A',
          expectedEnrollment: 0,
        },
        entries: [],
      };
    }
    throw error;
  }
};

export const fetchStudentGroups = async (): Promise<StudentGroup[]> => {
  try {
    const response = await api.get('/student-groups', {
      params: {
        isDeleted: false,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching student groups:', error);
    throw error;
  }
};

export const getCurrentSemester = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  // Assuming semesters are Fall (8-12) and Spring (1-7)
  return month >= 8 ? `Fall ${year}` : `Spring ${year}`;
};
