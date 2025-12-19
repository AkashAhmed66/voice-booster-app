import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import React, { useEffect } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Waveform } from './waveform';

interface AudioPlayerProps {
  audioUri?: string;
  sound: Audio.Sound | null;
  setSound: (sound: Audio.Sound | null) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  position: number;
  setPosition: (pos: number) => void;
  duration: number;
  setDuration: (dur: number) => void;
  volume: number;
}

export function AudioPlayer({
  audioUri,
  sound,
  setSound,
  isPlaying,
  setIsPlaying,
  position,
  setPosition,
  duration,
  setDuration,
  volume,
}: AudioPlayerProps) {
  const { colorScheme } = useColorScheme();
  const colors = Colors[colorScheme || 'dark'];

  useEffect(() => {
    if (sound) {
      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.isLoaded) {
          setPosition(status.positionMillis);
          setDuration(status.durationMillis || 0);
          setIsPlaying(status.isPlaying);
          
          if (status.didJustFinish) {
            setIsPlaying(false);
            setPosition(0);
            // Reset the actual playback position so it can be replayed from the start
            await sound.setPositionAsync(0);
          }
        }
      });
    }
  }, [sound]);

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const loadAndPlayAudio = async () => {
    try {
      if (!audioUri) {
        Alert.alert('Error', 'No audio file selected');
        return;
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: true, volume: volume / 100 }
      );
      setSound(newSound);
      setIsPlaying(true);
    } catch (error) {
      console.error('Error loading audio:', error);
      Alert.alert('Error', 'Failed to load audio file');
    }
  };

  const handlePlayPause = async () => {
    try {
      if (!sound) {
        await loadAndPlayAudio();
        return;
      }

      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
    }
  };

  const handleSkipForward = async () => {
    if (sound) {
      const newPosition = Math.min(position + 10000, duration);
      await sound.setPositionAsync(newPosition);
    }
  };

  const handleSkipBackward = async () => {
    if (sound) {
      const newPosition = Math.max(position - 10000, 0);
      await sound.setPositionAsync(newPosition);
    }
  };

  const progress = duration > 0 ? (position / duration) * 100 : 0;

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
              { backgroundColor: colors.primary, width: `${progress}%` },
            ]}
          />
        </View>
      </View>

      {/* Playback Controls */}
      <View style={styles.controls}>
        <Text style={[styles.time, { color: colors.text }]}>{formatTime(position)}</Text>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.controlButton} onPress={handleSkipBackward}>
            <Ionicons name="play-back" size={32} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.playButton, { backgroundColor: colors.primary }]}
            onPress={handlePlayPause}
          >
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={36}
              color={colors.background}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={handleSkipForward}>
            <Ionicons name="play-forward" size={32} color={colors.text} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.time, { color: colors.text }]}>{formatTime(duration)}</Text>
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
