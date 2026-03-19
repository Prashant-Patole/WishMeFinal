import { Icon, IconName } from '@/components/Icon';
import { Video, ResizeMode, AVPlaybackSource } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/contexts/AuthContext';
import { useDrawer } from '@/contexts/DrawerContext';
import { useTheme } from '@/contexts/ThemeContext';
import { fontVariants, fontSize } from '@/constants/fonts';
import { radius, shadows } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const BANNERS = [
  { id: '1', title: 'Get a Birthday Wish\nfrom Your Idol', subtitle: 'Starting from ₹999', gradient: ['#FF6B33', '#E8527A', '#B44CFF'] as const },
  { id: '2', title: 'AI Music Studio\nNow Live!', subtitle: 'Generate songs in seconds', gradient: ['#B44CFF', '#7B2FFF', '#4B0082'] as const },
  { id: '3', title: 'Book a Voice Call\nwith Celebrities', subtitle: 'Live 1-on-1 sessions', gradient: ['#FF6B33', '#FF8C42', '#FFB347'] as const },
];

const CELEBRITIES = [
  { id: '1', name: 'Ranveer Singh', category: 'Actor', rating: 4.9, reviews: 1240, price: 2499, image: 'https://picsum.photos/seed/ranveer/200/200', verified: true },
  { id: '2', name: 'Shreya Ghoshal', category: 'Singer', rating: 4.8, reviews: 983, price: 1999, image: 'https://picsum.photos/seed/shreya/200/200', verified: true },
  { id: '3', name: 'Virat Kohli', category: 'Athlete', rating: 4.9, reviews: 2100, price: 4999, image: 'https://picsum.photos/seed/virat/200/200', verified: true },
  { id: '4', name: 'Alia Bhatt', category: 'Actor', rating: 4.7, reviews: 876, price: 3499, image: 'https://picsum.photos/seed/alia/200/200', verified: true },
];

const QUICK_ACTIONS: { id: string; icon: IconName; label: string; color: string; route: string }[] = [
  { id: 'wish-friend', icon: 'video', label: 'Wish a\nFriend', color: '#FF6B33', route: '/celebrities' },
  { id: 'wish-celebrity', icon: 'heart', label: 'Wish a\nCelebrity', color: '#E8527A', route: '/wish-celebrity' },
  { id: 'ai-music', icon: 'music', label: 'AI Music\nStudio', color: '#B44CFF', route: '/(tabs)/music' },
  { id: 'photo-wish', icon: 'image', label: 'Photo\nWish', color: '#FF8C42', route: '/photo-wish' },
  { id: 'greeting', icon: 'mail', label: 'Greeting\nCards', color: '#7B2FFF', route: '/greeting-cards' },
  { id: 'voice-call', icon: 'phone', label: 'Voice\nCall', color: '#FF6B33', route: '/(tabs)/voice-call' },
];

const VIDEO_WISHES: {
  id: string;
  title: string;
  desc: string;
  videoUri: string | number;
  gradient: readonly [string, string, string];
  tag: string;
}[] = [
  {
    id: '1',
    title: 'Celebrate Academic Success',
    desc: "Recognise their dedication with a personal celebrity video message. Whether it's cracking an entrance exam or walking the graduation stage, make the achievement unforgettable.",
    videoUri: require('../../assets/videos/graduation-wish.mp4'),
    gradient: ['#3B82F6', '#0EA5E9', '#06B6D4'],
    tag: 'Graduation',
  },
  {
    id: '2',
    title: 'Make Birthdays Special',
    desc: 'Turn any birthday into a moment they will talk about forever. A surprise celebrity video wish is the most personal, heartfelt gift you can give.',
    videoUri: require('../../assets/videos/happy-birthday.mp4'),
    gradient: ['#FF6B33', '#E8527A', '#FF8C42'],
    tag: 'Birthday',
  },
  {
    id: '3',
    title: 'Honor Love & Commitment',
    desc: 'Celebrate their special bond with personalized video wishes. Create beautiful memories with custom anniversary messages that touch hearts.',
    videoUri: require('../../assets/videos/wedding-anniversary.mp4'),
    gradient: ['#B44CFF', '#7B2FFF', '#E8527A'],
    tag: 'Anniversary',
  },
];

function BannerCard({ banner }: { banner: typeof BANNERS[0] }) {
  return (
    <LinearGradient
      colors={banner.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.bannerCard}
    >
      <Text style={styles.bannerTitle}>{banner.title}</Text>
      <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
      <View style={styles.bannerButton}>
        <Text style={styles.bannerButtonText}>Book Now</Text>
        <Icon name="arrow-right" size={14} color="#FF6B33" />
      </View>
    </LinearGradient>
  );
}

