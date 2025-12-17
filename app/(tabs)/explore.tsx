import { FeatureCard } from '@/components/ui/feature-card';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function EditorScreen() {
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
          <Text style={[styles.title, { color: colors.text }]}>Editor</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Audio editing tools
          </Text>
        </View>

        {/* Editor Tools */}
        <View style={styles.toolsContainer}>
          <FeatureCard
            title="Audio Converter"
            icon={<Ionicons name="swap-horizontal" size={28} color={colors.accent} />}
            onPress={() => router.push('/converter')}
            backgroundColor={colors.card}
          />

          <FeatureCard
            title="Audio Cutter"
            icon={<Ionicons name="cut" size={28} color={colors.primary} />}
            onPress={() => router.push('/cutter')}
            backgroundColor={colors.card}
          />

          <FeatureCard
            title="Merge Audio"
            icon={<Ionicons name="git-merge" size={28} color={colors.primary} />}
            onPress={() => router.push('/merge')}
            backgroundColor={colors.card}
          />

          <FeatureCard
            title="Audio Equalizer"
            icon={<Ionicons name="options" size={28} color={colors.accent} />}
            onPress={() => router.push('/equalizer')}
            backgroundColor={colors.card}
          />

          <FeatureCard
            title="Pitch Shifter"
            icon={<Ionicons name="arrow-up-circle" size={28} color={colors.primary} />}
            onPress={() => router.push('/pitch')}
            backgroundColor={colors.card}
          />

          <FeatureCard
            title="Speed Changer"
            icon={<Ionicons name="speedometer" size={28} color={colors.accent} />}
            onPress={() => router.push('/speed')}
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
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.h1,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
  },
  toolsContainer: {
    gap: Spacing.md,
  },
});
