import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';
import {
  ArrowLeft,
  Mail,
  MessageCircle,
  FileText,
  ChevronRight,
  ExternalLink,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export default function HelpCenterScreen() {
  const navigation = useNavigation();

  const HelpSection = ({
    icon,
    title,
    description,
    onPress,
  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity style={styles.helpSection} onPress={onPress}>
      <View style={styles.helpSectionHeader}>
        <View style={styles.iconContainer}>{icon}</View>
        <View style={styles.helpSectionContent}>
          <Text style={styles.helpSectionTitle}>{title}</Text>
          <Text style={styles.helpSectionDescription}>{description}</Text>
        </View>
      </View>
      <ChevronRight size={20} color={colors.gray[400]} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color={colors.gray[700]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help Center</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>How can we help you?</Text>

        <View style={styles.helpSectionsContainer}>
          <HelpSection
            icon={<MessageCircle size={24} color={colors.primary[500]} />}
            title="Contact Support"
            description="Get in touch with our support team"
            onPress={() => {}}
          />

          <HelpSection
            icon={<FileText size={24} color={colors.secondary[500]} />}
            title="Documentation"
            description="Read our user guides and tutorials"
            onPress={() => {}}
          />

          <HelpSection
            icon={<Mail size={24} color={colors.warning[500]} />}
            title="Email Us"
            description="Send us an email with your question"
            onPress={() => {}}
          />
        </View>

        <View style={styles.faqContainer}>
          <Text style={styles.faqTitle}>Frequently Asked Questions</Text>

          <View style={styles.faqList}>
            <TouchableOpacity style={styles.faqItem}>
              <Text style={styles.faqQuestion}>
                How do I mark attendance for a class?
              </Text>
              <ChevronRight size={16} color={colors.gray[400]} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.faqItem}>
              <Text style={styles.faqQuestion}>
                What should I do if a teacher is absent?
              </Text>
              <ChevronRight size={16} color={colors.gray[400]} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.faqItem}>
              <Text style={styles.faqQuestion}>
                How can I view past attendance records?
              </Text>
              <ChevronRight size={16} color={colors.gray[400]} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.faqItem}>
              <Text style={styles.faqQuestion}>
                Can I edit submitted attendance?
              </Text>
              <ChevronRight size={16} color={colors.gray[400]} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.supportCenter}>
          <Text style={styles.supportCenterText}>Visit our Support Center</Text>
          <ExternalLink size={16} color={colors.primary[500]} />
        </TouchableOpacity>
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
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: spacing[4],
  },
  sectionTitle: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold as any,
    color: colors.gray[900],
    marginBottom: spacing[4],
  },
  helpSectionsContainer: {
    gap: spacing[3],
    marginBottom: spacing[6],
  },
  helpSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing[4],
    backgroundColor: 'white',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  helpSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3],
  },
  helpSectionContent: {
    flex: 1,
  },
  helpSectionTitle: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold as any,
    color: colors.gray[900],
    marginBottom: spacing[1],
  },
  helpSectionDescription: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
  },
  faqContainer: {
    marginBottom: spacing[6],
  },
  faqTitle: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold as any,
    color: colors.gray[900],
    marginBottom: spacing[3],
  },
  faqList: {
    backgroundColor: 'white',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.gray[200],
    overflow: 'hidden',
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  faqQuestion: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.md,
    color: colors.gray[700],
    flex: 1,
    marginRight: spacing[2],
  },
  supportCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    paddingVertical: spacing[4],
  },
  supportCenterText: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium as any,
    color: colors.primary[500],
  },
});
