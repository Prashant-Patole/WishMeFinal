import React from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Href, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, IconName } from '@/components/Icon';
import { fontVariants } from '@/constants/fonts';
import { radius } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useDrawer } from '@/contexts/DrawerContext';
import { useTheme } from '@/contexts/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = Math.round(SCREEN_WIDTH * 0.78);

interface NavItem {
  label: string;
  icon: IconName;
  route: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: 'home', route: '/(tabs)' },
  { label: 'Celebrity Call', icon: 'phone', route: '/(tabs)/voice-call' },
  { label: 'Wallet', icon: 'credit-card', route: '/wallet' },
  { label: 'Bookings', icon: 'calendar', route: '/bookings' },
  { label: 'Favorites', icon: 'heart', route: '/favorites' },
  { label: 'Wish Orders', icon: 'shopping-bag', route: '/wish-orders' },
  { label: 'Messages', icon: 'message-circle', route: '/messages' },
  { label: 'Loved Ones', icon: 'users', route: '/loved-ones' },
  { label: 'AI Music', icon: 'music-2', route: '/(tabs)/music' },
  { label: 'Photo Wish', icon: 'image', route: '/photo-wish' },
  { label: 'Wish a Celebrity', icon: 'star', route: '/wish-celebrity' },
  { label: 'Wish a Friend', icon: 'video', route: '/(tabs)/celebrities' },
  { label: 'For Business', icon: 'briefcase', route: '/for-business' },
  { label: 'Greeting Cards', icon: 'mail', route: '/greeting-cards' },
  { label: 'Image Promotions', icon: 'zap', route: '/image-promotions' },
  { label: 'Browse Celebrities', icon: 'search', route: '/(tabs)/celebrities' },
  { label: 'Referrals', icon: 'share-2', route: '/referrals' },
  { label: 'Commission', icon: 'trending-up', route: '/commission' },
  { label: 'Occasions', icon: 'gift', route: '/occasions' },
  { label: 'Occasion Alerts', icon: 'bell', route: '/occasion-alerts' },
];

const CELEBRITY_ITEM: NavItem = {
  label: 'Celebrity Dashboard',
  icon: 'sparkles',
  route: '/celebrity-dashboard',
};

function DrawerNavItem({
  item,
  onPress,
  highlight,
}: {
  item: NavItem;
  onPress: () => void;
  highlight?: boolean;
}) {
  const { colors } = useTheme();
  const iconColor = highlight ? colors.sidebarPrimary : colors.sidebarForeground;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.navItem, { opacity: pressed ? 0.65 : 1 }]}
    >
      <View
        style={[
          styles.navIconWrap,
          { backgroundColor: highlight ? colors.sidebarPrimary + '22' : colors.sidebarAccent },
        ]}
      >
        <Icon name={item.icon} size={18} color={iconColor} />
      </View>
      <Text
        style={[
          fontVariants.bodyMedium,
          { color: highlight ? colors.sidebarPrimary : colors.sidebarForeground },
        ]}
      >
        {item.label}
      </Text>
    </Pressable>
  );
}

function DrawerPanelContent() {
  const { colors } = useTheme();
  const { user, logout } = useAuth();
  const { close } = useDrawer();
  const insets = useSafeAreaInsets();

  const isCelebrity = user?.role === 'celebrity';
  const displayName = user?.firstName
    ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`
    : 'Guest';

  const topPad = Platform.OS === 'web' ? 24 : insets.top + 8;

  const handleNav = (route: string) => {
    close();
    setTimeout(() => router.push(route as Href), 50);
  };

  return (
    <View style={[styles.panelInner, { backgroundColor: colors.sidebarBackground, paddingTop: topPad }]}>
      <View style={[styles.drawerHeader, { borderBottomColor: colors.sidebarBorder }]}>
        <View style={[styles.avatarCircle, { backgroundColor: colors.primary }]}>
          <Text style={[fontVariants.h4, { color: colors.primaryForeground }]}>
            {displayName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={[fontVariants.bodySemibold, { color: colors.sidebarForeground }]}
            numberOfLines={1}
          >
            {displayName}
          </Text>
          {user?.email ? (
            <Text
              style={[fontVariants.caption, { color: colors.mutedForeground }]}
              numberOfLines={1}
            >
              {user.email}
            </Text>
          ) : null}
        </View>
        <Pressable
          onPress={close}
          hitSlop={8}
          style={({ pressed }) => [
            styles.closeBtn,
            { backgroundColor: colors.sidebarAccent, opacity: pressed ? 0.65 : 1 },
          ]}
        >
          <Icon name="x" size={16} color={colors.sidebarForeground} />
        </Pressable>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        {NAV_ITEMS.map((item) => (
          <DrawerNavItem
            key={item.label}
            item={item}
            onPress={() => handleNav(item.route)}
          />
        ))}
        {isCelebrity && (
          <DrawerNavItem
            item={CELEBRITY_ITEM}
            onPress={() => handleNav(CELEBRITY_ITEM.route)}
            highlight
          />
        )}
      </ScrollView>

      <View
        style={[
          styles.drawerFooter,
          {
            borderTopColor: colors.sidebarBorder,
            paddingBottom: insets.bottom + 16,
          },
        ]}
      >
        <DrawerNavItem
          item={{ label: 'Settings', icon: 'settings', route: '/settings' }}
          onPress={() => handleNav('/settings')}
        />
        <Pressable
          onPress={() => {
            close();
            logout().then(() => router.replace('/(auth)'));
          }}
          style={({ pressed }) => [styles.navItem, { opacity: pressed ? 0.65 : 1 }]}
        >
          <View style={[styles.navIconWrap, { backgroundColor: colors.destructive + '22' }]}>
            <Icon name="log-out" size={18} color={colors.destructive} />
          </View>
          <Text style={[fontVariants.bodyMedium, { color: colors.destructive }]}>Logout</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function DrawerMenu({ children }: { children: React.ReactNode }) {
  const { animValue, isOpen, close } = useDrawer();
  const { colors } = useTheme();

  const drawerTranslateX = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-DRAWER_WIDTH, 0],
  });

  const contentTranslateX = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, DRAWER_WIDTH * 0.8],
  });

  const contentScale = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.88],
  });

  const contentBorderRadius = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  });

  return (
    <View style={[styles.root, { backgroundColor: colors.primary }]}>
      <Animated.View
        style={[
          styles.drawerSlot,
          { width: DRAWER_WIDTH, transform: [{ translateX: drawerTranslateX }] },
        ]}
      >
        <DrawerPanelContent />
      </Animated.View>

      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [{ translateX: contentTranslateX }, { scale: contentScale }],
            borderRadius: contentBorderRadius,
            overflow: 'hidden',
          },
        ]}
      >
        {children}
        {isOpen && (
          <Pressable style={StyleSheet.absoluteFill} onPress={close} />
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  drawerSlot: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
  },
  panelInner: {
    flex: 1,
    flexDirection: 'column',
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
    marginBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  navIconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerFooter: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 8,
  },
});
