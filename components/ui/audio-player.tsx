import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Waveform } from './waveform';

interface AudioPlayerProps {
  title?: string;
  duration?: string;
  currentTime?: string;
}

export function AudioPlayer({
  title = 'Demo Audio',
  duration = '00:00:08',
  currentTime = '00:00:04',
}: AudioPlayerProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <View style={styles.container}>
      {/* Waveform */}
      <View style={styles.waveformContainer}>
        <Waveform height={120} width={340} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
          <View
            style={[
              styles.progressFill,
              { backgroundColor: colors.primary, width: '50%' },
            ]}
          />
        </View>
      </View>

      {/* Playback Controls */}
      <View style={styles.controls}>
        <Text style={[styles.time, { color: colors.text }]}>{currentTime}</Text>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="play-back" size={32} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.playButton, { backgroundColor: colors.primary }]}
            onPress={() => setIsPlaying(!isPlaying)}
          >
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={36}
              color={colors.background}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="play-forward" size={32} color={colors.text} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.time, { color: colors.text }]}>{duration}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  waveformContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  progressContainer: {
    marginBottom: Spacing.lg,
  },
  progressBar: {
    height: 4,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  controlButton: {
    padding: Spacing.sm,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  time: {
    ...Typography.bodySmall,
    fontWeight: '600',
  },
});
