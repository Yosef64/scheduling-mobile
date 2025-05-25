import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
} from 'react-native';
import {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
} from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Camera, User } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export default function EditProfileScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const handleSave = () => {
    // TODO: Implement save functionality
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color={colors.gray[700]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.avatarSection}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarText}>
                {user?.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </Text>
            </View>
          )}
          <TouchableOpacity style={styles.changePhotoButton}>
            <Camera size={20} color={colors.primary[500]} />
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              placeholderTextColor={colors.gray[400]}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor={colors.gray[400]}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              placeholderTextColor={colors.gray[400]}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Some information like your class and department can only be
              changed by the administrator.
            </Text>
          </View>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  backButton: {
    padding: spacing[2],
    marginLeft: -spacing[2],
  },
  headerTitle: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold as any,
    color: colors.gray[900],
  },
  saveButton: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.full,
  },
  saveButtonText: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium as any,
    color: colors.primary[600],
  },
  content: {
    flex: 1,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: spacing[6],
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: spacing[4],
    borderWidth: 3,
    borderColor: colors.primary[100],
  },
  avatarPlaceholder: {
    backgroundColor: colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: typography.fontFamily,
    fontSize: 40,
    fontWeight: typography.weights.bold as any,
    color: colors.primary[700],
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[2],
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.full,
    gap: spacing[1],
  },
  changePhotoText: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium as any,
    color: colors.primary[600],
  },
  form: {
    padding: spacing[4],
    gap: spacing[4],
  },
  inputGroup: {
    gap: spacing[1],
  },
  label: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium as any,
    color: colors.gray[700],
    marginLeft: spacing[1],
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.gray[200],
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.md,
    color: colors.gray[900],
  },
  infoBox: {
    backgroundColor: colors.gray[100],
    padding: spacing[3],
    borderRadius: borderRadius.lg,
  },
  infoText: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
    lineHeight: 20,
  },
});
