import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FeatureCardProps {
  title: string;
  icon: React.ReactNode;
  onPress: () => void;
  backgroundColor?: string;
}

export function FeatureCard({ title, icon, onPress, backgroundColor }: FeatureCardProps) {
  const { colorScheme } = useColorScheme();
  const colors = Colors[colorScheme || 'dark'];
  const isDark = colorScheme === 'dark';

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: backgroundColor || colors.card,
          borderColor: isDark ? 'rgba(168, 85, 247, 0.2)' : colors.border,
          shadowColor: '#000',
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { 
        backgroundColor: isDark ? 'rgba(168, 85, 247, 0.15)' : 'rgba(168, 85, 247, 0.08)'
      }]}>
        {icon}
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <View style={styles.arrow}>
        <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: Spacing.xs,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...Typography.h4,
    fontWeight: '600',
    flex: 1,
  },
  arrow: {
    opacity: 0.4,
  },
});
