import React from 'react';
import { View, Text, StyleSheet, TextStyle } from 'react-native';
import { Attendance } from '@/types';
import {
  colors,
  spacing,
  borderRadius,
  shadows,
  typography,
} from '@/constants/theme';
import { UserCheck, UserX, Clock, UserCog } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface StatisticsCardProps {
  attendance: Attendance[];
  title: string;
  delay?: number;
}

export const StatisticsCard: React.FC<StatisticsCardProps> = ({
  attendance,
  title,
  delay = 0,
}) => {
  // Calculate statistics
  const total = attendance.length;
  const present = attendance.filter((a) => a.status === 'present').length;
  const late = attendance.filter((a) => a.status === 'late').length;
  const absent = attendance.filter((a) => a.status === 'absent').length;
  const substitute = attendance.filter((a) => a.status === 'substitute').length;

  // Calculate percentages
  const presentPercent = total > 0 ? Math.round((present / total) * 100) : 0;
  const latePercent = total > 0 ? Math.round((late / total) * 100) : 0;
  const absentPercent = total > 0 ? Math.round((absent / total) * 100) : 0;
  const substitutePercent =
    total > 0 ? Math.round((substitute / total) * 100) : 0;

  return (
    <Animated.View
      style={styles.container}
      entering={FadeInUp.duration(500).delay(delay)}
    >
      <Text style={styles.title}>{title}</Text>

      <View style={styles.barContainer}>
        {present > 0 && (
          <View
            style={[
              styles.bar,
              {
                backgroundColor: colors.success[500],
                width: `${presentPercent}%`,
              },
            ]}
          />
        )}
        {late > 0 && (
          <View
            style={[
              styles.bar,
              {
                backgroundColor: colors.warning[500],
                width: `${latePercent}%`,
              },
            ]}
          />
        )}
        {absent > 0 && (
          <View
            style={[
              styles.bar,
              {
                backgroundColor: colors.error[500],
                width: `${absentPercent}%`,
              },
            ]}
          />
        )}
        {substitute > 0 && (
          <View
            style={[
              styles.bar,
              {
                backgroundColor: colors.secondary[500],
                width: `${substitutePercent}%`,
              },
            ]}
          />
        )}
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <View
            style={[styles.statIcon, { backgroundColor: colors.success[100] }]}
          >
            <UserCheck size={16} color={colors.success[600]} />
          </View>
          <View>
            <Text style={styles.statLabel}>Present</Text>
            <View style={styles.statValueContainer}>
              <Text style={styles.statValue}>{present}</Text>
              <Text style={styles.statPercent}>{presentPercent}%</Text>
            </View>
          </View>
        </View>

        <View style={styles.statItem}>
          <View
            style={[styles.statIcon, { backgroundColor: colors.warning[100] }]}
          >
            <Clock size={16} color={colors.warning[600]} />
          </View>
          <View>
            <Text style={styles.statLabel}>Late</Text>
            <View style={styles.statValueContainer}>
              <Text style={styles.statValue}>{late}</Text>
              <Text style={styles.statPercent}>{latePercent}%</Text>
            </View>
          </View>
        </View>

        <View style={styles.statItem}>
          <View
            style={[styles.statIcon, { backgroundColor: colors.error[100] }]}
          >
            <UserX size={16} color={colors.error[600]} />
          </View>
          <View>
            <Text style={styles.statLabel}>Absent</Text>
            <View style={styles.statValueContainer}>
              <Text style={styles.statValue}>{absent}</Text>
              <Text style={styles.statPercent}>{absentPercent}%</Text>
            </View>
          </View>
        </View>

        <View style={styles.statItem}>
          <View
            style={[
              styles.statIcon,
              { backgroundColor: colors.secondary[100] },
            ]}
          >
            <UserCog size={16} color={colors.secondary[600]} />
          </View>
          <View>
            <Text style={styles.statLabel}>Substitute</Text>
            <View style={styles.statValueContainer}>
              <Text style={styles.statValue}>{substitute}</Text>
              <Text style={styles.statPercent}>{substitutePercent}%</Text>
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: borderRadius.lg,
    padding: spacing[3],
    marginBottom: spacing[3],
    ...shadows.md,
  },
  title: {
    fontFamily: typography.fontFamily,
    fontWeight: typography.weights.semibold as TextStyle['fontWeight'],
    fontSize: typography.sizes.lg,
    color: colors.gray[900],
    marginBottom: spacing[2],
  },
  barContainer: {
    height: 8,
    backgroundColor: colors.gray[200],
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: spacing[3],
  },
  bar: {
    height: '100%',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: spacing[2],
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[1],
  },
  statLabel: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.xs,
    color: colors.gray[500],
  },
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  statValue: {
    fontFamily: typography.fontFamily,
    fontWeight: typography.weights.semibold as TextStyle['fontWeight'],
    fontSize: typography.sizes.md,
    color: colors.gray[900],
    marginRight: spacing['0.5'],
  },
  statPercent: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.xs,
    color: colors.gray[500],
  },
});
