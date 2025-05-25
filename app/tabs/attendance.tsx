import React, { useState, useEffect, useCallback } from 'react';
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
  RefreshControl,
} from 'react-native';
import {
  Search,
  Filter,
  UserCheck,
  UserX,
  Clock,
  UserCog,
  AlertCircle,
} from 'lucide-react-native';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';
import { format, startOfDay, endOfDay, subDays, isSameDay } from 'date-fns';
import { Attendance, AttendanceStatus } from '@/types';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { getAttendances } from '@/services/attendanceService';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import Toast from 'react-native-toast-message';
import { useAuth } from '@/contexts/AuthContext';

export default function AttendanceScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<AttendanceStatus | null>(
    null
  );

  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const loadAttendanceData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      const response = await getAttendances(user?._id!);
      console.log(response.length);

      setAttendance(response);
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Error loading attendance',
        text2: err?.request?.data?.message || 'Failed to load attendance data',
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAttendanceData();
  }, [loadAttendanceData]);

  const handleRefresh = () => {
    console.log('refreshing');
    loadAttendanceData(true);
  };

  // Get attendance records from the last 30 days
  const thirtyDaysAgo = startOfDay(subDays(new Date(), 30));
  const today = endOfDay(new Date());

  const filteredAttendance = attendance
    // .filter((record) => {
    //   const recordDate = new Date(record.date);
    //   return recordDate >= thirtyDaysAgo && recordDate <= today;
    // })
    .filter((record) => {
      if (filterStatus === null) return true;
      return record.status === filterStatus;
    })
    .filter((record) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        record.teacher.name.toLowerCase().includes(query) ||
        record.course.name.toLowerCase().includes(query)
      );
    })
    .sort(
      (a, b) => new Date(b.markedAt).getTime() - new Date(a.markedAt).getTime()
    );

  const filterOptions = [
    { value: null, label: 'All', icon: null },
    {
      value: 'present' as AttendanceStatus,
      label: 'Present',
      icon: (
        <UserCheck
          size={14}
          color={filterStatus === 'present' ? 'white' : colors.success[500]}
        />
      ),
    },
    {
      value: 'late' as AttendanceStatus,
      label: 'Late',
      icon: (
        <Clock
          size={14}
          color={filterStatus === 'late' ? 'white' : colors.warning[500]}
        />
      ),
    },
    {
      value: 'absent' as AttendanceStatus,
      label: 'Absent',
      icon: (
        <UserX
          size={14}
          color={filterStatus === 'absent' ? 'white' : colors.error[500]}
        />
      ),
    },
    {
      value: 'substitute' as AttendanceStatus,
      label: 'Substitute',
      icon: (
        <UserCog
          size={14}
          color={
            filterStatus === 'substitute' ? 'white' : colors.secondary[500]
          }
        />
      ),
    },
  ];

  const getStatusColor = (status: AttendanceStatus) => {
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
            {item.course.name}
          </Text>
          <Text style={styles.teacherName as TextStyle}>
            {item.teacher.name}
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

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <LoadingSpinner size={50} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <AlertCircle size={40} color={colors.error[500]} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => loadAttendanceData()}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Attendance Records</Text>

        <View style={styles.searchContainer}>
          <Search
            size={20}
            color={colors.gray[400]}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by teacher or subject"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.filterOptions}>
          <Filter
            size={18}
            color={colors.gray[700]}
            style={styles.filterIcon}
          />
          <FlatList
            horizontal
            data={filterOptions}
            keyExtractor={(item) => item.value ?? 'all'}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.filterOption,
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
                    styles.filterText,
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
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.attendanceList}
        renderItem={renderAttendanceItem}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary[500]]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No attendance records found</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[4],
  },
  errorText: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.lg,
    color: colors.gray[700],
    textAlign: 'center',
    marginTop: spacing[2],
    marginBottom: spacing[4],
  },
  retryButton: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.md,
  },
  retryButtonText: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium as TextStyle['fontWeight'],
    color: 'white',
  },
});
