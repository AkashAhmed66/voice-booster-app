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
  const { colorScheme } = useColorScheme();
  const colors = Colors[colorScheme || 'dark'];
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
        <View style={[styles.optionsContainer, {
          backgroundColor: colorScheme === 'dark' 
            ? 'rgba(168, 85, 247, 0.05)' 
            : 'transparent',
          padding: colorScheme === 'dark' ? Spacing.sm : 0,
          borderRadius: 12
        }]}>
          {ENHANCEMENT_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionButton,
                {
                  backgroundColor:
                    selectedOption === option.id 
                      ? colors.primary
                      : (colorScheme === 'dark'
                          ? 'rgba(168, 85, 247, 0.1)'
                          : colors.backgroundSecondary),
                  borderColor: selectedOption === option.id ? colors.primary : 'rgba(168, 85, 247, 0.2)',
                  borderWidth: 1,
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
        <View style={[styles.ratingContainer, {
          backgroundColor: colorScheme === 'dark'
            ? 'rgba(168, 85, 247, 0.05)'
            : 'rgba(168, 85, 247, 0.03)',
          borderRadius: 16,
          padding: Spacing.lg
        }]}>
          <Text style={[styles.ratingTitle, { color: colors.text }]}>Enjoyed?</Text>
          <Text style={[styles.ratingSubtitle, { color: colors.primary }]}>
            Let us know!
          </Text>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Ionicons
                  name={star <= rating ? 'star' : 'star-outline'}
                  size={40}
                  color={star <= rating ? colors.primary : colors.border}
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
  optionsContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
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
    marginBottom: Spacing.lg,
  },
  volumeContainer: {
    marginBottom: Spacing.lg,
  },
  ratingContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  ratingTitle: {
    ...Typography.h4,
    marginBottom: Spacing.xs,
  },
  ratingSubtitle: {
    ...Typography.body,
    marginBottom: Spacing.sm,
  },
  stars: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  saveButton: {
    marginBottom: Spacing.lg,
  },
});
