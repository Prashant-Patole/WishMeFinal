import { Icon } from '@/components/Icon';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth, Plan } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { fontVariants } from '@/constants/fonts';
import { shadows } from '@/constants/theme';

const PLANS = [
  {
    id: 'free' as Plan,
    name: 'Free',
    price: '₹0',
    period: 'forever',
    colors: ['#6B7085', '#9CA3AF'] as const,
    referralL1: '5%',
    referralL2: '2%',
    discount: '0%',
    features: ['Browse celebrities', 'Basic booking', 'Wallet top-up', '5% Level 1 referral'],
  },
  {
    id: 'silver' as Plan,
    name: 'Silver',
    price: '₹299',
    period: '/month',
    colors: ['#9CA3AF', '#D1D5DB'] as const,
    referralL1: '7%',
    referralL2: '3%',
    discount: '5%',
    features: ['Everything in Free', '5% booking discount', '7% Level 1 referral', 'Priority support'],
    popular: false,
  },
  {
    id: 'gold' as Plan,
    name: 'Gold',
    price: '₹599',
    period: '/month',
    colors: ['#F59E0B', '#FBBF24'] as const,
    referralL1: '8%',
    referralL2: '4%',
    discount: '10%',
    features: ['Everything in Silver', '10% booking discount', '8% Level 1 referral', 'AI Music credits'],
    popular: true,
  },
  {
    id: 'platinum' as Plan,
    name: 'Platinum',
    price: '₹999',
    period: '/month',
    colors: ['#B44CFF', '#FF6B33'] as const,
    referralL1: '10%',
    referralL2: '5%',
    discount: '15%',
    features: ['Everything in Gold', '15% booking discount', '10% Level 1 referral', 'Unlimited AI features', 'VIP celebrity access'],
  },
];

function PlanCard({ plan, selected, onSelect }: { plan: typeof PLANS[0]; selected: boolean; onSelect: () => void }) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onSelect}
      style={[
        styles.planCard,
        {
          backgroundColor: colors.card,
          borderColor: selected ? plan.colors[0] : colors.border,
          borderWidth: selected ? 2 : 1,
          ...shadows.md,
        },
      ]}
    >
      {plan.popular && (
        <View style={[styles.popularBadge, { backgroundColor: plan.colors[0] }]}>
          <Text style={{ color: '#fff', fontSize: 10, fontFamily: 'Inter_700Bold' }}>MOST POPULAR</Text>
        </View>
      )}

      <View style={styles.planHeader}>
        <LinearGradient colors={plan.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.planGradientBar} />
        <View style={{ flex: 1 }}>
          <Text style={[fontVariants.h4, { color: colors.foreground }]}>{plan.name}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 2, marginTop: 4 }}>
            <Text style={{ fontFamily: 'PlayfairDisplay_700Bold', fontSize: 24, color: plan.colors[0] }}>{plan.price}</Text>
            <Text style={[fontVariants.caption, { color: colors.mutedForeground }]}>{plan.period}</Text>
          </View>
        </View>
        <View style={[
          styles.checkCircle,
          { borderColor: selected ? plan.colors[0] : colors.border, backgroundColor: selected ? plan.colors[0] : 'transparent' },
        ]}>
          {selected && <Icon name="check" size={14} color="#fff" />}
        </View>
      </View>

      <View style={{ gap: 8, marginTop: 12 }}>
        {plan.features.map((f) => (
          <View key={f} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Icon name="check-circle" size={14} color={plan.colors[0]} />
            <Text style={[fontVariants.caption, { color: colors.foreground }]}>{f}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.commissionBadge, { backgroundColor: colors.backgroundSecondary }]}>
        <Text style={[fontVariants.caption, { color: colors.mutedForeground }]}>
          Referral: <Text style={{ color: plan.colors[0], fontFamily: 'Inter_600SemiBold' }}>{plan.referralL1}</Text> L1 ·{' '}
          <Text style={{ color: plan.colors[0], fontFamily: 'Inter_600SemiBold' }}>{plan.referralL2}</Text> L2
        </Text>
      </View>
    </Pressable>
  );
}

export default function SelectPlanScreen() {
  const { colors } = useTheme();
  const { updateProfile } = useAuth();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const botPad = Platform.OS === 'web' ? 34 : 0;
  const [selectedPlan, setSelectedPlan] = useState<Plan>('free');

  const handleContinue = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await updateProfile({ plan: selectedPlan });
    router.replace('/(auth)/complete-profile');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, { paddingTop: topPad + 24 }]}>
          <Text style={[fontVariants.h2, { color: colors.foreground, textAlign: 'center' }]}>Choose Your Plan</Text>
          <Text style={[fontVariants.body, { color: colors.mutedForeground, textAlign: 'center', marginTop: 8 }]}>
            Pick the plan that fits your needs.{'\n'}You can upgrade anytime.
          </Text>
        </View>

        <View style={styles.plans}>
          {PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              selected={selectedPlan === plan.id}
              onSelect={() => setSelectedPlan(plan.id)}
            />
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: botPad + 16, backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <Pressable onPress={handleContinue}>
          <LinearGradient
            colors={['#FF6B33', '#B44CFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.continueBtn}
          >
            <Text style={{ color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 16 }}>
              Continue with {PLANS.find((p) => p.id === selectedPlan)?.name}
            </Text>
            <Icon name="arrow-right" size={18} color="#fff" />
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 24, paddingBottom: 24 },
  plans: { paddingHorizontal: 20, gap: 14 },
  planCard: { borderRadius: 18, padding: 18, position: 'relative', overflow: 'hidden' },
  popularBadge: { position: 'absolute', top: 0, right: 0, paddingHorizontal: 12, paddingVertical: 5, borderBottomLeftRadius: 12 },
  planHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  planGradientBar: { width: 4, height: 48, borderRadius: 2 },
  checkCircle: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  commissionBadge: { marginTop: 14, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  footer: { paddingHorizontal: 20, paddingTop: 16, borderTopWidth: StyleSheet.hairlineWidth },
  continueBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 18, borderRadius: 16 },
});
