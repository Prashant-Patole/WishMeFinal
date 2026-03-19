import { Icon } from '@/components/Icon';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
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

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CELEBRITIES_DATA: Record<string, any> = {
  '1': { name: 'Ranveer Singh', category: 'Actor', rating: 4.9, reviews: 1240, price: 2499, image: 'https://picsum.photos/seed/ranveer/400/500', verified: true, followers: '42M', bookings: 1240, responseTime: '~2 hours', bio: 'Award-winning Bollywood actor known for his energetic performances and versatile roles. From Bajirao Mastani to Gully Boy, Ranveer brings passion to every project.', services: [{ id: 's1', name: 'Birthday Wish', price: 2499, desc: 'Personalized birthday message for you or your loved ones', icon: 'gift' }, { id: 's2', name: 'Business Shoutout', price: 4999, desc: 'Promote your brand or business to millions', icon: 'briefcase' }, { id: 's3', name: 'Voice Call (5 min)', price: 9999, desc: 'Live 1-on-1 call with Ranveer', icon: 'phone' }] },
  '2': { name: 'Shreya Ghoshal', category: 'Singer', rating: 4.8, reviews: 983, price: 1999, image: 'https://picsum.photos/seed/shreya/400/500', verified: true, followers: '28M', bookings: 983, responseTime: '~4 hours', bio: 'India\'s most beloved playback singer with a voice that touches millions. Shreya has sung over 3000 songs in multiple Indian languages.', services: [{ id: 's1', name: 'Wedding Song Wish', price: 1999, desc: 'A special message for the happy couple', icon: 'heart' }, { id: 's2', name: 'Birthday Song', price: 2499, desc: 'A personalized birthday song with your name', icon: 'music' }] },
  default: { name: 'Celebrity', category: 'Actor', rating: 4.7, reviews: 500, price: 1999, image: 'https://picsum.photos/seed/celeb/400/500', verified: true, followers: '5M', bookings: 500, responseTime: '~6 hours', bio: 'Talented artist with a massive fan following across India. Book a personalized message today!', services: [{ id: 's1', name: 'Birthday Wish', price: 1999, desc: 'A personalized birthday message', icon: 'gift' }] },
};

const REVIEWS = [
  { id: '1', name: 'Priya M.', rating: 5, text: 'Absolutely loved the video! My mom cried happy tears.', date: '2 weeks ago', avatar: 'https://picsum.photos/seed/rev1/60/60' },
  { id: '2', name: 'Amit K.', rating: 5, text: 'So professional and heartfelt. Worth every rupee!', date: '1 month ago', avatar: 'https://picsum.photos/seed/rev2/60/60' },
  { id: '3', name: 'Sneha R.', rating: 4, text: 'Great experience. Delivery was quick and message was personal.', date: '3 months ago', avatar: 'https://picsum.photos/seed/rev3/60/60' },
];

const TABS = ['About', 'Services', 'Reviews'];

function StarRating({ rating }: { rating: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Icon key={i} name="star" size={13} color={i <= rating ? '#FFB800' : '#D1D5DB'} />
      ))}
    </View>
  );
}

