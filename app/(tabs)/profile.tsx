import { Icon, IconName } from '@/components/Icon';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { fontVariants } from '@/constants/fonts';
import { radius, shadows } from '@/constants/theme';

const PLAN_COLORS: Record<string, string[]> = {
  free: ['#6B7085', '#9CA3AF'],
  silver: ['#9CA3AF', '#D1D5DB'],
  gold: ['#F59E0B', '#FBBF24'],
  platinum: ['#B44CFF', '#FF6B33'],
};

function PlanBadge({ plan }: { plan: string }) {
  const cols = PLAN_COLORS[plan] ?? PLAN_COLORS.free;
  return (
    <LinearGradient colors={cols} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.planBadge}>
      <Text style={{ color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 11, letterSpacing: 0.5 }}>
        {plan.toUpperCase()}
      </Text>
    </LinearGradient>
  );
}

function CompletionBar({ pct }: { pct: number }) {
  const { colors } = useTheme();
  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
        <Text style={[fontVariants.captionMedium, { color: colors.foreground }]}>Profile Completion</Text>
        <Text style={[fontVariants.captionMedium, { color: colors.primary }]}>{pct}%</Text>
      </View>
      <View style={[styles.progressTrack, { backgroundColor: colors.muted }]}>
        <LinearGradient
          colors={['#FF6B33', '#B44CFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.progressFill, { width: `${pct}%` as any }]}
        />
      </View>
      {pct < 100 && (
        <Pressable onPress={() => router.push('/(auth)/complete-profile')} style={{ marginTop: 8 }}>
          <Text style={[fontVariants.caption, { color: colors.primary }]}>
            Complete your profile to unlock all features →
          </Text>
        </Pressable>
      )}
    </View>
  );
}

function MenuItem({ icon, label, value, onPress, destructive }: { icon: IconName; label: string; value?: string; onPress?: () => void; destructive?: boolean }) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.menuItem, { backgroundColor: colors.card, opacity: pressed ? 0.7 : 1 }]}>
      <View style={[styles.menuIconWrap, { backgroundColor: destructive ? colors.destructive + '15' : colors.primary + '15' }]}>
        <Icon name={icon} size={18} color={destructive ? colors.destructive : colors.primary} />
      </View>
      <Text style={[fontVariants.bodyMedium, { color: destructive ? colors.destructive : colors.foreground, flex: 1 }]}>
        {label}
      </Text>
      {value && <Text style={[fontVariants.caption, { color: colors.mutedForeground }]}>{value}</Text>}
      <Icon name="chevron-right" size={16} color={colors.mutedForeground} />
    </Pressable>
  );
}

