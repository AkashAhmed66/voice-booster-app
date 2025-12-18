import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function SettingsScreen() {
  const { colorScheme, toggleColorScheme } = useTheme();
  const colors = Colors[colorScheme || 'dark'];
  const router = useRouter();

  const isDarkMode = colorScheme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.backgroundSecondary }]}>
        <View style={{ width: 40 }} />
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <Ionicons name="close" size={28} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>
            APPEARANCE
          </Text>
          
          <View style={[
            styles.settingCard,
            {
              backgroundColor: colors.card,
              borderColor: isDarkMode ? 'rgba(168, 85, 247, 0.2)' : colors.border,
              shadowColor: '#000',
            }
          ]}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: isDarkMode ? 'rgba(168, 85, 247, 0.15)' : 'rgba(168, 85, 247, 0.08)' },
                  ]}
                >
                  <Ionicons
                    name={isDarkMode ? 'moon' : 'sunny'}
                    size={24}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>
                    Dark Mode
                  </Text>
                  <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                    {isDarkMode ? 'Enabled' : 'Disabled'}
                  </Text>
                </View>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={toggleColorScheme}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.background}
                ios_backgroundColor={colors.border}
              />
            </View>
          </View>
        </View>

        {/* App Info Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>
            ABOUT
          </Text>
          
          <View style={[
            styles.settingCard,
            {
              backgroundColor: colors.card,
              borderColor: isDarkMode ? 'rgba(168, 85, 247, 0.2)' : colors.border,
              shadowColor: '#000',
            }
          ]}>
            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: isDarkMode ? 'rgba(147, 51, 234, 0.15)' : 'rgba(147, 51, 234, 0.08)' },
                  ]}
                >
                  <Ionicons name="information-circle" size={24} color={colors.primary} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>
                    App Version
                  </Text>
                  <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                    1.0.0
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Audio Settings Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>
            AUDIO
          </Text>
          
          <View style={[
            styles.settingCard,
            {
              backgroundColor: colors.card,
              borderColor: isDarkMode ? 'rgba(168, 85, 247, 0.2)' : colors.border,
              shadowColor: '#000',
            }
          ]}>
            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: isDarkMode ? 'rgba(192, 132, 252, 0.15)' : 'rgba(192, 132, 252, 0.08)' },
                  ]}
                >
                  <Ionicons name="musical-note" size={24} color={colors.primary} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>
                    Audio Quality
                  </Text>
                  <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                    High Quality
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: colors.backgroundSecondary },
                  ]}
                >
                  <Ionicons name="folder" size={24} color={colors.primary} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>
                    Output Format
                  </Text>
                  <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                    MP3
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            SUPPORT
          </Text>
          
          <View style={[
            styles.settingCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              shadowColor: '#000',
            }
          ]}>
            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: colors.backgroundSecondary },
                  ]}
                >
                  <Ionicons name="help-circle" size={24} color={colors.primary} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>
                    Help & Support
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: colors.backgroundSecondary },
                  ]}
                >
                  <Ionicons name="star" size={24} color={colors.primary} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>
                    Rate App
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: colors.backgroundSecondary },
                  ]}
                >
                  <Ionicons name="shield-checkmark" size={24} color={colors.primary} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>
                    Privacy Policy
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  headerTitle: {
    ...Typography.h3,
  },
  closeButton: {
    padding: 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.sm,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.caption,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: Spacing.md,
    marginLeft: Spacing.xs,
  },
  settingCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.sm,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    ...Typography.body,
    fontWeight: '600',
  },
  settingDescription: {
    ...Typography.bodySmall,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginLeft: Spacing.md + 48 + Spacing.md,
  },
});
