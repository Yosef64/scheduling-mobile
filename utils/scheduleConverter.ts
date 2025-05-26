import { Schedule, ClassSchedule, Teacher } from '@/types';

export function convertToClassSchedule(schedule: Schedule): ClassSchedule[] {
  if (schedule.reservedTimeslots.length === 0) return [];

  // Sort timeslots by day and start time
  const sortedTimeslots = [...schedule.reservedTimeslots].sort((a, b) => {
    const keyA = `${a.day}-${a.startTime}`;
    const keyB = `${b.day}-${b.startTime}`;
    return keyA.localeCompare(keyB);
  });

  // Group timeslots by day
  const groupedByDay = sortedTimeslots.reduce((acc, timeslot) => {
    if (!acc[timeslot.day]) {
      acc[timeslot.day] = [];
    }
    acc[timeslot.day].push(timeslot);
    return acc;
  }, {} as Record<string, typeof sortedTimeslots>);

  const teacher: Teacher = {
    _id: schedule.activity.lecture._id,
    name: schedule.activity.lecture.name,
    department: schedule.room.department,
    subject: schedule.activity.course.name,
  };

  // Create a schedule for each day with its timeslots
  return Object.entries(groupedByDay).map(([day, timeslots]) => {
    // Sort timeslots for this day by start time
    const dayTimeslots = timeslots.sort((a, b) => {
      // Convert times to minutes for proper numerical comparison
      const getMinutes = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
      };
      return getMinutes(a.startTime) - getMinutes(b.startTime);
    });

    // Get earliest start time and latest end time
    const firstTimeslot = dayTimeslots[0];
    const lastTimeslot = dayTimeslots[dayTimeslots.length - 1];

    return {
      _id: `${schedule._id}-${day}`,
      course: schedule.activity.course,
      teacher,
      room: schedule.room.name,
      day: day,
      startTime: firstTimeslot.startTime,
      endTime: lastTimeslot.endTime,
      classGroup: schedule.activity.studentGroup,
      createdBy: schedule.createdBy,
    };
  });
}
