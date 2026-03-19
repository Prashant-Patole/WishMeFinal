import { Icon } from '@/components/Icon';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/contexts/ThemeContext';
import { fontVariants } from '@/constants/fonts';
import { shadows } from '@/constants/theme';

const CELEBRITIES = [
  { id: '1', name: 'Ranveer Singh', category: 'Actor', birthday: 'July 6', image: 'https://picsum.photos/seed/ranveer/200/200', hasBirthday: true },
  { id: '2', name: 'Shreya Ghoshal', category: 'Singer', birthday: 'March 12', image: 'https://picsum.photos/seed/shreya/200/200', hasBirthday: false },
  { id: '3', name: 'Virat Kohli', category: 'Cricketer', birthday: 'November 5', image: 'https://picsum.photos/seed/virat/200/200', hasBirthday: false },
  { id: '4', name: 'Alia Bhatt', category: 'Actor', birthday: 'March 15', image: 'https://picsum.photos/seed/alia/200/200', hasBirthday: true },
];

export default function WishCelebrityScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = CELEBRITIES.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()}>
          <Icon name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[fontVariants.h4, { color: colors.foreground, flex: 1, marginLeft: 12 }]}>Wish a Celebrity</Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(c) => c.id}
        contentContainerStyle={{ padding: 20, gap: 14, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <Text style={[fontVariants.body, { color: colors.mutedForeground, marginBottom: 16 }]}>
              Show your favourite celebrities some love with a public wish!
            </Text>
            <View style={[styles.searchBar, { backgroundColor: colors.input, borderColor: colors.border }]}>
              <Icon name="search" size={16} color={colors.mutedForeground} />
              <TextInput value={search} onChangeText={setSearch} placeholder="Search celebrities…" placeholderTextColor={colors.mutedForeground} style={[fontVariants.body, { color: colors.foreground, flex: 1 }]} />
            </View>
            {selected && (
              <View style={[styles.messageBox, { backgroundColor: colors.card, ...shadows.sm }]}>
                <Text style={[fontVariants.captionMedium, { color: colors.foreground, marginBottom: 8 }]}>Your wish message</Text>
                <TextInput value={message} onChangeText={setMessage} placeholder="Write a heartfelt public wish…" placeholderTextColor={colors.mutedForeground} multiline numberOfLines={3} textAlignVertical="top" style={[styles.textarea, { backgroundColor: colors.input, borderColor: colors.border, color: colors.foreground }]} />
                <Pressable disabled={!message.trim()}>
                  <LinearGradient colors={['#FF6B33', '#B44CFF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.sendBtn, { opacity: message.trim() ? 1 : 0.5 }]}>
                    <Icon name="send" size={16} color="#fff" />
                    <Text style={{ color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 14 }}>Send Wish (Free)</Text>
                  </LinearGradient>
                </Pressable>
              </View>
            )}
          </>
        }
        renderItem={({ item }) => (
          <Pressable onPress={() => setSelected(selected === item.id ? null : item.id)} style={[styles.celebCard, { backgroundColor: colors.card, borderColor: selected === item.id ? colors.primary : colors.border, borderWidth: selected === item.id ? 2 : 1, ...shadows.sm }]}>
            <Image source={{ uri: item.image }} style={styles.celebImage} />
            <View style={{ flex: 1 }}>
              <Text style={[fontVariants.bodySemibold, { color: colors.foreground }]}>{item.name}</Text>
              <Text style={[fontVariants.caption, { color: colors.mutedForeground }]}>{item.category}</Text>
              {item.hasBirthday && (
                <View style={[styles.bdayBadge, { backgroundColor: colors.primary + '20' }]}>
                  <Icon name="gift" size={11} color={colors.primary} />
                  <Text style={[fontVariants.caption, { color: colors.primary, fontSize: 11 }]}>Birthday Soon!</Text>
                </View>
              )}
            </View>
            {selected === item.id && <Icon name="check-circle" size={22} color={colors.primary} />}
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  celebCard: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 16, padding: 14 },
  celebImage: { width: 56, height: 56, borderRadius: 28 },
  bdayBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, marginTop: 4, alignSelf: 'flex-start' },
  messageBox: { borderRadius: 16, padding: 16, marginBottom: 16, gap: 12 },
  textarea: { borderRadius: 10, padding: 12, borderWidth: 1, fontSize: 14, fontFamily: 'Inter_400Regular', minHeight: 80 },
  sendBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderRadius: 12 },
});
