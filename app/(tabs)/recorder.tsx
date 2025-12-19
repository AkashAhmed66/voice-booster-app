import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RecorderScreen() {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme || 'dark'];
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [fileName, setFileName] = useState('');
  const [pendingRecording, setPendingRecording] = useState<{uri: string, duration: number} | null>(null);
  
  // Animation values for pulsating circles
  const pulseAnim1 = useRef(new Animated.Value(0)).current;
  const pulseAnim2 = useRef(new Animated.Value(0)).current;
  const pulseAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync();
      }
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  // Pulsating animation effect
  useEffect(() => {
    if (isRecording) {
      const createPulseAnimation = (animValue: Animated.Value, delay: number) => {
        return Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(animValue, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(animValue, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ])
        );
      };

      const pulse1 = createPulseAnimation(pulseAnim1, 0);
      const pulse2 = createPulseAnimation(pulseAnim2, 400);
      const pulse3 = createPulseAnimation(pulseAnim3, 800);

      Animated.parallel([pulse1, pulse2, pulse3]).start();
    } else {
      // Reset animations when not recording
      pulseAnim1.setValue(0);
      pulseAnim2.setValue(0);
      pulseAnim3.setValue(0);
    }
  }, [isRecording]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const requestPermissions = async () => {
    try {
      // Request microphone permission
      const audioPermission = await Audio.requestPermissionsAsync();
      if (audioPermission.status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant microphone permission to record audio.');
        return false;
      }

      // Request media library permission for saving to public storage
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      if (mediaLibraryPermission.status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant storage permission to save recordings to your device.');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  };

  const getRecordingsDirectory = async () => {
    const folderName = 'VoiceBooster';
    const recordingsDir = `${FileSystem.documentDirectory}${folderName}/`;
    
    // Check if directory exists, if not create it
    const dirInfo = await FileSystem.getInfoAsync(recordingsDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(recordingsDir, { intermediates: true });
      console.log('Created recordings directory:', recordingsDir);
    }
    
    return recordingsDir;
  };

  const saveRecording = async (uri: string, duration: number, customFileName?: string) => {
    try {
      // Use custom file name or generate default
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const baseFileName = customFileName || `recording_${timestamp}`;
      const fileName = baseFileName.endsWith('.m4a') ? baseFileName : `${baseFileName}.m4a`;
      
      // Save to device's public media library directly using the original URI
      // MediaLibrary will handle the file type detection from the original recording
      const asset = await MediaLibrary.createAssetAsync(uri);
      
      // Create an album named "VoiceBooster" and add the recording to it
      const album = await MediaLibrary.getAlbumAsync('VoiceBooster');
      if (album == null) {
        await MediaLibrary.createAlbumAsync('VoiceBooster', asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }
      
      // Reset state
      setRecordingUri(null);
      setRecordingDuration(0);
      setShowSaveModal(false);
      setPendingRecording(null);
      setFileName('');
      
      Alert.alert('Success', 'Recording saved to your device\'s Music folder in "VoiceBooster" album.\n\nYou can find it in your Files app or Music player.');
    } catch (error) {
      console.error('Failed to save recording:', error);
      Alert.alert('Error', 'Failed to save recording');
    }
  };

  const startRecording = async () => {
    try {
      const hasPermissions = await requestPermissions();
      if (!hasPermissions) {
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(newRecording);
      setIsRecording(true);
      setRecordingDuration(0);
      setRecordingUri(null);
    } catch (error) {
      console.error('Failed to start recording', error);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      // Show save modal instead of saving immediately
      if (uri) {
        const timestamp = new Date().toLocaleString().replace(/[/,:]/g, '-');
        setFileName(`My Recording ${timestamp}`);
        setPendingRecording({ uri, duration: recordingDuration });
        setShowSaveModal(true);
      }
    } catch (error) {
      console.error('Failed to stop recording', error);
      Alert.alert('Error', 'Failed to stop recording');
    }
  };

  const handleSave = async () => {
    if (pendingRecording && fileName.trim()) {
      await saveRecording(pendingRecording.uri, pendingRecording.duration, fileName);
    } else if (!fileName.trim()) {
      Alert.alert('Error', 'Please enter a file name');
    }
  };

  const handleDiscard = () => {
    setPendingRecording(null);
    setShowSaveModal(false);
    setFileName('');
    setRecordingDuration(0);
  };

  const playRecording = async () => {
    if (!recordingUri) return;

    try {
      if (isPlaying && sound) {
        await sound.pauseAsync();
        setIsPlaying(false);
        return;
      }

      if (sound) {
        await sound.replayAsync();
        setIsPlaying(true);
      } else {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: recordingUri },
          { shouldPlay: true }
        );
        setSound(newSound);
        setIsPlaying(true);

        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            setIsPlaying(false);
          }
        });
      }
    } catch (error) {
      console.error('Failed to play recording', error);
      Alert.alert('Error', 'Failed to play recording');
    }
  };

  const deleteRecording = async () => {
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
    }
    setRecordingUri(null);
    setRecordingDuration(0);
    setIsPlaying(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Voice Recorder</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Record high-quality audio
          </Text>
        </View>

        {/* Recording Visualizer */}
        <View
          style={[
            styles.visualizer,
            {
              backgroundColor: colorScheme === 'dark' ? 'rgba(168, 85, 247, 0.05)' : 'rgba(168, 85, 247, 0.03)',
              borderColor: isRecording ? colors.primary : colors.border,
              borderWidth: 2,
            },
          ]}
        >
          {/* Microphone with pulsating animation */}
          <View style={styles.micWrapper}>
            {/* Pulsating animation circles */}
            {isRecording && (
              <>
                <Animated.View
                  style={[
                    styles.pulseCircle,
                    {
                      backgroundColor: colors.primary,
                      opacity: pulseAnim1.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.6, 0],
                      }),
                      transform: [
                        {
                          scale: pulseAnim1.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 2.5],
                          }),
                        },
                      ],
                    },
                  ]}
                />
                <Animated.View
                  style={[
                    styles.pulseCircle,
                    {
                      backgroundColor: colors.primary,
                      opacity: pulseAnim2.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.6, 0],
                      }),
                      transform: [
                        {
                          scale: pulseAnim2.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 2.5],
                          }),
                        },
                      ],
                    },
                  ]}
                />
                <Animated.View
                  style={[
                    styles.pulseCircle,
                    {
                      backgroundColor: colors.primary,
                      opacity: pulseAnim3.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.6, 0],
                      }),
                      transform: [
                        {
                          scale: pulseAnim3.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 2.5],
                          }),
                        },
                      ],
                    },
                  ]}
                />
              </>
            )}
            
            <View style={[styles.micIconContainer, { backgroundColor: isRecording ? colors.primary : colors.backgroundSecondary }]}>
              <Ionicons name="mic" size={48} color={isRecording ? colors.background : colors.text} />
            </View>
          </View>
          
          <Text style={[styles.timer, { color: colors.text }]}>
            {formatTime(recordingDuration)}
          </Text>
          
          {isRecording && (
            <View style={styles.recordingIndicator}>
              <View style={[styles.recordingDot, { backgroundColor: colors.accent }]} />
              <Text style={[styles.recordingText, { color: colors.accent }]}>Recording...</Text>
            </View>
          )}
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          {!recordingUri ? (
            <TouchableOpacity
              style={[
                styles.recordButton,
                {
                  backgroundColor: isRecording ? colors.accent : colors.primary,
                },
              ]}
              onPress={isRecording ? stopRecording : startRecording}
            >
              <Ionicons 
                name={isRecording ? 'stop' : 'mic'} 
                size={32} 
                color={colors.background} 
              />
              <Text style={[styles.buttonText, { color: colors.background }]}>
                {isRecording ? 'Stop' : 'Record'}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.playbackControls}>
              <TouchableOpacity
                style={[styles.playButton, { backgroundColor: colors.primary }]}
                onPress={playRecording}
              >
                <Ionicons 
                  name={isPlaying ? 'pause' : 'play'} 
                  size={28} 
                  color={colors.background} 
                />
                <Text style={[styles.buttonText, { color: colors.background }]}>
                  {isPlaying ? 'Pause' : 'Play'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.deleteButton, { backgroundColor: colors.backgroundSecondary }]}
                onPress={deleteRecording}
              >
                <Ionicons name="trash" size={28} color={colors.accent} />
                <Text style={[styles.buttonText, { color: colors.accent }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Info */}
        <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
          <Ionicons name="information-circle" size={20} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            {recordingUri 
              ? 'Recording saved! Play or delete to record again.' 
              : 'Tap the record button to start recording your voice.'}
          </Text>
        </View>
      </View>

      {/* Save Recording Modal */}
      <Modal
        visible={showSaveModal}
        transparent
        animationType="fade"
        onRequestClose={handleDiscard}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <TouchableOpacity 
            style={styles.modalOverlay} 
            activeOpacity={1} 
            onPress={handleDiscard}
          >
            <TouchableOpacity 
              activeOpacity={1} 
              onPress={(e) => e.stopPropagation()}
              style={[styles.modalContent, { backgroundColor: colors.card }]}
            >
              <View style={styles.modalHeader}>
                <Ionicons name="save-outline" size={32} color={colors.primary} />
                <Text style={[styles.modalTitle, { color: colors.text }]}>Save Recording</Text>
                <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                  Enter a name for your recording
                </Text>
              </View>

              <View style={styles.modalBody}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                  File Name
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                  ]}
                  value={fileName}
                  onChangeText={setFileName}
                  placeholder="Enter file name..."
                  placeholderTextColor={colors.textTertiary}
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={handleSave}
                />
                
                <View style={styles.durationInfo}>
                  <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
                  <Text style={[styles.durationText, { color: colors.textSecondary }]}>
                    Duration: {formatTime(recordingDuration)}
                  </Text>
                </View>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.discardButton, { backgroundColor: colors.backgroundSecondary }]}
                  onPress={handleDiscard}
                >
                  <Ionicons name="close-circle" size={20} color={colors.accent} />
                  <Text style={[styles.modalButtonText, { color: colors.accent }]}>
                    Discard
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton, { backgroundColor: colors.primary }]}
                  onPress={handleSave}
                >
                  <Ionicons name="checkmark-circle" size={20} color={colors.background} />
                  <Text style={[styles.modalButtonText, { color: colors.background }]}>
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  header: {
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  title: {
    ...Typography.h2,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    opacity: 0.7,
  },
  visualizer: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.xl,
    minHeight: 250,
    justifyContent: 'center',
  },
  micWrapper: {
    position: 'relative',
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  pulseCircle: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    top: 0,
    left: 0,
  },
  micIconContainer: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1,
  },
  timer: {
    ...Typography.h1,
    fontWeight: '700',
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
  },
  recordingText: {
    ...Typography.body,
    fontWeight: '600',
  },
  controls: {
    marginBottom: Spacing.xl,
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  playbackControls: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  playButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    ...Typography.body,
    fontWeight: '700',
    fontSize: 16,
  },
  infoCard: {
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  infoText: {
    ...Typography.small,
    flex: 1,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    ...Typography.h3,
    fontWeight: '700',
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  modalSubtitle: {
    ...Typography.body,
    textAlign: 'center',
  },
  modalBody: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    ...Typography.bodySmall,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  input: {
    borderWidth: 2,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    fontSize: 16,
    marginBottom: Spacing.sm,
  },
  durationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  durationText: {
    ...Typography.bodySmall,
  },
  modalActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  modalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  discardButton: {
    // Additional styles if needed
  },
  saveButton: {
    // Additional styles if needed
  },
  modalButtonText: {
    ...Typography.body,
    fontWeight: '700',
  },
});
