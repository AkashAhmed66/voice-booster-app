import { Card } from '@/components/ui/card';
import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AudioFile {
  id: string;
  name: string;
  uri: string;
  duration: string;
  size: string;
  date: string;
}

export default function OutputFilesScreen() {
  const { colorScheme } = useColorScheme();
  const colors = Colors[colorScheme || 'dark'];
  const router = useRouter();
  const [files, setFiles] = useState<AudioFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadRecordings = async () => {
    try {
      // Request permission to access media library
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant storage permission to view your recordings.');
        setFiles([]);
        setIsLoading(false);
        return;
      }

      // Get the VoiceBooster album
      const album = await MediaLibrary.getAlbumAsync('VoiceBooster');
      if (!album) {
        console.log('VoiceBooster album does not exist yet');
        setFiles([]);
        setIsLoading(false);
        return;
      }

      // Get all assets from the album
      const albumAssets = await MediaLibrary.getAssetsAsync({
        album: album,
        mediaType: MediaLibrary.MediaType.audio,
        sortBy: MediaLibrary.SortBy.creationTime,
      });

      // Format the assets for display
      const recordings: AudioFile[] = await Promise.all(
        albumAssets.assets.map(async (asset) => {
          const durationInSeconds = Math.floor(asset.duration);
          const mins = Math.floor(durationInSeconds / 60);
          const secs = durationInSeconds % 60;
          const formattedDuration = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

          // Get detailed file info using getAssetInfoAsync
          let fileSize = '0.00 MB';
          let fileDate = new Date(asset.creationTime).toISOString();
          
          try {
            const assetInfo = await MediaLibrary.getAssetInfoAsync(asset);
            
            // Get accurate file size
            if (assetInfo.localUri) {
              const fileInfo = await FileSystem.getInfoAsync(assetInfo.localUri);
              if (fileInfo.exists && 'size' in fileInfo) {
                const sizeInMB = fileInfo.size / (1024 * 1024);
                if (sizeInMB < 0.01) {
                  // Show in KB if less than 0.01 MB
                  fileSize = (fileInfo.size / 1024).toFixed(2) + ' KB';
                } else {
                  fileSize = sizeInMB.toFixed(2) + ' MB';
                }
              }
              
              // Get accurate modification time
              if ('modificationTime' in fileInfo && fileInfo.modificationTime) {
                fileDate = new Date(fileInfo.modificationTime * 1000).toISOString();
              }
            }
          } catch (error) {
            console.log('Could not get file info for', asset.filename);
          }

          return {
            id: asset.id,
            name: asset.filename,
            uri: asset.uri,
            duration: formattedDuration,
            size: fileSize,
            date: fileDate,
          };
        })
      );

      // Sort by date (newest first)
      recordings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setFiles(recordings);
    } catch (error) {
      console.error('Failed to load recordings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  const deleteRecording = async (file: AudioFile) => {
    Alert.alert(
      'Delete Recording',
      `Are you sure you want to delete ${file.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Delete the asset from media library
              await MediaLibrary.deleteAssetsAsync([file.id]);
              
              // Reload the recordings list
              await loadRecordings();
            } catch (error) {
              console.error('Failed to delete recording:', error);
              Alert.alert('Error', 'Failed to delete recording');
            }
          },
        },
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      loadRecordings();
    }, [])
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, {
          backgroundColor: colorScheme === 'dark' ? 'rgba(168, 85, 247, 0.05)' : 'transparent',
          borderRadius: 12,
          padding: colorScheme === 'dark' ? 12 : 0,
          marginBottom: Spacing.md
        }]}>
          <Text style={[styles.title, { color: colors.text }]}>Output Files</Text>
          <Text style={[styles.subtitle, { color: colors.primary }]}>
            {files.length} files
          </Text>
        </View>

        {/* Files List */}
        {files.length > 0 ? (
          <View style={styles.filesList}>
            {files.map((file, index) => (
              <Card
                key={file.id}
                onPress={() => router.push({
                  pathname: '/player',
                  params: { audioUri: file.uri, fileName: file.name }
                })}
                style={[styles.fileCard, {
                  borderColor: colorScheme === 'dark' ? 'rgba(168, 85, 247, 0.2)' : colors.border
                }]}
              >
                <View style={styles.fileContent}>
                  <View
                    style={[
                      styles.iconContainer,
                      { 
                        backgroundColor: colorScheme === 'dark'
                          ? `rgba(${168 + index * 10}, 85, 247, 0.15)`
                          : `rgba(${168 - index * 10}, 85, 247, 0.1)`,
                      },
                    ]}
                  >
                    <Ionicons name="musical-note" size={24} color={colors.primary} />
                  </View>

                  <View style={styles.fileInfo}>
                    <Text style={[styles.fileName, { color: colors.text }]} numberOfLines={1}>
                      {file.name}
                    </Text>
                    <View style={styles.fileDetails}>
                      <Text style={[styles.fileDetail, { color: colors.textSecondary }]}>
                        <Ionicons name="time-outline" size={12} color={colors.textSecondary} />{' '}
                        {file.duration}
                      </Text>
                      <Text style={[styles.fileDetail, { color: colors.textSecondary }]}>
                        • {file.size}
                      </Text>
                    </View>
                    <Text style={[styles.fileDate, { color: colors.textTertiary }]}>
                      {getTimeAgo(file.date)}
                    </Text>
                  </View>

                  <TouchableOpacity 
                    onPress={() => deleteRecording(file)}
                    style={styles.deleteButton}
                  >
                    <Ionicons name="trash-outline" size={20} color={colors.accent} />
                  </TouchableOpacity>
                </View>
              </Card>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="folder-open-outline" size={80} color={colors.textTertiary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No files yet</Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Your recordings will appear here
            </Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.sm,
  },
  header: {
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.h2,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
  },
  filesList: {
    gap: Spacing.sm,
  },
  fileCard: {
    padding: Spacing.sm,
  },
  fileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    ...Typography.h4,
    marginBottom: Spacing.xs,
  },
  fileDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  fileDetail: {
    ...Typography.bodySmall,
  },
  fileDate: {
    ...Typography.caption,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl * 2,
  },
  emptyTitle: {
    ...Typography.h3,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    ...Typography.body,
    textAlign: 'center',
  },
  deleteButton: {
    padding: Spacing.xs,
  },
});
