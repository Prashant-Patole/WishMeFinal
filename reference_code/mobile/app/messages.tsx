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

const CONVERSATIONS = [
  { id: '1', name: 'Ranveer Singh', image: 'https://picsum.photos/seed/ranveer/100/100', lastMessage: 'Thanks for booking! I\'ll have your video ready soon 🎬', time: '2m', unread: 2, category: 'Actor' },
  { id: '2', name: 'WishMe Support', image: 'https://picsum.photos/seed/support/100/100', lastMessage: 'How can I help you today?', time: '1h', unread: 0, category: 'Support' },
  { id: '3', name: 'Shreya Ghoshal', image: 'https://picsum.photos/seed/shreya/100/100', lastMessage: 'Your personalized song has been delivered! ✨', time: '3h', unread: 1, category: 'Singer' },
  { id: '4', name: 'Bhuvan Bam', image: 'https://picsum.photos/seed/bhuvan/100/100', lastMessage: 'LOL that was fun to record!', time: '1d', unread: 0, category: 'YouTuber' },
  { id: '5', name: 'AI Assistant', image: 'https://picsum.photos/seed/ai/100/100', lastMessage: 'I can help you find the perfect celebrity!', time: '2d', unread: 0, category: 'AI' },
];

function ConversationItem({ conv }: { conv: typeof CONVERSATIONS[0] }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={() => router.push(`/chat/${conv.id}`)}
      style={[styles.convItem, { backgroundColor: colors.card }]}
    >
      <View style={{ position: 'relative' }}>
        <Image source={{ uri: conv.image }} style={styles.avatar} />
        <View style={[styles.onlineDot, { backgroundColor: '#22C55E', borderColor: colors.card }]} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
          <Text style={[fontVariants.bodySemibold, { color: colors.foreground }]}>{conv.name}</Text>
          <Text style={[fontVariants.caption, { color: colors.mutedForeground }]}>{conv.time}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={[fontVariants.caption, { color: colors.mutedForeground, flex: 1 }]} numberOfLines={1}>
            {conv.lastMessage}
          </Text>
          {conv.unread > 0 && (
            <View style={[styles.badge, { backgroundColor: colors.primary }]}>
              <Text style={{ color: '#fff', fontSize: 10, fontFamily: 'Inter_700Bold' }}>{conv.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

export default function MessagesScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const [search, setSearch] = useState('');

  const filtered = CONVERSATIONS.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()}>
          <Icon name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[fontVariants.h4, { color: colors.foreground, flex: 1, marginLeft: 12 }]}>Messages</Text>
        <Pressable style={[styles.iconBtn, { backgroundColor: colors.backgroundSecondary }]}>
          <Icon name="edit" size={18} color={colors.foreground} />
        </Pressable>
      </View>

      <View style={{ padding: 16 }}>
        <View style={[styles.searchBar, { backgroundColor: colors.input, borderColor: colors.border }]}>
          <Icon name="search" size={16} color={colors.mutedForeground} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search messages…"
            placeholderTextColor={colors.mutedForeground}
            style={[fontVariants.body, { color: colors.foreground, flex: 1 }]}
          />
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(c) => c.id}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 2, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <ConversationItem conv={item} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Icon name="message-circle" size={48} color={colors.mutedForeground} />
            <Text style={[fontVariants.h4, { color: colors.foreground, marginTop: 16 }]}>No messages yet</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  iconBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12, borderWidth: 1 },
  convItem: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, borderRadius: 14, marginBottom: 2 },
  avatar: { width: 52, height: 52, borderRadius: 26 },
  onlineDot: { position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, borderRadius: 6, borderWidth: 2 },
  badge: { width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  empty: { alignItems: 'center', paddingTop: 80 },
});
