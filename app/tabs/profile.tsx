import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  TextStyle,
  Platform,
  Linking,
  ActivityIndicator,
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
  User,
  Mail,
  MapPin,
  Download,
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { RelativePathString, useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import Toast from 'react-native-toast-message';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadSchedule = async () => {
    if (!user) return;

    setIsDownloading(true);
    try {
      // Replace this URL with your actual API endpoint
      const url = `https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalender-2020.pdf`;

      const filename = `schedule_${new Date().getTime()}.pdf`;
      const result = await FileSystem.downloadAsync(
        url,
        FileSystem.documentDirectory + filename
      );
      console.log(result.status);

      if (result.status === 201) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Schedule downloaded successfully',
          position: 'bottom',
          visibilityTime: 3000,
        });

        if (Platform.OS === 'ios') {
          await Linking.openURL(result.uri);
        }
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to download schedule',
        position: 'bottom',
        visibilityTime: 3000,
      });
    } finally {
      setIsDownloading(false);
    }
  };

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
      <ScrollView showsVerticalScrollIndicator={false}>
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
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userRole}>Class Representative</Text>

            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Text style={styles.detailText}>
                  {user.studentGroup.department} year {user.studentGroup.year}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(500).delay(200)}
          style={styles.actionsContainer}
        >
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDownloadSchedule}
            disabled={isDownloading}
          >
            <View
              style={[
                styles.actionIcon,
                { backgroundColor: colors.primary[50] },
              ]}
            >
              {isDownloading ? (
                <ActivityIndicator size="small" color={colors.primary[600]} />
              ) : (
                <Download size={20} color={colors.primary[600]} />
              )}
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>
                {isDownloading ? 'Downloading...' : 'Download Schedule'}
              </Text>
              <Text style={styles.actionSubtitle}>
                Get your schedule as PDF
              </Text>
            </View>
            <ChevronRight size={20} color={colors.gray[400]} />
          </TouchableOpacity>
        </Animated.View>

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
      <Toast />
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
    padding: spacing[2],
    backgroundColor: 'white',
    borderRadius: borderRadius.xl,
    ...shadows.sm,
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[3],
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
  actionsContainer: {
    marginTop: spacing[4],
    marginHorizontal: spacing[3],
    backgroundColor: 'white',
    borderRadius: borderRadius.xl,
    ...shadows.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3],
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium as TextStyle['fontWeight'],
    color: colors.gray[900],
  },
  actionSubtitle: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.sm,
    color: colors.gray[500],
    marginTop: 2,
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
