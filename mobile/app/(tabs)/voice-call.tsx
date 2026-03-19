import { Icon } from '@/components/Icon';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { fontVariants } from '@/constants/fonts';
import { radius, shadows } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CALL_CELEBRITIES = [
  { id: '1', name: 'Ranveer Singh', category: 'Actor', price: 4999, duration: '5 min', image: 'https://picsum.photos/seed/ranveer/300/300', available: true },
  { id: '2', name: 'Bhuvan Bam', category: 'YouTuber', price: 1999, duration: '10 min', image: 'https://picsum.photos/seed/bhuvan/300/300', available: true },
  { id: '3', name: 'Shreya Ghoshal', category: 'Singer', price: 3499, duration: '5 min', image: 'https://picsum.photos/seed/shreya/300/300', available: false },
  { id: '4', name: 'MS Dhoni', category: 'Cricketer', price: 9999, duration: '5 min', image: 'https://picsum.photos/seed/dhoni/300/300', available: false },
  { id: '5', name: 'Carry Minati', category: 'YouTuber', price: 1499, duration: '10 min', image: 'https://picsum.photos/seed/carry/300/300', available: true },
  { id: '6', name: 'Alia Bhatt', category: 'Actor', price: 5999, duration: '5 min', image: 'https://picsum.photos/seed/alia/300/300', available: false },
];

function CallCard({ celeb }: { celeb: typeof CALL_CELEBRITIES[0] }) {
  const { colors } = useTheme();
  const { user } = useAuth();

  const handleBook = () => {
    if (!user) { router.push('/(auth)/login'); return; }
    router.push(`/booking/${celeb.id}`);
  };

  return (
    <Pressable style={[styles.callCard, { backgroundColor: colors.card, ...shadows.md }]}>
      <Image source={{ uri: celeb.image }} style={styles.callImage} />
      <View style={[styles.availBadge, { backgroundColor: celeb.available ? '#22C55E' : colors.muted }]}>
        <View style={[styles.dot, { backgroundColor: celeb.available ? '#fff' : colors.mutedForeground }]} />
        <Text style={{ color: celeb.available ? '#fff' : colors.mutedForeground, fontSize: 10, fontFamily: 'Inter_500Medium' }}>
          {celeb.available ? 'Available' : 'Busy'}
        </Text>
      </View>
      <View style={styles.callInfo}>
        <View style={{ flex: 1 }}>
          <Text style={[fontVariants.bodySemibold, { color: colors.foreground }]}>{celeb.name}</Text>
          <Text style={[fontVariants.caption, { color: colors.mutedForeground }]}>{celeb.category}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
            <Icon name="clock" size={12} color={colors.mutedForeground} />
            <Text style={[fontVariants.caption, { color: colors.mutedForeground }]}>{celeb.duration}</Text>
          </View>
        </View>
        <View style={{ alignItems: 'flex-end', gap: 8 }}>
          <Text style={[fontVariants.bodySemibold, { color: colors.primary }]}>₹{celeb.price.toLocaleString()}</Text>
          <Pressable
            onPress={handleBook}
            style={[
              styles.callBtn,
              { backgroundColor: celeb.available ? colors.primary : colors.muted },
            ]}
          >
            <Icon name="phone" size={14} color={celeb.available ? '#fff' : colors.mutedForeground} />
            <Text style={{ color: celeb.available ? '#fff' : colors.mutedForeground, fontSize: 12, fontFamily: 'Inter_600SemiBold' }}>
              {celeb.available ? 'Book Call' : 'Notify Me'}
            </Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

export default function VoiceCallScreen() {
  const { colors, isDark, gradients } = useTheme();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={CALL_CELEBRITIES}
        keyExtractor={(c) => c.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Hero */}
            <LinearGradient
              colors={['#FF6B33', '#E8527A', '#B44CFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.hero, { paddingTop: topPad + 20 }]}
            >
              <View style={styles.heroIcon}>
                <Icon name="phone" size={32} color="#FF6B33" />
              </View>
              <Text style={[fontVariants.h2, { color: '#fff', textAlign: 'center', marginTop: 16, marginBottom: 8 }]}>
                Celebrity Voice Call
              </Text>
              <Text style={[fontVariants.body, { color: 'rgba(255,255,255,0.85)', textAlign: 'center' }]}>
                Book a live 1-on-1 voice call{'\n'}with your favourite celebrities
              </Text>

              <View style={styles.statsRow}>
                {[
                  { label: 'Celebrities', value: '150+' },
                  { label: 'Calls Done', value: '50K+' },
                  { label: 'Min Duration', value: '5 min' },
                ].map((s) => (
                  <View key={s.label} style={styles.stat}>
                    <Text style={{ fontFamily: 'PlayfairDisplay_700Bold', fontSize: 22, color: '#fff' }}>{s.value}</Text>
                    <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>{s.label}</Text>
                  </View>
                ))}
              </View>
            </LinearGradient>

            {/* How it works */}
            <View style={{ paddingHorizontal: 20, marginTop: 24, marginBottom: 8 }}>
              <Text style={[fontVariants.h4, { color: colors.foreground, marginBottom: 16 }]}>Book a Call</Text>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
            <CallCard celeb={item} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { padding: 24, alignItems: 'center', paddingBottom: 32 },
  heroIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: { flexDirection: 'row', marginTop: 28, gap: 32 },
  stat: { alignItems: 'center' },
  callCard: { borderRadius: 16, overflow: 'hidden' },
  callImage: { width: '100%', height: 160 },
  availBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  callInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
});
