import { Icon } from '@/components/Icon';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/contexts/ThemeContext';
import { fontVariants, fontSize } from '@/constants/fonts';
import { radius, shadows } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CATEGORIES = ['All', 'Actors', 'Musicians', 'Influencers', 'Athletes', 'Politicians'];

const ALL_CELEBRITIES = [
  { id: '1', name: 'Ranveer Singh', category: 'Actors', rating: 4.9, reviews: 1240, price: 2499, image: 'https://picsum.photos/seed/ranveer/300/300', verified: true, responseTime: '2h' },
  { id: '2', name: 'Shreya Ghoshal', category: 'Musicians', rating: 4.8, reviews: 983, price: 1999, image: 'https://picsum.photos/seed/shreya/300/300', verified: true, responseTime: '4h' },
  { id: '3', name: 'Virat Kohli', category: 'Athletes', rating: 4.9, reviews: 2100, price: 4999, image: 'https://picsum.photos/seed/virat/300/300', verified: true, responseTime: '1h' },
  { id: '4', name: 'Alia Bhatt', category: 'Actors', rating: 4.7, reviews: 876, price: 3499, image: 'https://picsum.photos/seed/alia/300/300', verified: true, responseTime: '3h' },
  { id: '5', name: 'Arijit Singh', category: 'Musicians', rating: 4.9, reviews: 1567, price: 2999, image: 'https://picsum.photos/seed/arijit/300/300', verified: true, responseTime: '6h' },
  { id: '6', name: 'MS Dhoni', category: 'Athletes', rating: 4.8, reviews: 3200, price: 5999, image: 'https://picsum.photos/seed/dhoni/300/300', verified: true, responseTime: '12h' },
  { id: '7', name: 'Priyanka Chopra', category: 'Actors', rating: 4.8, reviews: 1890, price: 6999, image: 'https://picsum.photos/seed/priyanka/300/300', verified: true, responseTime: '8h' },
  { id: '8', name: 'AR Rahman', category: 'Musicians', rating: 5.0, reviews: 2450, price: 8999, image: 'https://picsum.photos/seed/rahman/300/300', verified: true, responseTime: '24h' },
  { id: '9', name: 'Narendra Modi', category: 'Politicians', rating: 4.6, reviews: 5200, price: 9999, image: 'https://picsum.photos/seed/modi/300/300', verified: true, responseTime: '48h' },
  { id: '10', name: 'Bhuvan Bam', category: 'Influencers', rating: 4.7, reviews: 890, price: 999, image: 'https://picsum.photos/seed/bhuvan/300/300', verified: true, responseTime: '2h' },
  { id: '11', name: 'Carry Minati', category: 'Influencers', rating: 4.6, reviews: 670, price: 799, image: 'https://picsum.photos/seed/carry/300/300', verified: false, responseTime: '4h' },
  { id: '12', name: 'PV Sindhu', category: 'Athletes', rating: 4.8, reviews: 1100, price: 2999, image: 'https://picsum.photos/seed/sindhu/300/300', verified: true, responseTime: '6h' },
];

function CelebGridCard({ celeb }: { celeb: typeof ALL_CELEBRITIES[0] }) {
  const { colors } = useTheme();
  const cardW = (SCREEN_WIDTH - 52) / 2;

  return (
    <Pressable
      onPress={() => router.push(`/celebrity/${celeb.id}`)}
      style={[styles.gridCard, { width: cardW, backgroundColor: colors.card, ...shadows.sm }]}
    >
      <View style={{ position: 'relative' }}>
        <Image source={{ uri: celeb.image }} style={[styles.gridImage, { width: cardW }]} />
        {celeb.verified && (
          <View style={[styles.verifiedBadge, { backgroundColor: colors.primary }]}>
            <Icon name="check" size={10} color="#fff" />
          </View>
        )}
        <View style={[styles.responseBadge, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
          <Icon name="clock" size={10} color="#fff" />
          <Text style={{ color: '#fff', fontSize: 10, fontFamily: 'Inter_500Medium', marginLeft: 3 }}>
            {celeb.responseTime}
          </Text>
        </View>
      </View>
      <View style={styles.gridInfo}>
        <Text style={[fontVariants.bodySemibold, { color: colors.foreground, fontSize: 14 }]} numberOfLines={1}>
          {celeb.name}
        </Text>
        <Text style={[fontVariants.caption, { color: colors.mutedForeground, fontSize: 12 }]}>
          {celeb.category}
        </Text>
        <View style={styles.ratingRow}>
          <Icon name="star" size={11} color="#FFB800" />
          <Text style={[fontVariants.captionMedium, { color: colors.foreground, fontSize: 12, marginLeft: 3 }]}>
            {celeb.rating}
          </Text>
          <Text style={[fontVariants.caption, { color: colors.mutedForeground, fontSize: 11, marginLeft: 2 }]}>
            ({celeb.reviews})
          </Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={[fontVariants.bodySemibold, { color: colors.primary }]}>₹{celeb.price.toLocaleString()}</Text>
          <Pressable
            onPress={() => router.push(`/booking/${celeb.id}`)}
            style={[styles.bookBtn, { backgroundColor: colors.primary }]}
          >
            <Text style={{ color: '#fff', fontSize: 11, fontFamily: 'Inter_600SemiBold' }}>Book</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

export default function CelebritiesScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const filtered = ALL_CELEBRITIES.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === 'All' || c.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.background }]}>
        <Text style={[fontVariants.h3, { color: colors.foreground, marginBottom: 16 }]}>Celebrities</Text>

        {/* Search */}
        <View style={[styles.searchBar, { backgroundColor: colors.input, borderColor: colors.border }]}>
          <Icon name="search" size={18} color={colors.mutedForeground} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search celebrities…"
            placeholderTextColor={colors.mutedForeground}
            style={[fontVariants.body, { color: colors.foreground, flex: 1 }]}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')}>
              <Icon name="x" size={16} color={colors.mutedForeground} />
            </Pressable>
          )}
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
          <View style={styles.categories}>
            {CATEGORIES.map((cat) => (
              <Pressable
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: selectedCategory === cat ? colors.primary : colors.backgroundSecondary,
                    borderColor: selectedCategory === cat ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    fontVariants.captionMedium,
                    { color: selectedCategory === cat ? '#fff' : colors.mutedForeground },
                  ]}
                >
                  {cat}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        <Text style={[fontVariants.caption, { color: colors.mutedForeground, marginTop: 12 }]}>
          {filtered.length} celebrities found
        </Text>
      </View>

      {/* Grid */}
      <FlatList
        data={filtered}
        numColumns={2}
        keyExtractor={(c) => c.id}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={{ gap: 12 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <CelebGridCard celeb={item} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Icon name="search" size={48} color={colors.mutedForeground} />
            <Text style={[fontVariants.h4, { color: colors.foreground, marginTop: 16 }]}>No celebrities found</Text>
            <Text style={[fontVariants.body, { color: colors.mutedForeground, textAlign: 'center', marginTop: 8 }]}>
              Try a different search or category
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 4 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  categories: { flexDirection: 'row', gap: 8, paddingBottom: 2 },
  categoryChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, borderWidth: 1 },
  grid: { padding: 16, gap: 12, paddingBottom: 100 },
  gridCard: { borderRadius: 16, overflow: 'hidden' },
  gridImage: { height: 170 },
  verifiedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  responseBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  gridInfo: { padding: 12, gap: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 },
  bookBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
});
