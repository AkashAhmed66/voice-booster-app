import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PricingTier {
  id: string;
  minutes: string;
  price: string;
  originalPrice: string;
  discount: string;
  pricePerMinute: string;
  highlighted?: boolean;
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: '300',
    minutes: '300 Minutes',
    price: 'BDT399.0',
    originalPrice: 'BDT1329.99',
    discount: '70%',
    pricePerMinute: 'BDT1.33/minute',
    highlighted: true,
  },
  {
    id: '60',
    minutes: '60 Minutes',
    price: 'BDT199.0',
    originalPrice: 'BDT355.35',
    discount: '44%',
    pricePerMinute: 'BDT3.32/minute',
  },
  {
    id: '1000',
    minutes: '1000 Minutes',
    price: 'BDT799.0',
    originalPrice: 'BDT3196.0',
    discount: '75%',
    pricePerMinute: 'BDT0.8/minute',
  },
  {
    id: '2000',
    minutes: '2000 Minutes',
    price: 'BDT1199.0',
    originalPrice: 'BDT5995.0',
    discount: '80%',
    pricePerMinute: 'BDT0.6/minute',
  },
];

export default function PremiumScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.backgroundSecondary }]}>
        <View style={{ width: 40 }} />
        <Text style={[styles.headerTitle, { color: colors.text }]}>Premium</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <Ionicons name="close" size={28} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Premium Icon */}
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: colors.accent + '20' },
          ]}
        >
          <Ionicons name="trophy" size={64} color={colors.accent} />
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: colors.text }]}>Voice Booster Pro</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Access all premium features
        </Text>

        {/* Pricing Cards */}
        <View style={styles.pricingContainer}>
          {PRICING_TIERS.map((tier) => (
            <TouchableOpacity
              key={tier.id}
              style={[
                styles.pricingCard,
                {
                  backgroundColor: tier.highlighted ? colors.primary + '20' : colors.backgroundSecondary,
                  borderColor: tier.highlighted ? colors.accent : colors.border,
                  borderWidth: tier.highlighted ? 2 : 1,
                },
              ]}
            >
              <View style={styles.cardContent}>
                <View style={styles.cardLeft}>
                  <Text style={[styles.minutes, { color: colors.text }]}>{tier.minutes}</Text>
                  <Text style={[styles.perMinute, { color: colors.textSecondary }]}>
                    {tier.pricePerMinute}
                  </Text>
                </View>
                <View style={styles.cardRight}>
                  <Text style={[styles.price, { color: colors.text }]}>{tier.price}</Text>
                  <Text
                    style={[
                      styles.originalPrice,
                      { color: colors.textTertiary, textDecorationLine: 'line-through' },
                    ]}
                  >
                    {tier.originalPrice}
                  </Text>
                </View>
                <View
                  style={[
                    styles.discountBadge,
                    { backgroundColor: colors.accent },
                  ]}
                >
                  <Text style={[styles.discount, { color: colors.background }]}>
                    {tier.discount}
                  </Text>
                  <Text style={[styles.discountText, { color: colors.background }]}>OFF</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Buy Button */}
        <TouchableOpacity
          style={[styles.buyButton, { backgroundColor: colors.accent }]}
          onPress={() => {
            // Handle purchase
          }}
        >
          <Text style={[styles.buyButtonText, { color: colors.background }]}>Buy Now</Text>
        </TouchableOpacity>

        {/* Features List */}
        <View style={styles.featuresContainer}>
          <Text style={[styles.featuresTitle, { color: colors.text }]}>Premium Features</Text>
          {[
            'Unlimited audio processing',
            'High-quality noise reduction',
            'Advanced voice enhancement',
            'Priority processing queue',
            'Export in multiple formats',
            'No watermarks',
            'Email support',
          ].map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
              <Text style={[styles.featureText, { color: colors.textSecondary }]}>{feature}</Text>
            </View>
          ))}
        </View>
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
  headerTitle: {
    ...Typography.h3,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.h2,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  pricingContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  pricingCard: {
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    position: 'relative',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLeft: {
    flex: 1,
  },
  minutes: {
    ...Typography.h3,
    marginBottom: Spacing.xs,
  },
  perMinute: {
    ...Typography.bodySmall,
  },
  cardRight: {
    alignItems: 'flex-end',
  },
  price: {
    ...Typography.h3,
    marginBottom: Spacing.xs,
  },
  originalPrice: {
    ...Typography.bodySmall,
  },
  discountBadge: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  discount: {
    ...Typography.h4,
    fontWeight: '700',
    textAlign: 'center',
  },
  discountText: {
    ...Typography.caption,
    textAlign: 'center',
  },
  buyButton: {
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  buyButtonText: {
    ...Typography.h4,
    fontWeight: '700',
  },
  featuresContainer: {
    marginBottom: Spacing.xl,
  },
  featuresTitle: {
    ...Typography.h3,
    marginBottom: Spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  featureText: {
    ...Typography.body,
    flex: 1,
  },
});
