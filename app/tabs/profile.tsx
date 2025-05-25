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
  Moon,
  HelpCircle,
  User,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { RelativePathString, useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.message}>Please log in to view your profile</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <Animated.View
          style={styles.profileCard}
          entering={FadeInDown.duration(500)}
        >
          <View style={styles.avatarContainer}>
            {user.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarText}>
                  {user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.editAvatarButton}
              onPress={() =>
                router.push('screens/EditProfile' as RelativePathString)
              }
            >
              <User size={16} color={colors.primary[500]} />
            </TouchableOpacity>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userRole}>Class Representative</Text>

            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <MapPin size={16} color={colors.gray[500]} />
                <Text style={styles.detailText}>{user.department}</Text>
              </View>
              <View style={styles.detailRow}>
                <Mail size={16} color={colors.gray[500]} />
                <Text style={styles.detailText}>{user.class}</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <Animated.View
            style={styles.optionCard}
            entering={FadeInDown.duration(500).delay(200)}
          >
            <TouchableOpacity
              style={styles.option}
              onPress={() =>
                router.push('screens/EditProfile' as RelativePathString)
              }
            >
              <View style={styles.optionLeft}>
                <View
                  style={[
                    styles.optionIcon,
                    { backgroundColor: colors.primary[50] },
                  ]}
                >
                  <User size={20} color={colors.primary[500]} />
                </View>
                <Text style={styles.optionText}>Edit Profile</Text>
              </View>
              <ChevronRight size={20} color={colors.gray[400]} />
            </TouchableOpacity>

            <View style={styles.switchOption}>
              <View style={styles.optionLeft}>
                <View
                  style={[
                    styles.optionIcon,
                    { backgroundColor: colors.gray[200] },
                  ]}
                >
                  <Moon size={20} color={colors.gray[700]} />
                </View>
                <Text style={styles.optionText}>Dark Mode</Text>
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

            <TouchableOpacity
              style={styles.option}
              onPress={() =>
                router.push('screens/HelpCenter' as RelativePathString)
              }
            >
              <View style={styles.optionLeft}>
                <View
                  style={[
                    styles.optionIcon,
                    { backgroundColor: colors.warning[50] },
                  ]}
                >
                  <HelpCircle size={20} color={colors.warning[500]} />
                </View>
                <Text style={styles.optionText}>Help Center</Text>
              </View>
              <ChevronRight size={20} color={colors.gray[400]} />
            </TouchableOpacity>
          </Animated.View>
        </View>

        <Animated.View
          entering={FadeInDown.duration(500).delay(400)}
          style={styles.logoutContainer}
        >
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => signOut()}
          >
            <LogOut size={20} color={colors.error[500]} />
            <Text style={styles.logoutText}>Log Out</Text>
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
    marginHorizontal: spacing[3],
    marginVertical: spacing[2],
    padding: spacing[4],
    backgroundColor: 'white',
    borderRadius: borderRadius.xl,
    ...shadows.lg,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing[3],
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.primary[100],
  },
  avatarPlaceholder: {
    backgroundColor: colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.primary[100],
  },
  avatarText: {
    fontFamily: typography.fontFamily,
    fontWeight: typography.weights.bold as TextStyle['fontWeight'],
    fontSize: 32,
    color: colors.primary[700],
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontFamily: typography.fontFamily,
    fontWeight: typography.weights.bold as TextStyle['fontWeight'],
    fontSize: typography.sizes.xl,
    color: colors.gray[900],
    marginBottom: spacing[1],
  },
  userRole: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.md,
    color: colors.primary[600],
    fontWeight: typography.weights.medium as TextStyle['fontWeight'],
    marginBottom: spacing[2],
  },
  detailsContainer: {
    gap: spacing[2],
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  detailText: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
  },
  sectionContainer: {
    marginTop: spacing[4],
    marginHorizontal: spacing[3],
  },
  sectionTitle: {
    fontFamily: typography.fontFamily,
    fontWeight: typography.weights.semibold as TextStyle['fontWeight'],
    fontSize: typography.sizes.md,
    color: colors.gray[700],
    marginBottom: spacing[2],
  },
  optionCard: {
    backgroundColor: 'white',
    borderRadius: borderRadius.xl,
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
