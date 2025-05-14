import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextStyle,
} from 'react-native';
import { format, addDays, isSameDay, isToday } from 'date-fns';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from 'lucide-react-native';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';
import Animated, { FadeIn } from 'react-native-reanimated';

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  onDateChange,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);

  // Create an array of 14 days (current + 13 more)
  const days = Array.from({ length: 14 }, (_, i) => {
    const date = addDays(new Date(), i - 7); // 7 days before and 6 days ahead
    return {
      date,
      dayName: format(date, 'EEE'),
      dayNumber: format(date, 'd'),
      isToday: isToday(date),
      isSelected: isSameDay(date, selectedDate),
    };
  });

  const handlePrevious = () => {
    const newDate = addDays(selectedDate, -1);
    onDateChange(newDate);
  };

  const handleNext = () => {
    const newDate = addDays(selectedDate, 1);
    onDateChange(newDate);
  };

  const handleDateSelect = (date: Date) => {
    onDateChange(date);
  };

  return (
    <Animated.View style={styles.container} entering={FadeIn.duration(500)}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.arrowButton} onPress={handlePrevious}>
          <ChevronLeft size={24} color={colors.gray[700]} />
        </TouchableOpacity>

        <View style={styles.dateContainer}>
          <CalendarIcon
            size={16}
            color={colors.primary[500]}
            style={styles.calendarIcon}
          />
          <Text style={styles.dateText}>
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </Text>
        </View>

        <TouchableOpacity style={styles.arrowButton} onPress={handleNext}>
          <ChevronRight size={24} color={colors.gray[700]} />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.daysContainer}
      >
        {days.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayButton,
              day.isSelected && styles.selectedDayButton,
            ]}
            onPress={() => handleDateSelect(day.date)}
          >
            <Text
              style={[styles.dayName, day.isSelected && styles.selectedDayText]}
            >
              {day.dayName}
            </Text>
            <View
              style={[
                styles.dayNumberContainer,
                day.isToday && styles.todayContainer,
                day.isSelected && styles.selectedDayNumberContainer,
              ]}
            >
              <Text
                style={[
                  styles.dayNumber,
                  day.isToday && styles.todayText,
                  day.isSelected && styles.selectedDayText,
                ]}
              >
                {day.dayNumber}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingVertical: spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[3],
    marginBottom: spacing[2],
  },
  arrowButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarIcon: {
    marginRight: spacing[1],
  },
  dateText: {
    fontFamily: typography.fontFamily,
    fontWeight: typography.weights.semibold as TextStyle['fontWeight'],
    fontSize: typography.sizes.md,
    color: colors.gray[900],
  },
  daysContainer: {
    paddingHorizontal: spacing[2],
  },
  dayButton: {
    alignItems: 'center',
    marginHorizontal: spacing[1],
    paddingHorizontal: spacing[1],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.md,
  },
  selectedDayButton: {
    backgroundColor: colors.primary[50],
  },
  dayName: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.xs,
    color: colors.gray[500],
    marginBottom: spacing['0.5'],
  },
  dayNumberContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayContainer: {
    backgroundColor: colors.gray[100],
  },
  selectedDayNumberContainer: {
    backgroundColor: colors.primary[500],
  },
  dayNumber: {
    fontFamily: typography.fontFamily,
    fontWeight: typography.weights.medium as TextStyle['fontWeight'],
    fontSize: typography.sizes.md,
    color: colors.gray[900],
  },
  todayText: {
    fontWeight: typography.weights.bold as TextStyle['fontWeight'],
  },
  selectedDayText: {
    color: colors.primary[900],
  },
});
