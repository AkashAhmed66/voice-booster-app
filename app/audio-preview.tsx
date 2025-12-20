import { AudioPlayer } from '@/components/ui/audio-player';
import { Button } from '@/components/ui/button';
import { API_BASE_URL } from '@/constants/api';
import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { downloadProcessedAudio } from '@/services/audio-api';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AudioPreviewScreen() {
  const { colorScheme } = useColorScheme();
  const colors = Colors[colorScheme || 'dark'];
  const router = useRouter();
  const params = useLocalSearchParams();
  const processType = params.processType as string; // 'denoise', 'boost', or 'demo'
  const originalUri = params.originalUri as string;
  const originalName = params.originalName as string;
  const processedUrl = params.processedUrl as string;
  
  const [originalSound, setOriginalSound] = useState<Audio.Sound | null>(null);
  const [processedSound, setProcessedSound] = useState<Audio.Sound | null>(null);
  const [isPlayingOriginal, setIsPlayingOriginal] = useState(false);
  const [isPlayingProcessed, setIsPlayingProcessed] = useState(false);
  const [originalPosition, setOriginalPosition] = useState(0);
  const [processedPosition, setProcessedPosition] = useState(0);
  const [originalDuration, setOriginalDuration] = useState(0);
  const [processedDuration, setProcessedDuration] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [processedLocalUri, setProcessedLocalUri] = useState<string | null>(null);
  const [isLoadingProcessed, setIsLoadingProcessed] = useState(false);

  // Download processed audio to private folder on mount
  useEffect(() => {
    const downloadProcessed = async () => {
      if (!processedUrl) return;

      try {
        setIsLoadingProcessed(true);
        
        // Create full URL by prepending API base URL
        const fullUrl = processedUrl.startsWith('http') 
          ? processedUrl 
          : `${API_BASE_URL}${processedUrl}`;
        
        // Download to private app directory
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const audioType = processType === 'denoise' ? 'denoised' : 'boosted';
        const fileName = `${audioType}_${timestamp}.wav`;
        const privateDir = `${FileSystem.documentDirectory}VoiceBooster/`;
        
        // Ensure directory exists
        const dirInfo = await FileSystem.getInfoAsync(privateDir);
        if (!dirInfo.exists) {
          await FileSystem.makeDirectoryAsync(privateDir, { intermediates: true });
        }

        const localPath = privateDir + fileName;
        
        // Download file
        await downloadProcessedAudio(fullUrl, privateDir, fileName);
        
        setProcessedLocalUri(localPath);
        setIsLoadingProcessed(false);
      } catch (error: any) {
        console.error('Error downloading processed audio:', error);
        setIsLoadingProcessed(false);
        Alert.alert('Download Failed', 'Failed to load processed audio for preview.');
      }
    };

    downloadProcessed();
  }, [processedUrl, processType]);

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

  const handleSave = async () => {
    if (!processedLocalUri) {
      Alert.alert('Error', 'No processed audio available to save');
      return;
    }

    try {
      setIsSaving(true);

      // Request permission to access media library
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant storage permission to save the enhanced audio.');
        setIsSaving(false);
        return;
      }

      // Save the already downloaded file to device's public media library
      const asset = await MediaLibrary.createAssetAsync(processedLocalUri);
      
      // Create or get the VoiceBooster album
      const album = await MediaLibrary.getAlbumAsync('VoiceBooster');
      if (album == null) {
        await MediaLibrary.createAlbumAsync('VoiceBooster', asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }

      setIsSaving(false);

      const audioType = processType === 'denoise' ? 'denoised' : 'boosted';

      Alert.alert(
        'Success!',
        `Your ${audioType} audio has been saved to the VoiceBooster album in your device gallery.`,
        [
          {
            text: 'View Files',
            onPress: () => router.replace('/(tabs)/output-files'),
          },
          {
            text: 'Done',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      console.error('Error saving audio:', error);
      setIsSaving(false);
      Alert.alert('Save Failed', error.message || 'Failed to save the enhanced audio. Please try again.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.card }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Audio Preview</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Original Audio Player */}
        <View style={[styles.audioCard, { backgroundColor: colors.card }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="musical-notes" size={24} color={colors.textSecondary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>Original Audio</Text>
          </View>
          {originalUri ? (
            <AudioPlayer 
              audioUri={originalUri}
              sound={originalSound}
              setSound={setOriginalSound}
              isPlaying={isPlayingOriginal}
              setIsPlaying={setIsPlayingOriginal}
              position={originalPosition}
              setPosition={setOriginalPosition}
              duration={originalDuration}
              setDuration={setOriginalDuration}
              volume={100}
            />
          ) : (
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No original audio available
            </Text>
          )}
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
          {isLoadingProcessed ? (
            <View style={styles.loadingContainer}>
              <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                Loading enhanced audio...
              </Text>
            </View>
          ) : processedLocalUri ? (
            <AudioPlayer 
              audioUri={processedLocalUri}
              sound={processedSound}
              setSound={setProcessedSound}
              isPlaying={isPlayingProcessed}
              setIsPlaying={setIsPlayingProcessed}
              position={processedPosition}
              setPosition={setProcessedPosition}
              duration={processedDuration}
              setDuration={setProcessedDuration}
              volume={100}
            />
          ) : (
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No enhanced audio available
            </Text>
          )}
        </View>

        {/* Save Button */}
        {processedLocalUri && !isLoadingProcessed && (
          <Button
            title={isSaving ? 'Saving...' : 'Save Enhanced Audio'}
            onPress={handleSave}
            disabled={isSaving}
            fullWidth
            icon={<Ionicons name="save" size={20} color={colors.background} />}
            style={styles.saveButton}
          />
        )}
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
  emptyText: {
    ...Typography.body,
    textAlign: 'center',
    padding: Spacing.lg,
  },
  loadingContainer: {
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...Typography.body,
    textAlign: 'center',
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
