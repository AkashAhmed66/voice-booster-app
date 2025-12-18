import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface WaveformProps {
  data?: number[];
  color?: string;
  height?: number;
  width?: number;
  barWidth?: number;
  barGap?: number;
  animated?: boolean;
}

export function Waveform({
  data,
  color,
  height = 100,
  width = 300,
  barWidth = 3,
  barGap = 2,
  animated = false,
}: WaveformProps) {
  const { colorScheme } = useColorScheme();
  const colors = Colors[colorScheme || 'dark'];
  
  // Generate random waveform data if not provided (for static demo)
  const waveformData = data || Array.from({ length: 50 }, () => Math.random());
  const waveColor = color || colors?.accent || Colors.dark.accent;

  return (
    <View style={[styles.container, { height, width }]}>
      {waveformData.map((value, index) => {
        const barHeight = value * height;
        return (
          <View
            key={index}
            style={[
              styles.bar,
              {
                height: barHeight,
                width: barWidth,
                backgroundColor: waveColor,
                marginRight: barGap,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bar: {
    borderRadius: 2,
  },
});
