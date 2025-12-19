import { AudioPlayer } from '@/components/ui/audio-player';
import { VolumeSlider } from '@/components/ui/slider';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PlayerScreen() {
  const { colorScheme } = useColorScheme();
  const colors = Colors[colorScheme || 'dark'];
  const router = useRouter();
  const params = useLocalSearchParams();
  const audioUri = params.audioUri as string;
  const fileName = params.fileName as string;
  const [volume, setVolume] = useState(100);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const handleVolumeChange = async (newVolume: number) => {
    setVolume(newVolume);
    if (sound) {
      await sound.setVolumeAsync(newVolume / 100);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right', 'bottom']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.backgroundSecondary }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Preview</Text>
        <TouchableOpacity onPress={() => router.push('/premium')}>
          <Ionicons name="trophy" size={24} color={colors.accent} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Audio Player */}
        <View style={styles.playerContainer}>
          <AudioPlayer 
            audioUri={audioUri}
            sound={sound}
            setSound={setSound}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            position={position}
            setPosition={setPosition}
            duration={duration}
            setDuration={setDuration}
            volume={volume}
          />
        </View>

        {/* Volume Control */}
        <View style={styles.volumeContainer}>
          <VolumeSlider value={volume} onValueChange={handleVolumeChange} />
        </View>
      </ScrollView>
    </SafeAreaView>
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
  backButton: {
    padding: 0,
  },
  headerTitle: {
    ...Typography.h3,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.sm,
  },
  playerContainer: {
    marginBottom: Spacing.lg,
  },
  volumeContainer: {
    marginBottom: Spacing.lg,
  },
});
