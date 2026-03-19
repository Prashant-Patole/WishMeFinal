import { Icon, IconName } from '@/components/Icon';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
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
import { shadows } from '@/constants/theme';

const ADD_AMOUNTS = [500, 1000, 2000, 5000, 10000];

const TRANSACTIONS: { id: string; type: string; label: string; amount: number; date: string; icon: IconName }[] = [
  { id: '1', type: 'deposit', label: 'Added via UPI', amount: 1000, date: 'Today, 2:30 PM', icon: 'arrow-down-left' },
  { id: '2', type: 'deduction', label: 'Booking - Ranveer Singh', amount: -2499, date: 'Yesterday, 6:15 PM', icon: 'arrow-up-right' },
  { id: '3', type: 'deposit', label: 'Referral Commission', amount: 175, date: '3 days ago', icon: 'gift' },
  { id: '4', type: 'deduction', label: 'AI Music Studio', amount: -200, date: '5 days ago', icon: 'music' },
  { id: '5', type: 'refund', label: 'Refund - Failed Generation', amount: 100, date: '1 week ago', icon: 'rotate-ccw' },
  { id: '6', type: 'deduction', label: 'Photo Wish', amount: -50, date: '2 weeks ago', icon: 'image' },
];

const FILTER_TABS = ['All', 'Deposits', 'Deductions', 'Refunds'];

function TransactionItem({ tx }: { tx: typeof TRANSACTIONS[0] }) {
  const { colors } = useTheme();
  const isPositive = tx.amount > 0;
  const iconColor = tx.type === 'deposit' ? '#22C55E' : tx.type === 'refund' ? '#3B82F6' : colors.destructive;

  return (
    <View style={[styles.txItem, { backgroundColor: colors.card }]}>
      <View style={[styles.txIcon, { backgroundColor: iconColor + '15' }]}>
        <Icon name={tx.icon} size={18} color={iconColor} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[fontVariants.captionMedium, { color: colors.foreground }]}>{tx.label}</Text>
        <Text style={[fontVariants.caption, { color: colors.mutedForeground, marginTop: 2 }]}>{tx.date}</Text>
      </View>
      <Text style={[fontVariants.bodySemibold, { color: isPositive ? '#22C55E' : colors.destructive }]}>
        {isPositive ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString()}
      </Text>
    </View>
  );
}

export default function WalletScreen() {
  const { colors, isDark, gradients } = useTheme();
  const { user, updateWallet } = useAuth();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const [selectedAmount, setSelectedAmount] = useState(1000);
  const [isAdding, setIsAdding] = useState(false);
  const [filterTab, setFilterTab] = useState('All');

  const handleAddMoney = () => {
    setIsAdding(true);
    setTimeout(() => {
      updateWallet(selectedAmount);
      setIsAdding(false);
    }, 2000);
  };

  const filtered = TRANSACTIONS.filter((tx) => {
    if (filterTab === 'All') return true;
    if (filterTab === 'Deposits') return tx.type === 'deposit';
    if (filterTab === 'Deductions') return tx.type === 'deduction';
    if (filterTab === 'Refunds') return tx.type === 'refund';
    return true;
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Header & Balance */}
        <LinearGradient
          colors={isDark ? gradients.primaryDark : gradients.primaryLight}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.hero, { paddingTop: topPad + 20 }]}
        >
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Icon name="arrow-left" size={20} color="#fff" />
          </Pressable>
          <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>WishMe Wallet</Text>
          <Text style={{ fontFamily: 'PlayfairDisplay_700Bold', fontSize: 48, color: '#fff', marginTop: 4 }}>
            ₹{user?.walletBalance?.toLocaleString() ?? '0'}
          </Text>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2 }}>
            Available Balance
          </Text>
        </LinearGradient>

        {/* Add Money */}
        <View style={{ padding: 20 }}>
          <View style={[styles.card, { backgroundColor: colors.card, ...shadows.md }]}>
            <Text style={[fontVariants.h4, { color: colors.foreground, marginBottom: 16 }]}>Add Money</Text>
            <View style={styles.amountGrid}>
              {ADD_AMOUNTS.map((amt) => (
                <Pressable
                  key={amt}
                  onPress={() => setSelectedAmount(amt)}
                  style={[
                    styles.amountChip,
                    {
                      backgroundColor: selectedAmount === amt ? colors.primary : colors.backgroundSecondary,
                      borderColor: selectedAmount === amt ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text style={[fontVariants.captionMedium, { color: selectedAmount === amt ? '#fff' : colors.foreground }]}>
                    ₹{amt.toLocaleString()}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={[styles.payInfo, { backgroundColor: colors.backgroundSecondary }]}>
              <Icon name="smartphone" size={16} color={colors.primary} />
              <Text style={[fontVariants.captionMedium, { color: colors.foreground }]}>
                Pay ₹{selectedAmount.toLocaleString()} via Razorpay
              </Text>
            </View>

            <Pressable onPress={handleAddMoney} disabled={isAdding} style={{ marginTop: 16 }}>
              <LinearGradient
                colors={['#FF6B33', '#B44CFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.addBtn}
              >
                {isAdding ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Icon name="plus" size={18} color="#fff" />
                    <Text style={{ color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 16 }}>
                      Add ₹{selectedAmount.toLocaleString()}
                    </Text>
                  </>
                )}
              </LinearGradient>
            </Pressable>
          </View>

          {/* Transactions */}
          <View style={{ marginTop: 28 }}>
            <Text style={[fontVariants.h4, { color: colors.foreground, marginBottom: 16 }]}>Transaction History</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
                {FILTER_TABS.map((tab) => (
                  <Pressable
                    key={tab}
                    onPress={() => setFilterTab(tab)}
                    style={[styles.filterChip, { backgroundColor: filterTab === tab ? colors.primary : colors.backgroundSecondary, borderColor: filterTab === tab ? colors.primary : colors.border }]}
                  >
                    <Text style={[fontVariants.captionMedium, { color: filterTab === tab ? '#fff' : colors.mutedForeground }]}>{tab}</Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
            <View style={{ gap: 10 }}>
              {filtered.length === 0 ? (
                <View style={styles.empty}>
                  <Icon name="inbox" size={40} color={colors.mutedForeground} />
                  <Text style={[fontVariants.body, { color: colors.mutedForeground, marginTop: 12 }]}>No transactions yet</Text>
                </View>
              ) : (
                filtered.map((tx) => <TransactionItem key={tx.id} tx={tx} />)
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { padding: 24, alignItems: 'center', paddingBottom: 40 },
  backBtn: { position: 'absolute', top: 0, left: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  card: { borderRadius: 20, padding: 20 },
  amountGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  amountChip: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, borderWidth: 1 },
  payInfo: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 12, marginTop: 16 },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 18, borderRadius: 14 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, borderWidth: 1 },
  txItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 14 },
  txIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  empty: { alignItems: 'center', paddingVertical: 48 },
});