export default function CelebrityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const botPad = Platform.OS === 'web' ? 34 : 0;
  const [activeTab, setActiveTab] = useState('About');
  const [isFav, setIsFav] = useState(false);

  const celeb = CELEBRITIES_DATA[id ?? ''] ?? CELEBRITIES_DATA.default;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={{ position: 'relative' }}>
          <Image source={{ uri: celeb.image }} style={{ width: SCREEN_WIDTH, height: 380 }} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={StyleSheet.absoluteFillObject}
          />
          {/* Back Button */}
          <Pressable
            onPress={() => router.back()}
            style={[styles.backBtn, { top: topPad + 12 }]}
          >
            <Icon name="arrow-left" size={20} color="#fff" />
          </Pressable>
          {/* Fav Button */}
          <Pressable
            onPress={() => setIsFav(!isFav)}
            style={[styles.favBtn, { top: topPad + 12 }]}
          >
            <Icon name="heart" size={20} color={isFav ? '#FF6B33' : '#fff'} />
          </Pressable>
          {/* Celebrity Info overlay */}
          <View style={styles.heroInfo}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Text style={[fontVariants.h2, { color: '#fff' }]}>{celeb.name}</Text>
              {celeb.verified && (
                <View style={[styles.verifiedBadge, { backgroundColor: colors.primary }]}>
                  <Icon name="check" size={12} color="#fff" />
                </View>
              )}
            </View>
            <Text style={[fontVariants.body, { color: 'rgba(255,255,255,0.8)', marginBottom: 10 }]}>{celeb.category}</Text>
            <View style={{ flexDirection: 'row', gap: 16 }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 16, color: '#fff' }}>{celeb.followers}</Text>
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Followers</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 16, color: '#fff' }}>{celeb.bookings}</Text>
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Bookings</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 16, color: '#fff' }}>{celeb.rating}</Text>
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Rating</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 16, color: '#fff' }}>{celeb.responseTime}</Text>
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Response</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={[styles.tabs, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          {TABS.map((tab) => (
            <Pressable key={tab} onPress={() => setActiveTab(tab)} style={styles.tab}>
              <Text style={[fontVariants.bodySemibold, { color: activeTab === tab ? colors.primary : colors.mutedForeground }]}>
                {tab}
              </Text>
              {activeTab === tab && (
                <View style={[styles.tabUnderline, { backgroundColor: colors.primary }]} />
              )}
            </Pressable>
          ))}
        </View>

        <View style={{ padding: 20 }}>
          {activeTab === 'About' && (
            <View style={{ gap: 20 }}>
              <View>
                <Text style={[fontVariants.h4, { color: colors.foreground, marginBottom: 10 }]}>About</Text>
                <Text style={[fontVariants.body, { color: colors.mutedForeground, lineHeight: 24 }]}>{celeb.bio}</Text>
              </View>
              <View style={[styles.infoCard, { backgroundColor: colors.backgroundSecondary }]}>
                <View style={styles.infoRow}>
                  <Icon name="clock" size={16} color={colors.primary} />
                  <Text style={[fontVariants.captionMedium, { color: colors.foreground }]}>Typical response: {celeb.responseTime}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Icon name="star" size={16} color={colors.primary} />
                  <Text style={[fontVariants.captionMedium, { color: colors.foreground }]}>{celeb.rating} stars from {celeb.reviews.toLocaleString()} reviews</Text>
                </View>
                <View style={styles.infoRow}>
                  <Icon name="shield" size={16} color={colors.primary} />
                  <Text style={[fontVariants.captionMedium, { color: colors.foreground }]}>100% satisfaction guaranteed</Text>
                </View>
              </View>
            </View>
          )}

          {activeTab === 'Services' && (
            <View style={{ gap: 12 }}>
              <Text style={[fontVariants.h4, { color: colors.foreground, marginBottom: 4 }]}>Available Services</Text>
              {celeb.services.map((service: any) => (
                <View key={service.id} style={[styles.serviceCard, { backgroundColor: colors.card, ...shadows.sm }]}>
                  <View style={[styles.serviceIcon, { backgroundColor: colors.primary + '20' }]}>
                    <Icon name={service.icon} size={20} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[fontVariants.bodySemibold, { color: colors.foreground }]}>{service.name}</Text>
                    <Text style={[fontVariants.caption, { color: colors.mutedForeground, marginTop: 2 }]}>{service.desc}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end', gap: 8 }}>
                    <Text style={[fontVariants.bodySemibold, { color: colors.primary }]}>₹{service.price.toLocaleString()}</Text>
                    <Pressable
                      onPress={() => router.push(`/booking/${id}`)}
                      style={[styles.bookBtn, { backgroundColor: colors.primary }]}
                    >
                      <Text style={{ color: '#fff', fontSize: 12, fontFamily: 'Inter_600SemiBold' }}>Book</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          )}

          {activeTab === 'Reviews' && (
            <View style={{ gap: 14 }}>
              <View style={styles.ratingOverview}>
                <Text style={{ fontFamily: 'PlayfairDisplay_700Bold', fontSize: 48, color: colors.foreground }}>{celeb.rating}</Text>
                <View style={{ gap: 4 }}>
                  <StarRating rating={Math.round(celeb.rating)} />
                  <Text style={[fontVariants.caption, { color: colors.mutedForeground }]}>{celeb.reviews.toLocaleString()} reviews</Text>
                </View>
              </View>
              {REVIEWS.map((review) => (
                <View key={review.id} style={[styles.reviewCard, { backgroundColor: colors.card, ...shadows.sm }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <Image source={{ uri: review.avatar }} style={styles.reviewAvatar} />
                    <View style={{ flex: 1 }}>
                      <Text style={[fontVariants.captionMedium, { color: colors.foreground }]}>{review.name}</Text>
                      <StarRating rating={review.rating} />
                    </View>
                    <Text style={[fontVariants.caption, { color: colors.mutedForeground }]}>{review.date}</Text>
                  </View>
                  <Text style={[fontVariants.caption, { color: colors.mutedForeground, lineHeight: 20 }]}>{review.text}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Book Button */}
      <View style={[styles.footer, { paddingBottom: botPad + 16, backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <View>
          <Text style={[fontVariants.caption, { color: colors.mutedForeground }]}>Starting from</Text>
          <Text style={[fontVariants.h3, { color: colors.primary }]}>₹{celeb.price.toLocaleString()}</Text>
        </View>
        <Pressable onPress={() => router.push(`/booking/${id}`)} style={{ flex: 1 }}>
          <LinearGradient
            colors={['#FF6B33', '#B44CFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.bookNowBtn}
          >
            <Icon name="video" size={18} color="#fff" />
            <Text style={{ color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 16 }}>Book Now</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backBtn: { position: 'absolute', left: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  favBtn: { position: 'absolute', right: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  heroInfo: { position: 'absolute', bottom: 24, left: 20, right: 20 },
  verifiedBadge: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#fff' },
  tabs: { flexDirection: 'row', borderBottomWidth: 1 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 14, position: 'relative' },
  tabUnderline: { position: 'absolute', bottom: 0, left: '20%', right: '20%', height: 3, borderTopLeftRadius: 2, borderTopRightRadius: 2 },
  infoCard: { borderRadius: 14, padding: 16, gap: 10 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  serviceCard: { borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14 },
  serviceIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  bookBtn: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 999 },
  ratingOverview: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  reviewCard: { borderRadius: 14, padding: 16 },
  reviewAvatar: { width: 40, height: 40, borderRadius: 20 },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 20, paddingTop: 16, borderTopWidth: StyleSheet.hairlineWidth },
  bookNowBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16, borderRadius: 14 },
});
