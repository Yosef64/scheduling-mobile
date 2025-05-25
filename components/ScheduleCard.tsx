import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextStyle,
} from 'react-native';
import { ClassSchedule, AttendanceStatus } from '@/types';
import {
  colors,
  spacing,
  borderRadius,
  shadows,
  typography,
} from '@/constants/theme';
import { Clock, MapPin, UserCheck, UserX, UserCog } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

interface ScheduleCardProps {
  schedule: ClassSchedule;
  status?: AttendanceStatus;
  onPress: (schedule: ClassSchedule) => void;
}

const StatusBadge: React.FC<{ status?: AttendanceStatus }> = ({ status }) => {
  if (!status || status === 'pending') return null;

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

  const getStatusText = (status: AttendanceStatus) => {
    switch (status) {
      case 'present':
        return 'Present';
      case 'late':
        return 'Late';
      case 'absent':
        return 'Absent';
      case 'substitute':
        return 'Substitute';
      default:
        return 'Unknown';
    }
  };

  const getStatusIcon = (status: AttendanceStatus) => {
    switch (status) {
      case 'present':
        return <UserCheck size={14} color="white" />;
      case 'late':
        return <Clock size={14} color="white" />;
      case 'absent':
        return <UserX size={14} color="white" />;
      case 'substitute':
        return <UserCog size={14} color="white" />;
      default:
        return null;
    }
  };

  return (
    <View style={[styles.badge, { backgroundColor: getStatusColor(status) }]}>
      {getStatusIcon(status)}
      <Text style={styles.badgeText}>{getStatusText(status)}</Text>
    </View>
  );
};

export const ScheduleCard: React.FC<ScheduleCardProps> = ({
  schedule,
  status,
  onPress,
}) => {
  return (
    <Animated.View entering={FadeIn.duration(500)}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => onPress(schedule)}
        activeOpacity={0.7}
      >
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{schedule.startTime}</Text>
          <View style={styles.timeDivider} />
          <Text style={styles.timeText}>{schedule.endTime}</Text>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.subjectText}>{schedule.course.name}</Text>

          <View style={styles.teacherContainer}>
            {schedule.teacher.avatar ? (
              <Image
                source={{ uri: schedule.teacher.avatar }}
                style={styles.avatar}
              />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarText}>
                  {schedule.teacher.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </Text>
              </View>
            )}
            <Text style={styles.teacherText}>{schedule.teacher.name}</Text>
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <MapPin size={14} color={colors.gray[500]} />
              <Text style={styles.detailText}>{schedule.room}</Text>
            </View>

            <View style={styles.detailItem}>
              <Clock size={14} color={colors.gray[500]} />
              <Text style={styles.detailText}>
                {schedule.startTime} - {schedule.endTime}
              </Text>
            </View>
          </View>
        </View>

        <StatusBadge status={status} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: borderRadius.lg,
    padding: spacing[2],
    marginBottom: spacing[2],
    ...shadows.md,
  },
  timeContainer: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[2],
  },
  timeText: {
    fontFamily: typography.fontFamily,
    fontWeight: typography.weights.medium as TextStyle['fontWeight'],
    fontSize: typography.sizes.sm,
    color: colors.gray[700],
  },
  timeDivider: {
    width: 2,
    height: 16,
    backgroundColor: colors.gray[300],
    marginVertical: spacing['0.5'],
  },
  contentContainer: {
    flex: 1,
  },
  subjectText: {
    fontFamily: typography.fontFamily,
    fontWeight: typography.weights.semibold as TextStyle['fontWeight'],
    fontSize: typography.sizes.md,
    color: colors.gray[900],
    marginBottom: spacing['0.5'],
  },
  teacherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[1],
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: spacing['0.5'],
  },
  avatarPlaceholder: {
    backgroundColor: colors.primary[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: typography.sizes.xs,
    color: colors.primary[700],
    fontWeight: typography.weights.bold as TextStyle['fontWeight'],
  },
  teacherText: {
    fontFamily: typography.fontFamily,
    fontWeight: typography.weights.medium as TextStyle['fontWeight'],
    fontSize: typography.sizes.sm,
    color: colors.gray[700],
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing[2],
  },
  detailText: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.xs,
    color: colors.gray[500],
    marginLeft: 4,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[1],
    paddingVertical: spacing['0.5'],
    borderRadius: borderRadius.full,
    position: 'absolute',
    top: spacing[1],
    right: spacing[1],
  },
  badgeText: {
    fontFamily: typography.fontFamily,
    fontWeight: typography.weights.medium as TextStyle['fontWeight'],
    fontSize: 10,
    color: 'white',
    marginLeft: 4,
  },
});
