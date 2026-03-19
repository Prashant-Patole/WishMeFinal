import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { fontVariants } from '@/constants/fonts';
import { useTheme } from '@/contexts/ThemeContext';

export default function FavoritesScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <Icon name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[fontVariants.h4, { color: colors.foreground }]}>Favorites</Text>
        <View style={{ width: 38 }} />
      </View>
      <View style={styles.center}>
        <Icon name="heart" size={56} color={colors.mutedForeground} />
        <Text style={[fontVariants.h4, { color: colors.foreground, marginTop: 20, marginBottom: 8 }]}>
          No Favorites Yet
        </Text>
        <Text style={[fontVariants.caption, { color: colors.mutedForeground, textAlign: 'center' }]}>
          Save your favourite celebrities here for quick access
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
});
