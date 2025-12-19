import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
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
  const { colorScheme } = useColorScheme();
  const colors = Colors[colorScheme || 'dark'];

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
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            value={value}
            onValueChange={onValueChange}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.border}
            thumbTintColor={colors.primary}
          />
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
  slider: {
    width: '100%',
    height: 40,
  },
});
