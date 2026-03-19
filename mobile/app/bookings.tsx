import { Icon } from '@/components/Icon';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
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

const STATUS_COLORS: Record<string, string> = {
  pending: '#F59E0B',
  'in-progress': '#3B82F6',
  completed: '#22C55E',
  cancelled: '#EF4444',
};

const BOOKINGS = [
  { id: 'WM12345678', celebrity: 'Ranveer Singh', image: 'https://picsum.photos/seed/ranveer/80/80', occasion: 'Birthday', status: 'in-progress', price: 2499, date: '2 days ago', for: 'My Sister' },
  { id: 'WM87654321', celebrity: 'Shreya Ghoshal', image: 'https://picsum.photos/seed/shreya/80/80', occasion: 'Anniversary', status: 'completed', price: 1999, date: '2 weeks ago', for: 'My Parents' },
  { id: 'WM11223344', celebrity: 'Bhuvan Bam', image: 'https://picsum.photos/seed/bhuvan/80/80', occasion: 'Farewell', status: 'pending', price: 999, date: '1 day ago', for: 'My Friend Raj' },
];

const FILTER_TABS = ['All', 'Pending', 'In Progress', 'Completed', 'Cancelled'];

function BookingCard({ booking }: { booking: typeof BOOKINGS[0] }) {
  const { colors } = useTheme();
  const statusColor = STATUS_COLORS[booking.status] ?? colors.mutedForeground;

  return (
    <View style={[styles.card, { backgroundColor: colors.card, ...shadows.sm }]}>
      <View style={styles.cardHeader}>
        <Image source={{ uri: booking.image }} style={styles.celebImage} />
        <View style={{ flex: 1 }}>
          <Text style={[fontVariants.bodySemibold, { color: colors.foreground }]}>{booking.celebrity}</Text>
          <Text style={[fontVariants.caption, { color: colors.mutedForeground }]}>{booking.occasion} for {booking.for}</Text>
          <Text style={[fontVariants.caption, { color: colors.mutedForeground }]}>{booking.date}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
          <Text style={{ color: statusColor, fontSize: 11, fontFamily: 'Inter_600SemiBold', textTransform: 'capitalize' }}>
            {booking.status.replace('-', ' ')}
          </Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={styles.cardFooter}>
        <View>
          <Text style={[fontVariants.caption, { color: colors.mutedForeground }]}>Order ID</Text>
          <Text style={[fontVariants.captionMedium, { color: colors.foreground }]}>{booking.id}</Text>
        </View>
        <Text style={[fontVariants.bodySemibold, { color: colors.primary }]}>₹{booking.price.toLocaleString()}</Text>
        <Pressable
          onPress={() => router.push(`/chat/1`)}
          style={[styles.chatBtn, { backgroundColor: colors.backgroundSecondary }]}
        >
          <Icon name="message-circle" size={16} color={colors.foreground} />
          <Text style={[fontVariants.captionMedium, { color: colors.foreground }]}>Chat</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function BookingsScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const [filterTab, setFilterTab] = useState('All');

  const filtered = BOOKINGS.filter((b) => {
    if (filterTab === 'All') return true;
    return b.status === filterTab.toLowerCase().replace(' ', '-');
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()}>
          <Icon name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[fontVariants.h4, { color: colors.foreground, flex: 1, marginLeft: 12 }]}>My Bookings</Text>
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
        keyExtractor={(b) => b.id}
        contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <BookingCard booking={item} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Icon name="package" size={48} color={colors.mutedForeground} />
            <Text style={[fontVariants.h4, { color: colors.foreground, marginTop: 16 }]}>No bookings yet</Text>
            <Pressable onPress={() => router.push('/celebrities')} style={{ marginTop: 16 }}>
              <LinearGradient colors={['#FF6B33', '#B44CFF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.browseBtn}>
                <Text style={{ color: '#fff', fontFamily: 'Inter_600SemiBold' }}>Browse Celebrities</Text>
              </LinearGradient>
            </Pressable>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, borderWidth: 1 },
  card: { borderRadius: 16, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
  celebImage: { width: 52, height: 52, borderRadius: 12 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  divider: { height: StyleSheet.hairlineWidth, marginHorizontal: 16 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, paddingTop: 12 },
  chatBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999 },
  empty: { alignItems: 'center', paddingTop: 80 },
  browseBtn: { paddingHorizontal: 24, paddingVertical: 14, borderRadius: 14 },
});
