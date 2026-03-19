import { Icon } from '@/components/Icon';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { fontVariants } from '@/constants/fonts';
import { shadows } from '@/constants/theme';

const PLAN_RATES: Record<string, { l1: number; l2: number }> = {
  free: { l1: 5, l2: 2 },
  silver: { l1: 7, l2: 3 },
  gold: { l1: 8, l2: 4 },
  platinum: { l1: 10, l2: 5 },
};

const REFERRAL_HISTORY = [
  { id: '1', name: 'Priya M.', plan: 'Gold', level: 1, commission: 349, date: '3 days ago', status: 'paid' },
  { id: '2', name: 'Amit K.', plan: 'Silver', level: 1, commission: 100, date: '2 weeks ago', status: 'paid' },
  { id: '3', name: 'Sneha R. → Raj P.', plan: 'Free', level: 2, commission: 25, date: '1 month ago', status: 'pending' },
];

export default function ReferralsScreen() {
  const { colors, isDark, gradients } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const [copied, setCopied] = useState(false);

  const plan = user?.plan ?? 'free';
  const rates = PLAN_RATES[plan] ?? PLAN_RATES.free;
  const referralCode = user?.referralCode ?? 'WISHME';

  const handleCopy = async () => {
    await Clipboard.setStringAsync(referralCode);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    await Share.share({
      title: 'Join WishMe!',
      message: `Book personalized videos from your favourite celebrities on WishMe! Use my referral code ${referralCode} and get ₹500 bonus. Download now: https://wishme.app`,
    });
  };

  const totalEarned = REFERRAL_HISTORY.filter((r) => r.status === 'paid').reduce((sum, r) => sum + r.commission, 0);
  const pendingEarnings = REFERRAL_HISTORY.filter((r) => r.status === 'pending').reduce((sum, r) => sum + r.commission, 0);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#B44CFF', '#7B2FFF']}
          style={[styles.hero, { paddingTop: topPad + 20 }]}
        >
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Icon name="arrow-left" size={20} color="#fff" />
          </Pressable>
          <Text style={{ fontFamily: 'DancingScript_700Bold', fontSize: 36, color: '#fff', marginBottom: 4 }}>Earn with WishMe</Text>
          <Text style={[fontVariants.body, { color: 'rgba(255,255,255,0.85)', textAlign: 'center', marginBottom: 24 }]}>
            Share your code & earn commissions on every booking
          </Text>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
              <Text style={{ fontFamily: 'PlayfairDisplay_700Bold', fontSize: 24, color: '#fff' }}>₹{totalEarned}</Text>
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>Total Earned</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
              <Text style={{ fontFamily: 'PlayfairDisplay_700Bold', fontSize: 24, color: '#fff' }}>₹{pendingEarnings}</Text>
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>Pending</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
              <Text style={{ fontFamily: 'PlayfairDisplay_700Bold', fontSize: 24, color: '#fff' }}>{REFERRAL_HISTORY.length}</Text>
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>Referrals</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={{ padding: 20, gap: 20 }}>
          {/* Commission Rates */}
          <View style={[styles.card, { backgroundColor: colors.card, ...shadows.sm }]}>
            <Text style={[fontVariants.h4, { color: colors.foreground, marginBottom: 16 }]}>Your Commission Rates</Text>
            <View style={styles.ratesRow}>
              <LinearGradient colors={['#FF6B33', '#B44CFF']} style={styles.rateCard}>
                <Text style={{ fontFamily: 'PlayfairDisplay_700Bold', fontSize: 28, color: '#fff' }}>{rates.l1}%</Text>
                <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: 'rgba(255,255,255,0.9)', marginTop: 4 }}>Level 1</Text>
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: 'rgba(255,255,255,0.75)' }}>Direct Referrals</Text>
              </LinearGradient>
              <LinearGradient colors={['#B44CFF', '#7B2FFF']} style={styles.rateCard}>
                <Text style={{ fontFamily: 'PlayfairDisplay_700Bold', fontSize: 28, color: '#fff' }}>{rates.l2}%</Text>
                <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: 'rgba(255,255,255,0.9)', marginTop: 4 }}>Level 2</Text>
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: 'rgba(255,255,255,0.75)' }}>Indirect Referrals</Text>
              </LinearGradient>
            </View>
            <Pressable onPress={() => router.push('/(auth)/select-plan')} style={[styles.upgradePill, { backgroundColor: colors.primary + '15' }]}>
              <Icon name="arrow-up" size={14} color={colors.primary} />
              <Text style={[fontVariants.captionMedium, { color: colors.primary }]}>Upgrade plan to earn higher commissions</Text>
            </Pressable>
          </View>

          {/* Referral Code */}
          <View style={[styles.card, { backgroundColor: colors.card, ...shadows.sm }]}>
            <Text style={[fontVariants.h4, { color: colors.foreground, marginBottom: 16 }]}>Your Referral Code</Text>
            <Pressable onPress={handleCopy} style={[styles.codeBox, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
              <Text style={{ fontFamily: 'PlayfairDisplay_700Bold', fontSize: 28, color: colors.primary, letterSpacing: 4 }}>
                {referralCode}
              </Text>
              <View style={[styles.copyBtn, { backgroundColor: colors.primary }]}>
                <Icon name={copied ? 'check' : 'copy'} size={18} color="#fff" />
              </View>
            </Pressable>
            <Pressable onPress={handleShare} style={{ marginTop: 14 }}>
              <LinearGradient colors={['#B44CFF', '#FF6B33']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.shareBtn}>
                <Icon name="share-2" size={18} color="#fff" />
                <Text style={{ color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 15 }}>Share Referral Link</Text>
              </LinearGradient>
            </Pressable>
          </View>

          {/* History */}
          <Text style={[fontVariants.h4, { color: colors.foreground }]}>Referral History</Text>
          <View style={{ gap: 10 }}>
            {REFERRAL_HISTORY.map((r) => (
              <View key={r.id} style={[styles.historyItem, { backgroundColor: colors.card, ...shadows.sm }]}>
                <View style={[styles.levelBadge, { backgroundColor: r.level === 1 ? colors.primary + '20' : colors.secondary + '20' }]}>
                  <Text style={{ color: r.level === 1 ? colors.primary : colors.secondary, fontSize: 11, fontFamily: 'Inter_700Bold' }}>
                    L{r.level}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[fontVariants.captionMedium, { color: colors.foreground }]}>{r.name}</Text>
                  <Text style={[fontVariants.caption, { color: colors.mutedForeground }]}>{r.plan} · {r.date}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[fontVariants.bodySemibold, { color: '#22C55E' }]}>+₹{r.commission}</Text>
                  <Text style={[fontVariants.caption, { color: r.status === 'paid' ? '#22C55E' : '#F59E0B', textTransform: 'capitalize' }]}>
                    {r.status}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { paddingHorizontal: 24, paddingBottom: 32, alignItems: 'center' },
  backBtn: { position: 'absolute', top: 0, left: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  statsRow: { flexDirection: 'row', gap: 12, width: '100%' },
  statCard: { flex: 1, borderRadius: 14, padding: 14, alignItems: 'center', gap: 2 },
  card: { borderRadius: 20, padding: 20 },
  ratesRow: { flexDirection: 'row', gap: 12 },
  rateCard: { flex: 1, borderRadius: 16, padding: 20, alignItems: 'center' },
  upgradePill: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, marginTop: 16 },
  codeBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderRadius: 14, borderWidth: 1 },
  copyBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  shareBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16, borderRadius: 14 },
  historyItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 14 },
  levelBadge: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
});