function CelebCard({ celeb }: { celeb: typeof CELEBRITIES[0] }) {
  const { colors, isDark } = useTheme();
  return (
    <Pressable
      onPress={() => router.push(`/celebrity/${celeb.id}`)}
      style={[styles.celebCard, { backgroundColor: colors.card, ...shadows.md }]}
    >
      <Image source={{ uri: celeb.image }} style={styles.celebImage} />
      {celeb.verified && (
        <View style={[styles.verifiedBadge, { backgroundColor: colors.primary }]}>
          <Icon name="check" size={10} color="#fff" />
        </View>
      )}
      <View style={styles.celebInfo}>
        <Text style={[fontVariants.captionMedium, { color: colors.foreground }]} numberOfLines={1}>{celeb.name}</Text>
        <Text style={[fontVariants.caption, { color: colors.mutedForeground, fontSize: 11 }]}>{celeb.category}</Text>
        <View style={styles.ratingRow}>
          <Icon name="star" size={10} color="#FFB800" />
          <Text style={[fontVariants.caption, { color: colors.mutedForeground, fontSize: 11 }]}> {celeb.rating}</Text>
        </View>
        <Text style={[fontVariants.captionMedium, { color: colors.primary, fontSize: 12 }]}>₹{celeb.price}</Text>
      </View>
    </Pressable>
  );
}

function QuickAction({ action }: { action: typeof QUICK_ACTIONS[0] }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={() => router.push(action.route as any)}
      style={[styles.quickAction, { backgroundColor: colors.card, ...shadows.sm }]}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: action.color + '20' }]}>
        <Icon name={action.icon} size={22} color={action.color} />
      </View>
      <Text style={[fontVariants.caption, { color: colors.foreground, textAlign: 'center', marginTop: 6 }]}>
        {action.label}
      </Text>
    </Pressable>
  );
}

