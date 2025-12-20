import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { boostAudio, BoostMode } from '@/services/audio-api';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VoiceBoosterScreen() {
  const { colorScheme } = useColorScheme();
  const colors = Colors[colorScheme || 'dark'];
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<{ uri: string; name: string } | null>(null);
  const [isCancelled, setIsCancelled] = useState(false);

  const getRecordingsDirectory = async () => {
    const folderName = 'VoiceBooster';
    const recordingsDir = `${FileSystem.documentDirectory!}${folderName}/`;
    
    // Check if directory exists, if not create it
    const dirInfo = await FileSystem.getInfoAsync(recordingsDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(recordingsDir, { intermediates: true });
      console.log('Created recordings directory:', recordingsDir);
    }
    
    return recordingsDir;
  };

  const pickAudioFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setSelectedFile({
          uri: file.uri,
          name: file.name,
        });
        Alert.alert('File Selected', `${file.name} is ready for processing`);
      }
    } catch (error) {
      console.error('Error picking file:', error);
      Alert.alert('Error', 'Failed to select audio file');
    }
  };

  const handleProcess = async () => {
    if (!selectedFile) {
      Alert.alert('No File Selected', 'Please select an audio file first');
      return;
    }

    setProcessing(true);
    setProgress(0);
    setIsCancelled(false);

    try {
      // Simulate progress for upload (0-30%)
      const uploadInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 2, 30));
      }, 100);

      // Call the boost API
      const response = await boostAudio(
        selectedFile.uri,
        '1' as BoostMode // Default to moderate boost, you can add UI to select this
      );

      clearInterval(uploadInterval);
      
      if (isCancelled) {
        setProcessing(false);
        return;
      }

      setProgress(100);

      // Navigate to preview with both original and processed URLs
      setTimeout(() => {
        setProcessing(false);
        setProgress(0);
        router.push({
          pathname: '/audio-preview',
          params: {
            processType: 'boost',
            originalUri: selectedFile.uri,
            originalName: selectedFile.name,
            processedUrl: response.processed_audio,
            responseId: response.id,
          },
        });
      }, 500);
    } catch (error: any) {
      console.error('Error processing audio:', error);
      setProcessing(false);
      setProgress(0);
      Alert.alert(
        'Processing Failed',
        error.message || 'Failed to process audio. Please try again.'
      );
    }
  };

  const handleCancel = () => {
    setIsCancelled(true);
    setProcessing(false);
    setProgress(0);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right', 'bottom']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.backgroundSecondary }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Voice Booster</Text>
        <TouchableOpacity onPress={() => router.push('/premium')}>
          <Ionicons name="trophy" size={24} color={colors.accent} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {processing ? (
          // Processing View
          <View style={[styles.processingContainer, {
            backgroundColor: colorScheme === 'dark' 
              ? 'rgba(168, 85, 247, 0.05)' 
              : 'rgba(168, 85, 247, 0.03)',
            borderRadius: 16,
            padding: Spacing.lg
          }]}>
            <View style={[styles.progressCircle, {
              borderColor: colors.accent,
              backgroundColor: colorScheme === 'dark'
                ? 'rgba(168, 85, 247, 0.1)'
                : 'rgba(168, 85, 247, 0.05)'
            }]}>
              <Text style={[styles.progressText, { color: colors.accent }]}>
                {progress.toFixed(0)}%
              </Text>
            </View>

            <Text style={[styles.processingTitle, { color: colors.text }]}>
              Amplify your voice!
            </Text>
            <Text style={[styles.processingSubtitle, { color: colors.accent }]}>
              Let us boost your audio for powerful sounds!
            </Text>

            <Button
              title="Cancel"
              onPress={handleCancel}
              variant="outline"
              style={styles.cancelButton}
            />

            <Text style={[styles.warningText, { color: colors.textTertiary }]}>
              ⚠️ Please do not lock the screen or switch to other apps.
            </Text>
          </View>
        ) : (
          // Upload View
          <View>
            {/* Upload Card */}
            <Card style={styles.uploadCard}>
              <View style={styles.uploadContent}>
                <Ionicons name="cloud-upload-outline" size={80} color={colors.accent} />
                <Text style={[styles.uploadTitle, { color: colors.text }]}>
                  {selectedFile ? 'File Selected' : 'Select Audio File'}
                </Text>
                <Text style={[styles.uploadSubtitle, { color: colors.textSecondary }]}>
                  {selectedFile ? selectedFile.name : 'Choose an audio file from your device'}
                </Text>
                <Button
                  title={selectedFile ? 'Change File' : 'Browse Files'}
                  onPress={pickAudioFile}
                  style={styles.browseButton}
                />
              </View>
            </Card>

            {/* Info Cards */}
            <View style={styles.infoContainer}>
              <Text style={[styles.infoTitle, { color: colors.text }]}>How it works</Text>

              <Card
                style={
                  [
                    styles.infoCard,
                    {
                      borderColor: colorScheme === 'dark' ? 'rgba(168, 85, 247, 0.2)' : colors.border,
                    },
                  ] as any
                }
              >
                <View style={styles.infoItem}>
                  <View
                    style={[
                      styles.infoIcon,
                      { 
                        backgroundColor: colorScheme === 'dark'
                          ? 'rgba(168, 85, 247, 0.15)'
                          : 'rgba(168, 85, 247, 0.1)'
                      },
                    ]}
                  >
                    <Ionicons name="document-text" size={24} color={colors.accent} />
                  </View>
                  <View style={styles.infoText}>
                    <Text style={[styles.infoItemTitle, { color: colors.text }]}>
                      1. Upload Audio
                    </Text>
                    <Text style={[styles.infoItemText, { color: colors.textSecondary }]}>
                      Select the audio file you want to enhance
                    </Text>
                  </View>
                </View>
              </Card>

              <Card style={styles.infoCard}>
                <View style={styles.infoItem}>
                  <View
                    style={[
                      styles.infoIcon,
                      { backgroundColor: colors.accent + '20' },
                    ]}
                  >
                    <Ionicons name="settings" size={24} color={colors.accent} />
                  </View>
                  <View style={styles.infoText}>
                    <Text style={[styles.infoItemTitle, { color: colors.text }]}>
                      2. AI Processing
                    </Text>
                    <Text style={[styles.infoItemText, { color: colors.textSecondary }]}>
                      Our AI amplifies voice levels automatically
                    </Text>
                  </View>
                </View>
              </Card>

              <Card style={styles.infoCard}>
                <View style={styles.infoItem}>
                  <View
                    style={[
                      styles.infoIcon,
                      { backgroundColor: colors.accent + '20' },
                    ]}
                  >
                    <Ionicons name="checkmark-circle" size={24} color={colors.accent} />
                  </View>
                  <View style={styles.infoText}>
                    <Text style={[styles.infoItemTitle, { color: colors.text }]}>
                      3. Download Result
                    </Text>
                    <Text style={[styles.infoItemText, { color: colors.textSecondary }]}>
                      Get your amplified audio file
                    </Text>
                  </View>
                </View>
              </Card>
            </View>

            {/* Boost Button */}
            <Button
              title="Boost Voice"
              onPress={handleProcess}
              fullWidth
              icon={<Ionicons name="mic-circle" size={20} color={colors.background} />}
            />
          </View>
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
    padding: Spacing.sm,
  },
  uploadCard: {
    marginBottom: Spacing.lg,
  },
  uploadContent: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  uploadTitle: {
    ...Typography.h3,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  uploadSubtitle: {
    ...Typography.body,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  browseButton: {
    marginTop: Spacing.md,
  },
  infoContainer: {
    marginBottom: Spacing.lg,
  },
  infoTitle: {
    ...Typography.h3,
    marginBottom: Spacing.sm,
  },
  infoCard: {
    marginBottom: Spacing.sm,
    padding: Spacing.sm,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  infoIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
  },
  infoItemTitle: {
    ...Typography.h4,
    marginBottom: Spacing.xs,
  },
  infoItemText: {
    ...Typography.bodySmall,
  },
  processingContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  progressCircle: {
    width: 180,
    height: 180,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 8,
  },
  progressText: {
    ...Typography.h1,
    fontSize: 48,
  },
  processingTitle: {
    ...Typography.h2,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  processingSubtitle: {
    ...Typography.body,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  cancelButton: {
    marginBottom: Spacing.lg,
  },
  warningText: {
    ...Typography.bodySmall,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  listTitle: {
    ...Typography.h3,
  },
  recordingsList: {
    paddingBottom: Spacing.xl,
  },
  recordingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  recordingName: {
    ...Typography.body,
    flex: 1,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xl * 2,
  },
  emptyText: {
    ...Typography.h4,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  emptySubtext: {
    ...Typography.bodySmall,
    textAlign: 'center',
  },
});
