import { FeatureCard } from '@/components/ui/feature-card';
import { Waveform } from '@/components/ui/waveform';
import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
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
          <TouchableOpacity
            style={[styles.crownButton, { backgroundColor: colors.backgroundSecondary }]}
            onPress={() => router.push('/premium')}
          >
            <Ionicons name="trophy" size={24} color={colors.accent} />
          </TouchableOpacity>
        </View>

        {/* Demo Audio Card */}
        <View
          style={[
            styles.demoCard,
            {
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.border,
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
    padding: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.h1,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
  },
  crownButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  demoCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    borderWidth: 1,
  },
  demoHeader: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  demoTitle: {
    ...Typography.h4,
    marginTop: Spacing.md,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  featuresContainer: {
    gap: Spacing.md,
  },
});