function VideoWishCard({ wish, isVisible = false }: { wish: typeof VIDEO_WISHES[0]; isVisible?: boolean }) {
  const { colors } = useTheme();
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  const source: AVPlaybackSource | null = wish.videoUri
    ? (typeof wish.videoUri === 'number' ? wish.videoUri : { uri: wish.videoUri as string })
    : null;

  return (
    <View style={[styles.videoWishCard, { backgroundColor: colors.card, ...shadows.md }]}>
      {source ? (
        <View style={styles.videoThumbContainer}>
          <Video
            source={source}
            style={styles.videoThumb}
            resizeMode={ResizeMode.COVER}
            shouldPlay={isVisible && isPlaying}
            isLooping
            isMuted={isMuted}
          />
          <Pressable
            onPress={() => setIsPlaying(p => !p)}
            style={[styles.videoPlayPauseBtn, { backgroundColor: colors.background + '59' }]}
          >
            <Icon name={isPlaying ? 'pause' : 'play-circle'} size={28} color={colors.secondaryForeground} />
          </Pressable>
          <View style={[styles.videoTag, { backgroundColor: colors.background + '59' }]}>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 11, color: colors.secondaryForeground, letterSpacing: 0.5 }}>
              {wish.tag}
            </Text>
          </View>
          <Pressable onPress={() => setIsMuted(m => !m)} style={[styles.videoMuteBtn, { backgroundColor: colors.background + '59' }]}>
            <Icon name={isMuted ? 'volume-x' : 'volume-2'} size={14} color={colors.secondaryForeground} />
          </Pressable>
        </View>
      ) : (
        <LinearGradient
          colors={wish.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.videoThumb}
        >
          <View style={[styles.videoPlayBtn, { opacity: 0.92 }]}>
            <Icon name="play-circle" size={52} color={colors.secondaryForeground} />
          </View>
          <View style={[styles.videoTag, { backgroundColor: colors.background + '59' }]}>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 11, color: colors.secondaryForeground, letterSpacing: 0.5 }}>
              {wish.tag}
            </Text>
          </View>
        </LinearGradient>
      )}

      <View style={styles.videoWishContent}>
        <Text style={{ fontFamily: 'PlayfairDisplay_700Bold', fontSize: 18, lineHeight: 26, color: colors.foreground, marginBottom: 8 }}>
          {wish.title}
        </Text>
        <Text style={[fontVariants.caption, { color: colors.mutedForeground, lineHeight: 20, marginBottom: 16 }]} numberOfLines={4}>
          {wish.desc}
        </Text>
        <Pressable onPress={() => router.push('/celebrities')}>
          <LinearGradient
            colors={['#FF6B33', '#B44CFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.wishBtn}
          >
            <Icon name="video" size={15} color={colors.secondaryForeground} />
            <Text style={{ color: colors.secondaryForeground, fontFamily: 'Inter_600SemiBold', fontSize: 14 }}>Create Your Wish</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

function HowItWorksStep({ num, icon, title, desc }: { num: number; icon: IconName; title: string; desc: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.howStep}>
      <LinearGradient colors={['#FF6B33', '#B44CFF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.howNum}>
        <Text style={{ color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 14 }}>{num}</Text>
      </LinearGradient>
      <Icon name={icon} size={28} color={colors.primary} style={{ marginBottom: 8 }} />
      <Text style={[fontVariants.bodySemibold, { color: colors.foreground, textAlign: 'center', marginBottom: 4 }]}>{title}</Text>
      <Text style={[fontVariants.caption, { color: colors.mutedForeground, textAlign: 'center' }]}>{desc}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const { colors, isDark, gradients } = useTheme();
  const { user } = useAuth();
  const { toggle } = useDrawer();
  const insets = useSafeAreaInsets();
  const [bannerIndex, setBannerIndex] = useState(0);
  const [visibleWishIds, setVisibleWishIds] = useState<Set<string>>(new Set(['1']));

  const wishViewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 });
  const onWishViewable = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    setVisibleWishIds(new Set(viewableItems.map(i => String(i.key))));
  }, []);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const heroBg = isDark ? gradients.heroDark : gradients.heroLight;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient colors={heroBg as any} style={[styles.header, { paddingTop: topPad + 16 }]}>
          <View style={styles.headerRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Pressable
                onPress={toggle}
                style={[styles.iconBtn, { backgroundColor: colors.card }]}
                hitSlop={8}
              >
                <Icon name="menu" size={20} color={colors.foreground} />
              </Pressable>
              <View>
                <Text style={[fontVariants.caption, { color: colors.mutedForeground }]}>
                  {user ? `Welcome back,` : 'Welcome to'}
                </Text>
                {user?.firstName ? (
                  <Text style={[fontVariants.h3, { color: colors.foreground }]}>
                    {`${user.firstName} 👋`}
                  </Text>
                ) : (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={[fontVariants.h3, { color: colors.foreground }]}>WishMe</Text>
                    <Image
                      source={require('@/assets/images/wishme-logo.png')}
                      style={{ width: 30, height: 30 }}
                      resizeMode="contain"
                    />
                  </View>
                )}
              </View>
            </View>
            <View style={styles.headerActions}>
              <Pressable
                onPress={() => router.push('/wallet')}
                style={[styles.walletPill, { backgroundColor: colors.primary + '20' }]}
              >
                <Text style={[fontVariants.captionMedium, { color: colors.primary }]}>
                  ₹{user?.walletBalance?.toLocaleString() ?? '0'}
                </Text>
              </Pressable>
              <Pressable onPress={() => router.push('/messages')} style={[styles.iconBtn, { backgroundColor: colors.card }]}>
                <Icon name="message-circle" size={20} color={colors.foreground} />
              </Pressable>
            </View>
          </View>

          {/* Search Bar */}
          <Pressable
            onPress={() => router.push('/celebrities')}
            style={[styles.searchBar, { backgroundColor: colors.card, ...shadows.sm }]}
          >
            <Icon name="search" size={18} color={colors.mutedForeground} />
            <Text style={[fontVariants.body, { color: colors.mutedForeground, flex: 1 }]}>
              Search celebrities…
            </Text>
            <Icon name="sliders" size={18} color={colors.mutedForeground} />
          </Pressable>
        </LinearGradient>

        {/* Banners */}
        <View style={{ marginTop: 20 }}>
          <FlatList
            data={BANNERS}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(b) => b.id}
            onMomentumScrollEnd={(e) =>
              setBannerIndex(Math.round(e.nativeEvent.contentOffset.x / (SCREEN_WIDTH - 48)))
            }
            contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
            renderItem={({ item }) => <BannerCard banner={item} />}
          />
          <View style={styles.dots}>
            {BANNERS.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, { backgroundColor: i === bannerIndex ? colors.primary : colors.border }]}
              />
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[fontVariants.h4, { color: colors.foreground, marginBottom: 16 }]}>What do you want to do?</Text>
          <View style={styles.quickActionsGrid}>
            {QUICK_ACTIONS.map((a) => (
              <QuickAction key={a.id} action={a} />
            ))}
          </View>
        </View>

        {/* Featured Celebrities */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[fontVariants.h4, { color: colors.foreground }]}>Featured Celebrities</Text>
            <Pressable onPress={() => router.push('/celebrities')}>
              <Text style={[fontVariants.captionMedium, { color: colors.primary }]}>See all</Text>
            </Pressable>
          </View>
          <FlatList
            data={CELEBRITIES}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(c) => c.id}
            contentContainerStyle={{ gap: 12 }}
            renderItem={({ item }) => <CelebCard celeb={item} />}
          />
        </View>

        {/* Personalized Video Wishes */}
        <View style={{ marginTop: 28 }}>
          <View style={{ paddingHorizontal: 20, marginBottom: 14 }}>
            <Text style={[fontVariants.h4, { color: colors.foreground, marginBottom: 6 }]}>
              Personalized Video Wishes
            </Text>
            <Text style={[fontVariants.caption, { color: colors.mutedForeground }]}>
              Create unforgettable moments with custom video messages for every special occasion
            </Text>
          </View>
          <FlatList
            data={VIDEO_WISHES}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(w) => w.id}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }}
            decelerationRate="fast"
            onViewableItemsChanged={onWishViewable}
            viewabilityConfig={wishViewConfig.current}
            renderItem={({ item }) => (
              <VideoWishCard wish={item} isVisible={visibleWishIds.has(item.id)} />
            )}
          />
        </View>

        {/* How It Works */}
        <View style={[styles.section, styles.howItWorks, { backgroundColor: colors.backgroundSecondary }]}>
          <Text style={[fontVariants.h3, { color: colors.foreground, textAlign: 'center', marginBottom: 4 }]}>
            How It Works
          </Text>
          <Text style={[fontVariants.caption, { color: colors.mutedForeground, textAlign: 'center', marginBottom: 24 }]}>
            Get a personal message in 3 easy steps
          </Text>
          <View style={styles.howSteps}>
            <HowItWorksStep num={1} icon="search" title="Find Your Star" desc="Browse 500+ celebrities across categories" />
            <HowItWorksStep num={2} icon="edit-2" title="Share Details" desc="Tell them what you need and who it's for" />
            <HowItWorksStep num={3} icon="video" title="Get Your Wish" desc="Receive a personalized video message" />
          </View>
        </View>

        {/* Referral Banner */}
        <View style={styles.section}>
          <LinearGradient
            colors={['#B44CFF', '#7B2FFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.referralBanner}
          >
            <View style={{ flex: 1 }}>
              <Text style={[fontVariants.h4, { color: '#fff', marginBottom: 4 }]}>Earn with WishMe</Text>
              <Text style={[fontVariants.caption, { color: 'rgba(255,255,255,0.8)' }]}>
                Refer friends & earn up to 10% commission
              </Text>
            </View>
            <Pressable
              onPress={() => router.push('/referrals')}
              style={styles.referralBtn}
            >
              <Text style={[fontVariants.captionMedium, { color: '#B44CFF' }]}>Refer Now</Text>
            </Pressable>
          </LinearGradient>
        </View>
      </ScrollView>

      {/* Floating AI Assistant */}
      <Pressable
        onPress={() => router.push('/messages')}
        style={[styles.fab, { backgroundColor: colors.primary, ...shadows.lg }]}
      >
        <Icon name="zap" size={22} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerActions: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  walletPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  iconBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  bannerCard: {
    width: SCREEN_WIDTH - 48,
    borderRadius: 20,
    padding: 24,
    justifyContent: 'flex-end',
    minHeight: 160,
  },
  bannerTitle: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 22, color: '#fff', lineHeight: 30, marginBottom: 6 },
  bannerSubtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: 'rgba(255,255,255,0.85)', marginBottom: 16 },
  bannerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  bannerButtonText: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#FF6B33' },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 12 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  section: { paddingHorizontal: 20, marginTop: 28 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  quickActionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  quickAction: {
    width: '31%',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
  },
  quickActionIcon: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  celebCard: { width: 130, borderRadius: 16, overflow: 'hidden' },
  celebImage: { width: 130, height: 120 },
  verifiedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  celebInfo: { padding: 10, gap: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  howItWorks: { borderRadius: 24, paddingVertical: 28, marginHorizontal: 20, paddingHorizontal: 24 },
  howSteps: { flexDirection: 'row', gap: 8 },
  howStep: { flex: 1, alignItems: 'center', paddingHorizontal: 4 },
  howNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  referralBanner: { borderRadius: 20, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 16 },
  referralBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 90,
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoWishCard: {
    width: SCREEN_WIDTH - 60,
    borderRadius: 20,
    overflow: 'hidden',
  },
  videoThumbContainer: {
    width: '100%',
    height: 188,
  },
  videoThumb: {
    width: '100%',
    height: 188,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoPlayBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoTag: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  videoPlayPauseBtn: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -26,
    marginLeft: -26,
  },
  videoMuteBtn: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoWishContent: {
    padding: 16,
  },
  wishBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 12,
  },
});
