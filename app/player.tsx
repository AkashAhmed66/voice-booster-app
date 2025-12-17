import { AudioPlayer } from '@/components/ui/audio-player';
import { Button } from '@/components/ui/button';
import { VolumeSlider } from '@/components/ui/slider';
import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ENHANCEMENT_OPTIONS = [
  { id: 'original', label: 'Original' },
  { id: 'v1', label: 'Enhanced V1' },
  { id: 'v3', label: 'Enhanced V3' },
];

export default function PlayerScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState('v3');
  const [volume, setVolume] = useState(100);
  const [rating, setRating] = useState(0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
        {/* Enhancement Options */}
        <View style={styles.optionsContainer}>
          {ENHANCEMENT_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionButton,
                {
                  backgroundColor:
                    selectedOption === option.id ? colors.accent : colors.backgroundSecondary,
                  borderColor: selectedOption === option.id ? colors.accent : colors.border,
                },
              ]}
              onPress={() => setSelectedOption(option.id)}
            >
              <Text
                style={[
                  styles.optionText,
                  {
                    color: selectedOption === option.id ? colors.background : colors.text,
                  },
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Audio Player */}
        <View style={styles.playerContainer}>
          <AudioPlayer />
        </View>

        {/* Volume Control */}
        <View style={styles.volumeContainer}>
          <VolumeSlider value={volume} onValueChange={setVolume} />
        </View>

        {/* Rating */}
        <View style={styles.ratingContainer}>
          <Text style={[styles.ratingTitle, { color: colors.text }]}>Enjoyed?</Text>
          <Text style={[styles.ratingSubtitle, { color: colors.textSecondary }]}>
            Let us know!
          </Text>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Ionicons
                  name={star <= rating ? 'star' : 'star-outline'}
                  size={40}
                  color={star <= rating ? colors.accent : colors.border}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Save Button */}
        <Button
          title="Save"
          onPress={() => {
            // Save functionality
            router.back();
          }}
          fullWidth
          style={styles.saveButton}
        />
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
  optionsContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  optionButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    alignItems: 'center',
  },
  optionText: {
    ...Typography.button,
    fontSize: 14,
  },
  playerContainer: {
    marginBottom: Spacing.xl,
  },
  volumeContainer: {
    marginBottom: Spacing.xl,
  },
  ratingContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  ratingTitle: {
    ...Typography.h4,
    marginBottom: Spacing.xs,
  },
  ratingSubtitle: {
    ...Typography.body,
    marginBottom: Spacing.md,
  },
  stars: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  saveButton: {
    marginBottom: Spacing.xl,
  },
});
