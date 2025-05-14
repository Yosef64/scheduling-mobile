import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {
  Search,
  Filter,
  UserCheck,
  UserX,
  Clock,
  UserCog,
} from 'lucide-react-native';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';
import { format, startOfDay, endOfDay, subDays, isSameDay } from 'date-fns';
import { mockAttendance } from '@/data/mockData';
import { Attendance } from '@/types';
import Animated, { AnimatedStyle, FadeInUp } from 'react-native-reanimated';

export default function AttendanceScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [attendance, setAttendance] = useState(mockAttendance);

  // Get attendance records from the last 30 days
  const thirtyDaysAgo = startOfDay(subDays(new Date(), 30));
  const today = endOfDay(new Date());

  const filteredAttendance = attendance
    .filter((record) => {
      const recordDate = new Date(record.date);
      return recordDate >= thirtyDaysAgo && recordDate <= today;
    })
    .filter((record) => {
      if (filterStatus === null) return true;
      return record.status === filterStatus;
    })
    .filter((record) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        record.teacherName.toLowerCase().includes(query) ||
        record.subjectName.toLowerCase().includes(query)
      );
    })
    .sort(
      (a, b) => new Date(b.markedAt).getTime() - new Date(a.markedAt).getTime()
    );

  const filterOptions = [
    { value: null, label: 'All', icon: null },
    {
      value: 'present',
      label: 'Present',
      icon: <UserCheck size={14} color={colors.success[500]} />,
    },
    {
      value: 'late',
      label: 'Late',
      icon: <Clock size={14} color={colors.warning[500]} />,
    },
    {
      value: 'absent',
      label: 'Absent',
      icon: <UserX size={14} color={colors.error[500]} />,
    },
    {
      value: 'substitute',
      label: 'Substitute',
      icon: <UserCog size={14} color={colors.secondary[500]} />,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return colors.success[500];
      case 'late':
        return colors.warning[500];
      case 'absent':
        return colors.error[500];
      case 'substitute':
        return colors.secondary[500];
      default:
        return colors.gray[500];
    }
  };

  const renderAttendanceItem = ({
    item,
    index,
  }: {
    item: Attendance;
    index: number;
  }) => {
    const isPending = item.status === 'pending';
    const isToday = isSameDay(new Date(item.date), new Date());

    return (
      <Animated.View
        entering={FadeInUp.delay(index * 50).duration(300)}
        style={styles.attendanceItem as ViewStyle}
      >
        <View style={styles.attendanceHeader as ViewStyle}>
          <Text style={styles.attendanceDate as TextStyle}>
            {format(new Date(item.date), 'EEE, MMM d, yyyy')}
            {isToday && ' (Today)'}
          </Text>
          {!isPending && (
            <View
              style={[
                styles.statusIndicator as ViewStyle,
                { backgroundColor: getStatusColor(item.status) },
              ]}
            >
              <Text style={styles.statusText as TextStyle}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.attendanceDetails as ViewStyle}>
          <Text style={styles.subjectName as TextStyle}>
            {item.subjectName}
          </Text>
          <Text style={styles.teacherName as TextStyle}>
            {item.teacherName}
          </Text>

          {!isPending && item.status === 'late' && (
            <Text style={styles.timeInfo as TextStyle}>
              Arrival: {item.arrivalTime}
            </Text>
          )}

          {item.notes && (
            <Text style={styles.notes as TextStyle}>Notes: {item.notes}</Text>
          )}
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container as ViewStyle}>
      <View style={styles.header as ViewStyle}>
        <Text style={styles.headerTitle as TextStyle}>Attendance Records</Text>

        <View style={styles.searchContainer as ViewStyle}>
          <Search
            size={20}
            color={colors.gray[400]}
            style={styles.searchIcon as ViewStyle}
          />
          <TextInput
            style={styles.searchInput as TextStyle}
            placeholder="Search by teacher or subject"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.filterOptions as ViewStyle}>
          <Filter
            size={18}
            color={colors.gray[700]}
            style={styles.filterIcon as ViewStyle}
          />
          <FlatList
            horizontal
            data={filterOptions}
            keyExtractor={(item) => item.value ?? 'all'}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.filterOption as ViewStyle,
                  filterStatus === item.value && {
                    backgroundColor: item.value
                      ? getStatusColor(item.value)
                      : colors.primary[500],
                  },
                ]}
                onPress={() => setFilterStatus(item.value)}
              >
                {item.icon}
                <Text
                  style={[
                    styles.filterText as TextStyle,
                    filterStatus === item.value && { color: 'white' },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>

      <FlatList
        data={filteredAttendance}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.attendanceList as ViewStyle}
        renderItem={renderAttendanceItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer as ViewStyle}>
            <Text style={styles.emptyText as TextStyle}>
              No attendance records found
            </Text>
          </View>
        }
      />
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
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  headerTitle: {
    fontFamily: typography.fontFamily,
    fontWeight: typography.weights.bold as TextStyle['fontWeight'],
    fontSize: typography.sizes.xl,
    color: colors.gray[900],
    marginBottom: spacing[2],
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing[2],
    marginBottom: spacing[2],
  },
  searchIcon: {
    marginRight: spacing[1],
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.md,
    color: colors.gray[800],
  },
  filterOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  filterIcon: {
    marginRight: spacing[1],
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    marginRight: spacing[1],
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray[200],
  },
  filterText: {
    fontFamily: typography.fontFamily,
    fontWeight: typography.weights.medium as TextStyle['fontWeight'],
    fontSize: typography.sizes.sm,
    color: colors.gray[700],
    marginLeft: spacing['0.5'],
  },
  attendanceList: {
    padding: spacing[2],
  },
  attendanceItem: {
    backgroundColor: 'white',
    borderRadius: borderRadius.lg,
    padding: spacing[2],
    marginBottom: spacing[2],
  },
  attendanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[1],
  },
  attendanceDate: {
    fontFamily: typography.fontFamily,
    fontWeight: typography.weights.medium as TextStyle['fontWeight'],
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
  },
  statusIndicator: {
    paddingHorizontal: spacing[1],
    paddingVertical: spacing['0.5'],
    borderRadius: borderRadius.full,
  },
  statusText: {
    fontFamily: typography.fontFamily,
    fontWeight: typography.weights.medium as TextStyle['fontWeight'],
    fontSize: typography.sizes.xs,
    color: 'white',
  },
  attendanceDetails: {
    marginTop: spacing[1],
  },
  subjectName: {
    fontFamily: typography.fontFamily,
    fontWeight: typography.weights.semibold as TextStyle['fontWeight'],
    fontSize: typography.sizes.md,
    color: colors.gray[900],
  },
  teacherName: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
    marginBottom: spacing[1],
  },
  timeInfo: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.sm,
    color: colors.warning[600],
    marginBottom: spacing['0.5'],
  },
  notes: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.sm,
    color: colors.gray[700],
    fontStyle: 'italic',
  },
  emptyContainer: {
    padding: spacing[4],
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.md,
    color: colors.gray[500],
    textAlign: 'center',
  },
});
