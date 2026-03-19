import { Icon, IconName } from '@/components/Icon';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/contexts/ThemeContext';
import { fontVariants } from '@/constants/fonts';
import { shadows } from '@/constants/theme';

const WISH_ORDERS: { id: string; type: string; for: string; status: string; price: number; date: string; icon: IconName }[] = [
  { id: '1', type: 'Photo Wish', for: 'Mom - Birthday', status: 'completed', price: 29, date: '3 days ago', icon: 'image' },
  { id: '2', type: 'Greeting Card', for: 'Dad - Anniversary', status: 'completed', price: 0, date: '1 week ago', icon: 'mail' },
  { id: '3', type: 'AI Music', for: 'Wedding Song', status: 'completed', price: 200, date: '2 weeks ago', icon: 'music' },
];

const FILTER_TABS = ['All', 'Photo Wish', 'Greeting Card', 'AI Music'];

function OrderCard({ order }: { order: typeof WISH_ORDERS[0] }) {
  const { colors } = useTheme();
  const iconColors: Record<string, string> = { image: '#FF6B33', mail: '#B44CFF', music: '#3B82F6' };
  const iconColor = iconColors[order.icon] ?? colors.primary;

  return (
    <View style={[styles.card, { backgroundColor: colors.card, ...shadows.sm }]}>
      <View style={[styles.cardIcon, { backgroundColor: iconColor + '20' }]}>
        <Icon name={order.icon} size={22} color={iconColor} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[fontVariants.bodySemibold, { color: colors.foreground }]}>{order.type}</Text>
        <Text style={[fontVariants.caption, { color: colors.mutedForeground }]}>{order.for}</Text>
        <Text style={[fontVariants.caption, { color: colors.mutedForeground }]}>{order.date}</Text>
      </View>
      <View style={{ alignItems: 'flex-end', gap: 6 }}>
        <Text style={[fontVariants.bodySemibold, { color: order.price === 0 ? '#22C55E' : colors.primary }]}>
          {order.price === 0 ? 'Free' : `₹${order.price}`}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: '#22C55E20' }]}>
          <Text style={{ color: '#22C55E', fontSize: 10, fontFamily: 'Inter_600SemiBold', textTransform: 'capitalize' }}>
            {order.status}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function WishOrdersScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const [filterTab, setFilterTab] = useState('All');

  const filtered = WISH_ORDERS.filter((o) => filterTab === 'All' || o.type === filterTab);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()}>
          <Icon name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[fontVariants.h4, { color: colors.foreground, flex: 1, marginLeft: 12 }]}>Wish Orders</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ borderBottomWidth: 1, borderBottomColor: colors.border, maxHeight: 56 }} contentContainerStyle={{ paddingHorizontal: 16, gap: 8, alignItems: 'center', paddingVertical: 10 }}>
        {FILTER_TABS.map((tab) => (
          <Pressable key={tab} onPress={() => setFilterTab(tab)} style={[styles.filterChip, { backgroundColor: filterTab === tab ? colors.primary : colors.backgroundSecondary, borderColor: filterTab === tab ? colors.primary : colors.border }]}>
            <Text style={[fontVariants.captionMedium, { color: filterTab === tab ? '#fff' : colors.mutedForeground }]}>{tab}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={(o) => o.id}
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <OrderCard order={item} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Icon name="inbox" size={48} color={colors.mutedForeground} />
            <Text style={[fontVariants.h4, { color: colors.foreground, marginTop: 16 }]}>No wish orders yet</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, borderWidth: 1 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 16, padding: 16 },
  cardIcon: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  empty: { alignItems: 'center', paddingTop: 80 },
});
