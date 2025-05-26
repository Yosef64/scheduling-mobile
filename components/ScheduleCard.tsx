import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextStyle,
  Modal,
  Dimensions,
} from 'react-native';
import { ClassSchedule, AttendanceStatus } from '@/types';
import {
  colors,
  spacing,
  borderRadius,
  shadows,
  typography,
} from '@/constants/theme';
import {
  Clock,
  MapPin,
  UserCheck,
  UserX,
  UserCog,
  MoreVertical,
  Calendar,
  AlertCircle,
} from 'lucide-react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { rescheduleClass } from '@/services/scheduleService';
import Toast from 'react-native-toast-message';

interface ScheduleCardProps {
  schedule: ClassSchedule;
  status?: AttendanceStatus;
  onPress: (schedule: ClassSchedule) => void;
}

const DropdownMenu: React.FC<{
  visible: boolean;
  onClose: () => void;
  onOptionSelect: (option: string) => void;
}> = ({ visible, onClose, onOptionSelect }) => {
  const options = [
    { label: 'Mark Attendance', value: 'attendance' },
    { label: 'Ask Reschedule', value: 'reschedule' },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.dropdown}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={styles.dropdownItem}
              onPress={() => {
                onOptionSelect(option.value);
                onClose();
              }}
            >
              <Text style={styles.dropdownText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

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

interface CustomAlertProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity
        style={styles.alertOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <Animated.View
          entering={FadeInDown.duration(300).springify()}
          style={styles.alertContainer}
        >
          <View style={styles.alertIconContainer}>
            <Calendar size={32} color={colors.primary[500]} />
          </View>

          <Text style={styles.alertTitle}>{title}</Text>
          <Text style={styles.alertMessage}>{message}</Text>

          <View style={styles.alertButtonsContainer}>
            <TouchableOpacity
              style={[styles.alertButton, styles.alertCancelButton]}
              onPress={onClose}
            >
              <Text
                style={[styles.alertButtonText, styles.alertCancelButtonText]}
              >
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.alertButton, styles.alertConfirmButton]}
              onPress={() => {
                onConfirm();
                onClose();
              }}
            >
              <Text
                style={[styles.alertButtonText, styles.alertConfirmButtonText]}
              >
                Request
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

export const ScheduleCard: React.FC<ScheduleCardProps> = ({
  schedule,
  status,
  onPress,
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);

  const handleOptionSelect = (option: string) => {
    if (option === 'reschedule') {
      setAlertVisible(true);
    } else if (option === 'attendance') {
      onPress(schedule);
    }
  };

  const handleRescheduleConfirm = async () => {
    try {
      await rescheduleClass(schedule);
      Toast.show({
        text1: 'Reschedule request sent',
        type: 'success',
        position: 'bottom',
      });
    } catch (error: any) {
      Toast.show({
        text1: 'Error rescheduling class',
        text2: error?.response?.data.message || 'Unknown error',
        type: 'error',
        position: 'bottom',
      });
    }
  };

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

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setDropdownVisible(true)}
        >
          <MoreVertical size={20} color={colors.gray[600]} />
        </TouchableOpacity>

        <StatusBadge status={status} />

        <DropdownMenu
          visible={dropdownVisible}
          onClose={() => setDropdownVisible(false)}
          onOptionSelect={handleOptionSelect}
        />

        <CustomAlert
          visible={alertVisible}
          onClose={() => setAlertVisible(false)}
          onConfirm={handleRescheduleConfirm}
          title="Request Reschedule"
          message={`Would you like to request rescheduling ${schedule.course.name} class scheduled for ${schedule.startTime} - ${schedule.endTime}?`}
        />
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
  menuButton: {
    position: 'absolute',
    top: spacing[2],
    right: spacing[2],
    padding: spacing[1],
    zIndex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
  },
  dropdown: {
    backgroundColor: 'white',
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingVertical: spacing[2],
    ...shadows.lg,
  },
  dropdownItem: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
  },
  dropdownText: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.md,
    color: colors.gray[800],
  },
  alertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    backgroundColor: 'white',
    borderRadius: borderRadius.xl,
    padding: spacing[4],
    width: Dimensions.get('window').width - spacing[8],
    alignItems: 'center',
    ...shadows.xl,
  },
  alertIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  alertTitle: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold as TextStyle['fontWeight'],
    color: colors.gray[900],
    marginBottom: spacing[2],
    textAlign: 'center',
  },
  alertMessage: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.md,
    color: colors.gray[600],
    marginBottom: spacing[4],
    textAlign: 'center',
    lineHeight: 24,
  },
  alertButtonsContainer: {
    flexDirection: 'row',
    gap: spacing[3],
    width: '100%',
  },
  alertButton: {
    flex: 1,
    paddingVertical: spacing['1.5'],
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertCancelButton: {
    backgroundColor: colors.gray[100],
  },
  alertConfirmButton: {
    backgroundColor: colors.primary[500],
  },
  alertButtonText: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold as TextStyle['fontWeight'],
  },
  alertCancelButtonText: {
    color: colors.gray[700],
  },
  alertConfirmButtonText: {
    color: 'white',
  },
});
