import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface VolumeSliderProps {
  value: number;
  onValueChange: (value: number) => void;
  label?: string;
  showPercentage?: boolean;
  minIcon?: keyof typeof Ionicons.glyphMap;
  maxIcon?: keyof typeof Ionicons.glyphMap;
}

export function VolumeSlider({
  value,
  onValueChange,
  label = 'Adjust Volume',
  showPercentage = true,
  minIcon = 'volume-low',
  maxIcon = 'volume-high',
}: VolumeSliderProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.backgroundSecondary, borderColor: colors.border },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        {showPercentage && (
          <Text style={[styles.percentage, { color: colors.text }]}>
            {Math.round(value)}%
          </Text>
        )}
      </View>

      <View style={styles.sliderContainer}>
        <Ionicons name={minIcon} size={24} color={colors.textSecondary} />
        <View style={styles.sliderWrapper}>
          <View style={[styles.track, { backgroundColor: colors.border }]}>
            <View
              style={[
                styles.fill,
                {
                  backgroundColor: colors.primary,
                  width: `${value}%`,
                },
              ]}
            />
          </View>
        </View>
        <Ionicons name={maxIcon} size={24} color={colors.textSecondary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.h4,
  },
  percentage: {
    ...Typography.h4,
    fontWeight: '700',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  sliderWrapper: {
    flex: 1,
  },
  track: {
    height: 6,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
});
