import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';
import { StatisticsCard } from '@/components/StatisticsCard';
import { mockAttendance, mockSchedules } from '@/data/mockData';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  subMonths,
  subWeeks,
  subDays,
} from 'date-fns';
import { Calendar } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

const timeRanges = [
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'This Month' },
  { id: 'lastWeek', label: 'Last Week' },
  { id: 'lastMonth', label: 'Last Month' },
];

export default function StatisticsScreen() {
  const [selectedRange, setSelectedRange] = useState('week');

  // Calculate date ranges
  const today = new Date();
  const dateRanges = {
    week: {
      start: startOfWeek(today, { weekStartsOn: 1 }),
      end: endOfWeek(today, { weekStartsOn: 1 }),
      label: 'This Week',
    },
    month: {
      start: startOfMonth(today),
      end: endOfMonth(today),
      label: 'This Month',
    },
    lastWeek: {
      start: startOfWeek(subWeeks(today, 1), { weekStartsOn: 1 }),
      end: endOfWeek(subWeeks(today, 1), { weekStartsOn: 1 }),
      label: 'Last Week',
    },
    lastMonth: {
      start: startOfMonth(subMonths(today, 1)),
      end: endOfMonth(subMonths(today, 1)),
      label: 'Last Month',
    },
  };

  // Filter attendance data by date range
  const currentRange = dateRanges[selectedRange as keyof typeof dateRanges];
  const filteredAttendance = mockAttendance.filter((a) => {
    const date = new Date(a.date);
    return date >= currentRange.start && date <= currentRange.end;
  });

  // Group attendance by teacher
  const teacherAttendance: Record<string, typeof mockAttendance> = {};

  filteredAttendance.forEach((record) => {
    if (!teacherAttendance[record.teacherId]) {
      teacherAttendance[record.teacherId] = [];
    }
    teacherAttendance[record.teacherId].push(record);
  });

  // Get top subjects with attendance issues
  const subjectIssues = Object.values(
    filteredAttendance
      .filter((a) => a.status === 'late' || a.status === 'absent')
      .reduce<Record<string, { name: string; count: number }>>(
        (acc, record) => {
          if (!acc[record.subjectName]) {
            acc[record.subjectName] = { name: record.subjectName, count: 0 };
          }
          acc[record.subjectName].count += 1;
          return acc;
        },
        {}
      )
  )
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  return (
    <SafeAreaView style={styles.container as ViewStyle}>
      <View style={styles.header as ViewStyle}>
        <Text style={styles.headerTitle as TextStyle}>
          Attendance Statistics
        </Text>
        <Text style={styles.headerSubtitle as TextStyle}>
          {format(currentRange.start, 'MMM d, yyyy')} -{' '}
          {format(currentRange.end, 'MMM d, yyyy')}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.timeRangeContainer as ViewStyle}
      >
        {timeRanges.map((range, index) => (
          <TouchableOpacity
            key={range.id}
            style={[
              styles.timeRangeButton as ViewStyle,
              selectedRange === range.id &&
                (styles.selectedTimeRange as ViewStyle),
            ]}
            onPress={() => setSelectedRange(range.id)}
          >
            <Calendar
              size={16}
              color={selectedRange === range.id ? 'white' : colors.gray[600]}
            />
            <Text
              style={[
                styles.timeRangeText as TextStyle,
                selectedRange === range.id &&
                  (styles.selectedTimeRangeText as TextStyle),
              ]}
            >
              {range.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.content as ViewStyle}
        contentContainerStyle={styles.contentContainer as ViewStyle}
      >
        {/* Overall statistics */}
        <Animated.View entering={FadeIn.duration(500)}>
          <StatisticsCard
            attendance={filteredAttendance}
            title="Overall Attendance"
          />
        </Animated.View>

        {/* Teacher statistics */}
        {Object.entries(teacherAttendance).map(
          ([teacherId, records], index) => {
            const teacher = mockSchedules.find(
              (s) => s.teacher.id === teacherId
            )?.teacher;
            if (!teacher) return null;

            return (
              <StatisticsCard
                key={teacherId}
                attendance={records}
                title={`${teacher.name} (${teacher.subject})`}
                delay={100 * (index + 1)}
              />
            );
          }
        )}

        {/* Issues section */}
        {subjectIssues.length > 0 && (
          <Animated.View
            style={styles.issuesContainer as ViewStyle}
            entering={FadeIn.duration(500).delay(300)}
          >
            <Text style={styles.issuesTitle as TextStyle}>
              Top Attendance Issues
            </Text>

            {subjectIssues.map((subject, index) => (
              <View key={index} style={styles.issueItem as ViewStyle}>
                <Text style={styles.issueName as TextStyle}>
                  {subject.name}
                </Text>
                <Text style={styles.issueCount as TextStyle}>
                  {subject.count} issue{subject.count !== 1 ? 's' : ''}
                </Text>
              </View>
            ))}
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  header: {
    paddingHorizontal: spacing[3],
    paddingTop: spacing[4],
    paddingBottom: spacing[2],
    backgroundColor: 'white',
  },
  headerTitle: {
    fontFamily: typography.fontFamily,
    fontWeight: typography.weights.bold as TextStyle['fontWeight'],
    fontSize: typography.sizes.xl,
    color: colors.gray[900],
  },
  headerSubtitle: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.sm,
    color: colors.gray[500],
    marginTop: spacing['0.5'],
  },
  timeRangeContainer: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  timeRangeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    marginRight: spacing[2],
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray[200],
  },
  selectedTimeRange: {
    backgroundColor: colors.primary[500],
  },
  timeRangeText: {
    fontFamily: typography.fontFamily,
    fontWeight: typography.weights.medium as TextStyle['fontWeight'],
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
    marginLeft: spacing['0.5'],
  },
  selectedTimeRangeText: {
    color: 'white',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing[3],
  },
  issuesContainer: {
    backgroundColor: 'white',
    borderRadius: borderRadius.lg,
    padding: spacing[3],
    marginBottom: spacing[3],
  },
  issuesTitle: {
    fontFamily: typography.fontFamily,
    fontWeight: typography.weights.semibold as TextStyle['fontWeight'],
    fontSize: typography.sizes.lg,
    color: colors.gray[900],
    marginBottom: spacing[2],
  },
  issueItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing[1],
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  issueName: {
    fontFamily: typography.fontFamily,
    fontWeight: typography.weights.medium as TextStyle['fontWeight'],
    fontSize: typography.sizes.md,
    color: colors.gray[800],
  },
  issueCount: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.md,
    color: colors.error[500],
    fontWeight: typography.weights.medium as TextStyle['fontWeight'],
  },
});
