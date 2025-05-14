import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch,
  ViewStyle,
  ImageStyle,
  TextStyle,
} from 'react-native';
import {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
} from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import {
  LogOut,
  ChevronRight,
  Bell,
  Moon,
  Settings,
  HelpCircle,
  User,
  Shield,
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  if (!user) {
    return (
      <SafeAreaView style={styles.container as ViewStyle}>
        <View style={styles.centered as ViewStyle}>
          <Text style={styles.message as TextStyle}>
            Please log in to view your profile
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container as ViewStyle}>
      <ScrollView>
        <View style={styles.header as ViewStyle}>
          <Text style={styles.headerTitle as TextStyle}>Profile</Text>
        </View>

        <Animated.View
          style={styles.profileCard as ViewStyle}
          entering={FadeInDown.duration(500)}
        >
          {user.avatar ? (
            <Image
              source={{ uri: user.avatar }}
              style={styles.avatar as ImageStyle}
            />
          ) : (
            <View
              style={[
                styles.avatar as ViewStyle,
                styles.avatarPlaceholder as ViewStyle,
              ]}
            >
              <Text style={styles.avatarText as TextStyle}>
                {user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </Text>
            </View>
          )}

          <View style={styles.userInfo as ViewStyle}>
            <Text style={styles.userName as TextStyle}>{user.name}</Text>
            <Text style={styles.userRole as TextStyle}>
              Class Representative
            </Text>
            <Text style={styles.userDetails as TextStyle}>
              {user.class} • {user.department}
            </Text>
          </View>
        </Animated.View>

        <View style={styles.sectionContainer as ViewStyle}>
          <Text style={styles.sectionTitle as TextStyle}>Account</Text>

          <Animated.View
            style={styles.optionCard as ViewStyle}
            entering={FadeInDown.duration(500).delay(100)}
          >
            <TouchableOpacity style={styles.option as ViewStyle}>
              <View style={styles.optionLeft as ViewStyle}>
                <View
                  style={[
                    styles.optionIcon as ViewStyle,
                    { backgroundColor: colors.primary[50] },
                  ]}
                >
                  <User size={20} color={colors.primary[500]} />
                </View>
                <Text style={styles.optionText as TextStyle}>Edit Profile</Text>
              </View>
              <ChevronRight size={20} color={colors.gray[400]} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.option as ViewStyle}>
              <View style={styles.optionLeft as ViewStyle}>
                <View
                  style={[
                    styles.optionIcon as ViewStyle,
                    { backgroundColor: colors.secondary[50] },
                  ]}
                >
                  <Shield size={20} color={colors.secondary[500]} />
                </View>
                <Text style={styles.optionText as TextStyle}>
                  Privacy and Security
                </Text>
              </View>
              <ChevronRight size={20} color={colors.gray[400]} />
            </TouchableOpacity>
          </Animated.View>
        </View>

        <View style={styles.sectionContainer as ViewStyle}>
          <Text style={styles.sectionTitle as TextStyle}>Preferences</Text>

          <Animated.View
            style={styles.optionCard as ViewStyle}
            entering={FadeInDown.duration(500).delay(200)}
          >
            <View style={styles.switchOption as ViewStyle}>
              <View style={styles.optionLeft as ViewStyle}>
                <View
                  style={[
                    styles.optionIcon as ViewStyle,
                    { backgroundColor: colors.accent[50] },
                  ]}
                >
                  <Bell size={20} color={colors.accent[500]} />
                </View>
                <Text style={styles.optionText as TextStyle}>
                  Notifications
                </Text>
              </View>
              <Switch
                trackColor={{
                  false: colors.gray[300],
                  true: colors.primary[300],
                }}
                thumbColor={colors.primary[500]}
                value={true}
              />
            </View>

            <View style={styles.switchOption as ViewStyle}>
              <View style={styles.optionLeft as ViewStyle}>
                <View
                  style={[
                    styles.optionIcon as ViewStyle,
                    { backgroundColor: colors.gray[200] },
                  ]}
                >
                  <Moon size={20} color={colors.gray[700]} />
                </View>
                <Text style={styles.optionText as TextStyle}>Dark Mode</Text>
              </View>
              <Switch
                trackColor={{
                  false: colors.gray[300],
                  true: colors.primary[300],
                }}
                thumbColor={colors.gray[500]}
                value={false}
              />
            </View>
          </Animated.View>
        </View>

        <View style={styles.sectionContainer as ViewStyle}>
          <Text style={styles.sectionTitle as TextStyle}>Support</Text>

          <Animated.View
            style={styles.optionCard as ViewStyle}
            entering={FadeInDown.duration(500).delay(300)}
          >
            <TouchableOpacity style={styles.option as ViewStyle}>
              <View style={styles.optionLeft as ViewStyle}>
                <View
                  style={[
                    styles.optionIcon as ViewStyle,
                    { backgroundColor: colors.warning[50] },
                  ]}
                >
                  <HelpCircle size={20} color={colors.warning[500]} />
                </View>
                <Text style={styles.optionText as TextStyle}>Help Center</Text>
              </View>
              <ChevronRight size={20} color={colors.gray[400]} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.option as ViewStyle}>
              <View style={styles.optionLeft as ViewStyle}>
                <View
                  style={[
                    styles.optionIcon as ViewStyle,
                    { backgroundColor: colors.secondary[50] },
                  ]}
                >
                  <Settings size={20} color={colors.secondary[500]} />
                </View>
                <Text style={styles.optionText as TextStyle}>App Settings</Text>
              </View>
              <ChevronRight size={20} color={colors.gray[400]} />
            </TouchableOpacity>
          </Animated.View>
        </View>

        <Animated.View
          entering={FadeInDown.duration(500).delay(400)}
          style={styles.logoutContainer as ViewStyle}
        >
          <TouchableOpacity
            style={styles.logoutButton as ViewStyle}
            onPress={() => signOut()}
          >
            <LogOut size={20} color={colors.error[500]} />
            <Text style={styles.logoutText as TextStyle}>Log Out</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.lg,
    color: colors.gray[600],
  },
  header: {
    paddingHorizontal: spacing[3],
    paddingTop: spacing[4],
    paddingBottom: spacing[2],
  },
  headerTitle: {
    fontFamily: typography.fontFamily,
    fontWeight: typography.weights.bold as TextStyle['fontWeight'],
    fontSize: typography.sizes.xl,
    color: colors.gray[900],
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing[3],
    marginVertical: spacing[2],
    padding: spacing[3],
    backgroundColor: 'white',
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: spacing[3],
  },
  avatarPlaceholder: {
    backgroundColor: colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: typography.fontFamily,
    fontWeight: typography.weights.bold as TextStyle['fontWeight'],
    fontSize: 24,
    color: colors.primary[700],
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: typography.fontFamily,
    fontWeight: typography.weights.bold as TextStyle['fontWeight'],
    fontSize: typography.sizes.lg,
    color: colors.gray[900],
    marginBottom: spacing['0.5'],
  },
  userRole: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.sm,
    color: colors.primary[600],
    fontWeight: typography.weights.medium as TextStyle['fontWeight'],
    marginBottom: spacing['0.5'],
  },
  userDetails: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.sm,
    color: colors.gray[500],
  },
  sectionContainer: {
    marginTop: spacing[3],
    marginHorizontal: spacing[3],
  },
  sectionTitle: {
    fontFamily: typography.fontFamily,
    fontWeight: typography.weights.semibold as TextStyle['fontWeight'],
    fontSize: typography.sizes.md,
    color: colors.gray[700],
    marginBottom: spacing[1],
  },
  optionCard: {
    backgroundColor: 'white',
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  switchOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[2],
  },
  optionText: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.md,
    color: colors.gray[800],
  },
  logoutContainer: {
    marginTop: spacing[6],
    marginBottom: spacing[8],
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    backgroundColor: colors.error[50],
    borderRadius: borderRadius.full,
  },
  logoutText: {
    fontFamily: typography.fontFamily,
    fontWeight: typography.weights.medium as TextStyle['fontWeight'],
    fontSize: typography.sizes.md,
    color: colors.error[500],
    marginLeft: spacing[1],
  },
});
