import { Icon, IconName } from '@/components/Icon';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/contexts/ThemeContext';
import { fontVariants } from '@/constants/fonts';
import { shadows } from '@/constants/theme';

const UPCOMING = [
  { id: '1', person: 'Mom', occasion: 'Birthday', date: 'in 3 days', daysLeft: 3, gradient: ['#FF6B33', '#E8527A'] as const },
  { id: '2', person: 'Dad & Mom', occasion: 'Anniversary', date: 'in 12 days', daysLeft: 12, gradient: ['#B44CFF', '#7B2FFF'] as const },
  { id: '3', person: 'Raj (Friend)', occasion: 'Birthday', date: 'in 28 days', daysLeft: 28, gradient: ['#22C55E', '#15803D'] as const },
];

const ALL_OCCASIONS: { id: string; label: string; icon: IconName; color: string }[] = [
  { id: 'birthday', label: 'Birthday', icon: 'gift', color: '#FF6B33' },
  { id: 'anniversary', label: 'Anniversary', icon: 'heart', color: '#E8527A' },
  { id: 'wedding', label: 'Wedding', icon: 'users', color: '#B44CFF' },
  { id: 'graduation', label: 'Graduation', icon: 'award', color: '#3B82F6' },
  { id: 'farewell', label: 'Farewell', icon: 'log-out', color: '#F59E0B' },
  { id: 'baby-shower', label: 'Baby Shower', icon: 'star', color: '#EC4899' },
  { id: 'festive', label: 'Festive', icon: 'sun', color: '#22C55E' },
  { id: 'custom', label: 'Custom', icon: 'edit', color: '#6B7085' },
];

export default function OccasionsScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()}>
          <Icon name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[fontVariants.h4, { color: colors.foreground, flex: 1, marginLeft: 12 }]}>Occasions</Text>
      </View>

      <FlatList
        data={UPCOMING}
        keyExtractor={(o) => o.id}
        contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <Text style={[fontVariants.h4, { color: colors.foreground, marginBottom: 16 }]}>Upcoming Occasions</Text>
          </>
        }
        renderItem={({ item }) => (
          <LinearGradient colors={item.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.upcomingCard}>
            <View style={{ flex: 1 }}>
              <Text style={[fontVariants.caption, { color: 'rgba(255,255,255,0.8)' }]}>{item.occasion}</Text>
              <Text style={[fontVariants.h4, { color: '#fff', marginTop: 2 }]}>{item.person}</Text>
              <Text style={[fontVariants.captionMedium, { color: 'rgba(255,255,255,0.9)', marginTop: 4 }]}>{item.date}</Text>
            </View>
            <View style={{ alignItems: 'flex-end', gap: 8 }}>
              <View style={[styles.daysBadge, { backgroundColor: 'rgba(255,255,255,0.25)' }]}>
                <Text style={{ fontFamily: 'PlayfairDisplay_700Bold', fontSize: 24, color: '#fff' }}>{item.daysLeft}</Text>
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 10, color: 'rgba(255,255,255,0.85)' }}>days</Text>
              </View>
              <Pressable onPress={() => router.push('/celebrities')} style={styles.bookBtn}>
                <Text style={{ color: item.gradient[0], fontSize: 12, fontFamily: 'Inter_700Bold' }}>Book</Text>
              </Pressable>
            </View>
          </LinearGradient>
        )}
        ListFooterComponent={
          <View style={{ marginTop: 8, gap: 16 }}>
            <Text style={[fontVariants.h4, { color: colors.foreground }]}>Browse by Occasion</Text>
            <View style={styles.grid}>
              {ALL_OCCASIONS.map((o) => (
                <Pressable key={o.id} onPress={() => router.push('/celebrities')} style={[styles.occasionCard, { backgroundColor: colors.card, ...shadows.sm }]}>
                  <View style={[styles.occasionIcon, { backgroundColor: o.color + '20' }]}>
                    <Icon name={o.icon} size={22} color={o.color} />
                  </View>
                  <Text style={[fontVariants.captionMedium, { color: colors.foreground, textAlign: 'center', marginTop: 8 }]}>{o.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  upcomingCard: { borderRadius: 20, padding: 20, flexDirection: 'row', alignItems: 'center' },
  daysBadge: { borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, alignItems: 'center' },
  bookBtn: { backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  occasionCard: { width: '22%', alignItems: 'center', borderRadius: 16, padding: 14 },
  occasionIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
});
