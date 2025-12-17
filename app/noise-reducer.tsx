import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function NoiseReducerScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleProcess = () => {
    setProcessing(true);
    setProgress(0);

    // Simulate processing
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setProcessing(false);
          // Navigate to player screen
          setTimeout(() => router.push('/player'), 500);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.backgroundSecondary }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Noise Reducer</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {processing ? (
          // Processing View
          <View style={styles.processingContainer}>
            <View style={styles.progressCircle}>
              <Text style={[styles.progressText, { color: colors.text }]}>
                {progress.toFixed(0)}%
              </Text>
            </View>

            <Text style={[styles.processingTitle, { color: colors.text }]}>
              Say Goodbye to noise!
            </Text>
            <Text style={[styles.processingSubtitle, { color: colors.textSecondary }]}>
              Let us denoise your audio for crystal-clear sounds!
            </Text>

            <Button
              title="Cancel"
              onPress={() => {
                setProcessing(false);
                setProgress(0);
              }}
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
                <Ionicons name="cloud-upload-outline" size={80} color={colors.primary} />
                <Text style={[styles.uploadTitle, { color: colors.text }]}>
                  Select Audio File
                </Text>
                <Text style={[styles.uploadSubtitle, { color: colors.textSecondary }]}>
                  Choose an audio file to reduce noise
                </Text>
                <Button
                  title="Browse Files"
                  onPress={() => {
                    // File picker would go here
                  }}
                  style={styles.browseButton}
                />
              </View>
            </Card>

            {/* Info Cards */}
            <View style={styles.infoContainer}>
              <Text style={[styles.infoTitle, { color: colors.text }]}>How it works</Text>

              <Card style={styles.infoCard}>
                <View style={styles.infoItem}>
                  <View
                    style={[
                      styles.infoIcon,
                      { backgroundColor: colors.primary + '20' },
                    ]}
                  >
                    <Ionicons name="document-text" size={24} color={colors.primary} />
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
                      Our AI removes background noise automatically
                    </Text>
                  </View>
                </View>
              </Card>

              <Card style={styles.infoCard}>
                <View style={styles.infoItem}>
                  <View
                    style={[
                      styles.infoIcon,
                      { backgroundColor: colors.primary + '20' },
                    ]}
                  >
                    <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                  </View>
                  <View style={styles.infoText}>
                    <Text style={[styles.infoItemTitle, { color: colors.text }]}>
                      3. Download Result
                    </Text>
                    <Text style={[styles.infoItemText, { color: colors.textSecondary }]}>
                      Get your crystal-clear audio file
                    </Text>
                  </View>
                </View>
              </Card>
            </View>

            {/* Demo Button */}
            <Button
              title="Try Demo Audio"
              onPress={handleProcess}
              variant="secondary"
              fullWidth
              icon={<Ionicons name="play-circle" size={20} color={colors.background} />}
            />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    ...Typography.h3,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  uploadCard: {
    marginBottom: Spacing.xl,
  },
  uploadContent: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  uploadTitle: {
    ...Typography.h3,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  uploadSubtitle: {
    ...Typography.body,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  browseButton: {
    marginTop: Spacing.md,
  },
  infoContainer: {
    marginBottom: Spacing.xl,
  },
  infoTitle: {
    ...Typography.h3,
    marginBottom: Spacing.md,
  },
  infoCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  infoIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
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
    paddingVertical: Spacing.xxl,
  },
  progressCircle: {
    width: 200,
    height: 200,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  progressText: {
    ...Typography.h1,
    fontSize: 48,
  },
  processingTitle: {
    ...Typography.h2,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  processingSubtitle: {
    ...Typography.body,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  cancelButton: {
    marginBottom: Spacing.xl,
  },
  warningText: {
    ...Typography.bodySmall,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
});