export default function ProfileScreen() {
  const { colors, isDark } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  if (!isAuthenticated) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <LinearGradient colors={['#FF6B33', '#B44CFF']} style={styles.authIcon}>
          <Icon name="user" size={40} color="#fff" />
        </LinearGradient>
        <Text style={[fontVariants.h3, { color: colors.foreground, marginTop: 24, textAlign: 'center' }]}>
          Join WishMe
        </Text>
        <Text style={[fontVariants.body, { color: colors.mutedForeground, textAlign: 'center', marginTop: 8, marginBottom: 32 }]}>
          Sign in to book celebrities, manage your wallet, and more
        </Text>
        <Pressable onPress={() => router.push('/(auth)/login')} style={{ width: '100%' }}>
          <LinearGradient colors={['#FF6B33', '#B44CFF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.authBtn}>
            <Text style={{ color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 16 }}>Sign In</Text>
          </LinearGradient>
        </Pressable>
        <Pressable onPress={() => router.push('/(auth)/signup')} style={{ marginTop: 12, padding: 14, width: '100%', alignItems: 'center' }}>
          <Text style={[fontVariants.bodySemibold, { color: colors.primary }]}>Create Account</Text>
        </Pressable>
      </View>
    );
  }

  const handleLogout = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    await logout();
  };

  const displayName = user?.firstName ? `${user.firstName} ${user.lastName}`.trim() : user?.email?.split('@')[0] ?? 'User';

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <LinearGradient
          colors={isDark ? ['#1F1530', '#1A2035'] : ['#FFF5F0', '#F8F0FF']}
          style={[styles.hero, { paddingTop: topPad + 16 }]}
        >
          <View style={styles.avatarWrap}>
            {user?.profilePhoto ? (
              <Image source={{ uri: user.profilePhoto }} style={styles.avatar} />
            ) : (
              <LinearGradient colors={['#FF6B33', '#B44CFF']} style={styles.avatarPlaceholder}>
                <Text style={{ fontFamily: 'PlayfairDisplay_700Bold', fontSize: 32, color: '#fff' }}>
                  {displayName.charAt(0).toUpperCase()}
                </Text>
              </LinearGradient>
            )}
            <Pressable
              onPress={() => router.push('/(auth)/complete-profile')}
              style={[styles.editAvatar, { backgroundColor: colors.primary }]}
            >
              <Icon name="camera" size={12} color="#fff" />
            </Pressable>
          </View>
          <Text style={[fontVariants.h3, { color: colors.foreground, marginTop: 12 }]}>{displayName}</Text>
          <Text style={[fontVariants.caption, { color: colors.mutedForeground, marginBottom: 12 }]}>{user?.email}</Text>
          <PlanBadge plan={user?.plan ?? 'free'} />

          {/* Wallet & Referral */}
          <View style={styles.statsRow}>
            <Pressable onPress={() => router.push('/wallet')} style={[styles.statCard, { backgroundColor: colors.card, ...shadows.sm }]}>
              <Text style={[fontVariants.h4, { color: colors.primary }]}>₹{user?.walletBalance?.toLocaleString() ?? '0'}</Text>
              <Text style={[fontVariants.caption, { color: colors.mutedForeground }]}>Wallet Balance</Text>
            </Pressable>
            <Pressable onPress={() => router.push('/referrals')} style={[styles.statCard, { backgroundColor: colors.card, ...shadows.sm }]}>
              <Text style={[fontVariants.h4, { color: colors.secondary }]}>{user?.referralCode}</Text>
              <Text style={[fontVariants.caption, { color: colors.mutedForeground }]}>Referral Code</Text>
            </Pressable>
          </View>
        </LinearGradient>

        {/* Completion */}
        <View style={[styles.section, { backgroundColor: colors.card, ...shadows.sm }]}>
          <CompletionBar pct={user?.completionPct ?? 0} />
        </View>

        {/* Menu */}
        <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
          <Text style={[fontVariants.label, { color: colors.mutedForeground, marginBottom: 12 }]}>Account</Text>
          <View style={[styles.menuGroup, { backgroundColor: colors.card, ...shadows.sm }]}>
            <MenuItem icon="user" label="Edit Profile" onPress={() => router.push('/(auth)/complete-profile')} />
            <MenuItem icon="credit-card" label="Wallet" value={`₹${user?.walletBalance?.toLocaleString()}`} onPress={() => router.push('/wallet')} />
            <MenuItem icon="shopping-bag" label="My Bookings" onPress={() => router.push('/bookings')} />
            <MenuItem icon="package" label="Wish Orders" onPress={() => router.push('/wish-orders')} />
            <MenuItem icon="users" label="Loved Ones" onPress={() => router.push('/loved-ones')} />
            <MenuItem icon="heart" label="Following" onPress={() => router.push('/celebrities')} />
          </View>

          <Text style={[fontVariants.label, { color: colors.mutedForeground, marginBottom: 12, marginTop: 24 }]}>Earn</Text>
          <View style={[styles.menuGroup, { backgroundColor: colors.card, ...shadows.sm }]}>
            <MenuItem icon="share-2" label="Referrals" onPress={() => router.push('/referrals')} />
            <MenuItem icon="dollar-sign" label="Commission" value="₹0 earned" onPress={() => router.push('/referrals')} />
          </View>

          <Text style={[fontVariants.label, { color: colors.mutedForeground, marginBottom: 12, marginTop: 24 }]}>Preferences</Text>
          <View style={[styles.menuGroup, { backgroundColor: colors.card, ...shadows.sm }]}>
            <MenuItem icon="settings" label="Settings" onPress={() => router.push('/settings')} />
            <MenuItem icon="bell" label="Notifications" onPress={() => router.push('/settings')} />
          </View>

          <Text style={[fontVariants.label, { color: colors.mutedForeground, marginBottom: 12, marginTop: 24 }]}>Plan</Text>
          <Pressable
            onPress={() => router.push('/(auth)/select-plan')}
            style={{ marginBottom: 24 }}
          >
            <LinearGradient
              colors={PLAN_COLORS[user?.plan ?? 'free']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.upgradeBanner}
            >
              <View>
                <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 16, color: '#fff' }}>
                  {user?.plan === 'platinum' ? 'You\'re on Platinum!' : 'Upgrade Your Plan'}
                </Text>
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: 'rgba(255,255,255,0.85)', marginTop: 2 }}>
                  {user?.plan === 'platinum' ? 'Enjoy maximum benefits' : 'Unlock higher commissions & discounts'}
                </Text>
              </View>
              <Icon name="arrow-right" size={22} color="#fff" />
            </LinearGradient>
          </Pressable>

          <Pressable onPress={handleLogout} style={[styles.logoutBtn, { borderColor: colors.destructive }]}>
            <Icon name="log-out" size={18} color={colors.destructive} />
            <Text style={[fontVariants.bodySemibold, { color: colors.destructive }]}>Sign Out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { paddingHorizontal: 20, paddingBottom: 24, alignItems: 'center' },
  avatarWrap: { position: 'relative' },
  avatar: { width: 96, height: 96, borderRadius: 48 },
  avatarPlaceholder: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center' },
  editAvatar: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  planBadge: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 999 },
  statsRow: { flexDirection: 'row', gap: 12, marginTop: 20, width: '100%' },
  statCard: { flex: 1, borderRadius: 16, padding: 16, alignItems: 'center', gap: 4 },
  section: { marginHorizontal: 20, marginTop: 20, borderRadius: 16, padding: 20 },
  authIcon: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center' },
  authBtn: { paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  menuGroup: { borderRadius: 16, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(0,0,0,0.06)' },
  menuIconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  upgradeBanner: { borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16, borderRadius: 14, borderWidth: 1.5, marginBottom: 24 },
  progressTrack: { height: 8, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: 8, borderRadius: 4 },
});
