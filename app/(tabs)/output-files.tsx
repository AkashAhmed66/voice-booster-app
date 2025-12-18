import { Card } from '@/components/ui/card';
import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

interface AudioFile {
  id: string;
  name: string;
  duration: string;
  size: string;
  date: string;
}

const STATIC_FILES: AudioFile[] = [
  {
    id: '1',
    name: 'Enhanced_Voice_Recording.mp3',
    duration: '03:24',
    size: '4.2 MB',
    date: '2 hours ago',
  },
  {
    id: '2',
    name: 'Noise_Reduced_Audio.wav',
    duration: '05:12',
    size: '8.7 MB',
    date: 'Yesterday',
  },
  {
    id: '3',
    name: 'Vocal_Track_Separated.mp3',
    duration: '04:45',
    size: '6.1 MB',
    date: '2 days ago',
  },
];

export default function OutputFilesScreen() {
  const { colorScheme } = useColorScheme();
  const colors = Colors[colorScheme || 'dark'];
  const router = useRouter();
  const [files] = useState<AudioFile[]>(STATIC_FILES);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
                onPress={() => router.push('/player')}
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
                      {file.date}
                    </Text>
                  </View>

                  <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
                </View>
              </Card>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="folder-open-outline" size={80} color={colors.textTertiary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No files yet</Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Processed audio files will appear here
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
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
});
