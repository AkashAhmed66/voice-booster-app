import { FeatureCard } from '@/components/ui/feature-card';
import { Waveform } from '@/components/ui/waveform';
import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme || 'dark'];
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>Voice Booster</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Enhance your audio quality
            </Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={[styles.headerButton, { backgroundColor: colors.backgroundSecondary }]}
              onPress={() => router.push('/settings')}
            >
              <Ionicons name="settings" size={24} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.headerButton, { backgroundColor: colors.backgroundSecondary }]}
              onPress={() => router.push('/premium')}
            >
              <Ionicons name="trophy" size={24} color={colors.accent} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Demo Audio Card */}
        <View
          style={[
            styles.demoCard,
            {
              backgroundColor: colorScheme === 'dark' ? 'rgba(168, 85, 247, 0.05)' : 'rgba(168, 85, 247, 0.03)',
              borderColor: colors.primaryLight,
              borderWidth: 1,
            },
          ]}
        >
          <View style={styles.demoHeader}>
            <Waveform height={60} width={200} />
            <Text style={[styles.demoTitle, { color: colors.accent }]}>
              Play Demo Audio
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.playButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/player')}
          >
            <Ionicons name="play" size={32} color={colors.background} />
          </TouchableOpacity>
        </View>

        {/* Feature Cards */}
        <View style={styles.featuresContainer}>
          <FeatureCard
            title="Noise Reducer"
            icon={<Ionicons name="mic-off" size={28} color={colors.primary} />}
            onPress={() => router.push('/noise-reducer')}
            backgroundColor={colors.card}
          />

          <FeatureCard
            title="Split Music & Vocal"
            icon={<Ionicons name="musical-notes" size={28} color={colors.primary} />}
            onPress={() => router.push('/split-audio')}
            backgroundColor={colors.card}
          />

          <FeatureCard
            title="Record Audio"
            icon={<Ionicons name="mic" size={28} color={colors.accent} />}
            onPress={() => router.push('/record')}
            backgroundColor={colors.card}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.sm,
    paddingTop: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingHorizontal: 0,
  },
  title: {
    ...Typography.h2,
    fontWeight: '700',
    marginBottom: Spacing.xs,
    letterSpacing: -0.5,
  },
  subtitle: {
    ...Typography.body,
    opacity: 0.7,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  headerButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  demoCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  demoHeader: {
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  demoTitle: {
    ...Typography.h4,
    marginTop: Spacing.sm,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  featuresContainer: {
    gap: Spacing.sm,
  },
});

