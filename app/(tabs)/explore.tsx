import { FeatureCard } from '@/components/ui/feature-card';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditorScreen() {
  const { colorScheme } = useColorScheme();
  const colors = Colors[colorScheme || 'dark'];
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { 
          backgroundColor: colorScheme === 'dark' ? 'rgba(168, 85, 247, 0.05)' : 'transparent',
          borderRadius: 12,
          padding: colorScheme === 'dark' ? 12 : 0
        }]}>
          <Text style={[styles.title, { color: colors.text }]}>Editor</Text>
          <Text style={[styles.subtitle, { color: colors.primary }]}>
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
    </SafeAreaView>
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
  },
  header: {
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.h2,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
  },
  toolsContainer: {
    gap: Spacing.sm,
  },
});
