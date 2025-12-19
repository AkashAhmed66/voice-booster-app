import { AudioPlayer } from '@/components/ui/audio-player';
import { Button } from '@/components/ui/button';
import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AudioPreviewScreen() {
  const { colorScheme } = useColorScheme();
  const colors = Colors[colorScheme || 'dark'];
  const router = useRouter();
  const params = useLocalSearchParams();
  const processType = params.processType as string; // 'denoise' or 'boost'
  
  const [originalSound, setOriginalSound] = useState<Audio.Sound | null>(null);
  const [processedSound, setProcessedSound] = useState<Audio.Sound | null>(null);
  const [isPlayingOriginal, setIsPlayingOriginal] = useState(false);
  const [isPlayingProcessed, setIsPlayingProcessed] = useState(false);
  const [originalPosition, setOriginalPosition] = useState(0);
  const [processedPosition, setProcessedPosition] = useState(0);
  const [originalDuration, setOriginalDuration] = useState(0);
  const [processedDuration, setProcessedDuration] = useState(0);

  useEffect(() => {
    return () => {
      if (originalSound) {
        originalSound.unloadAsync();
      }
      if (processedSound) {
        processedSound.unloadAsync();
      }
    };
  }, [originalSound, processedSound]);

  const handleSave = () => {
    const audioType = processType === 'demo' ? 'demo' : processType === 'denoise' ? 'denoised' : 'boosted';
    Alert.alert(
      'Save Enhanced Audio',
      `Your ${audioType} audio has been saved successfully!`,
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right', 'bottom']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.backgroundSecondary }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {processType === 'demo' ? 'Demo' : processType === 'denoise' ? 'Denoised' : 'Boosted'} Preview
        </Text>
        <TouchableOpacity onPress={() => router.push('/premium')}>
          <Ionicons name="trophy" size={24} color={colors.accent} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Comparison Header */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Compare Results
        </Text>
        <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
          Listen to the difference between original and enhanced audio
        </Text>

        {/* Original Audio Player */}
        <View style={[styles.audioCard, { backgroundColor: colors.card }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="musical-notes" size={24} color={colors.textSecondary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>Original Audio</Text>
          </View>
          <AudioPlayer 
            audioUri="" // For now using empty, replace with actual URI
            sound={originalSound}
            setSound={setOriginalSound}
            isPlaying={isPlayingOriginal}
            setIsPlaying={setIsPlayingOriginal}
            position={originalPosition}
            setPosition={setOriginalPosition}
            duration={originalDuration}
            setDuration={setOriginalDuration}
          />
        </View>

        {/* Processed Audio Player */}
        <View style={[styles.audioCard, { 
          backgroundColor: colors.card,
          borderColor: processType === 'denoise' ? colors.primary : colors.accent,
          borderWidth: 2,
        }]}>
          <View style={styles.cardHeader}>
            <Ionicons 
              name={processType === 'denoise' ? 'cut' : 'mic-circle'} 
              size={24} 
              color={processType === 'denoise' ? colors.primary : colors.accent} 
            />
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              {processType === 'denoise' ? 'Denoised' : 'Boosted'} Audio
            </Text>
            <View style={[styles.badge, { 
              backgroundColor: processType === 'denoise' 
                ? colors.primary + '20' 
                : colors.accent + '20' 
            }]}>
              <Text style={[styles.badgeText, { 
                color: processType === 'denoise' ? colors.primary : colors.accent 
              }]}>
                Enhanced
              </Text>
            </View>
          </View>
          <AudioPlayer 
            audioUri="" // For now using empty, replace with actual URI
            sound={processedSound}
            setSound={setProcessedSound}
            isPlaying={isPlayingProcessed}
            setIsPlaying={setIsPlayingProcessed}
            position={processedPosition}
            setPosition={setProcessedPosition}
            duration={processedDuration}
            setDuration={setProcessedDuration}
          />
        </View>

        {/* Save Button */}
        <Button
          title="Save Enhanced Audio"
          onPress={handleSave}
          fullWidth
          icon={<Ionicons name="save" size={20} color={colors.background} />}
          style={styles.saveButton}
        />
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
    padding: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h2,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  sectionSubtitle: {
    ...Typography.body,
    marginBottom: Spacing.lg,
  },
  audioCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  cardTitle: {
    ...Typography.h4,
    fontWeight: '600',
    flex: 1,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  badgeText: {
    ...Typography.bodySmall,
    fontWeight: '600',
    fontSize: 12,
  },
  saveButton: {
    marginBottom: Spacing.lg,
  },
});
