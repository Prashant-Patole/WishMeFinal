import { Icon } from '@/components/Icon';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { fontVariants } from '@/constants/fonts';

const CONVO_DATA: Record<string, { name: string; image: string; category: string; messages: any[] }> = {
  '1': {
    name: 'Ranveer Singh',
    image: 'https://picsum.photos/seed/ranveer/100/100',
    category: 'Actor',
    messages: [
      { id: '1', from: 'celeb', text: 'Hey! I received your booking request. Excited to create a special video for you! 🎬', time: '10:15 AM' },
      { id: '2', from: 'user', text: 'OMG! This is unreal. The wish is for my sister\'s birthday on Friday.', time: '10:18 AM' },
      { id: '3', from: 'celeb', text: 'That\'s so sweet! I\'ll make it extra special for her. Any specific message you want me to include?', time: '10:20 AM' },
      { id: '4', from: 'user', text: 'Please mention how proud we are of her passing her exams!', time: '10:22 AM' },
      { id: '5', from: 'celeb', text: 'Perfect! Give me a couple of hours. Will deliver the video by tonight 💪🔥', time: '10:25 AM' },
    ],
  },
  default: {
    name: 'WishMe Support',
    image: 'https://picsum.photos/seed/support/100/100',
    category: 'Support',
    messages: [
      { id: '1', from: 'celeb', text: 'Hi! Welcome to WishMe support. How can I help you today?', time: '9:00 AM' },
    ],
  },
};

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const botPad = Platform.OS === 'web' ? 34 : 0;

  const convo = CONVO_DATA[id ?? ''] ?? CONVO_DATA.default;
  const [messages, setMessages] = useState(convo.messages);
  const [input, setInput] = useState('');
  const listRef = useRef<FlatList>(null);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now().toString(), from: 'user', text: input.trim(), time: 'Just now' }]);
    setInput('');
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()}>
          <Icon name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <Image source={{ uri: convo.image }} style={styles.headerAvatar} />
        <View style={{ flex: 1 }}>
          <Text style={[fontVariants.bodySemibold, { color: colors.foreground }]}>{convo.name}</Text>
          <Text style={[fontVariants.caption, { color: '#22C55E' }]}>Online</Text>
        </View>
        <Pressable>
          <Icon name="more-vertical" size={22} color={colors.foreground} />
        </Pressable>
      </View>

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isUser = item.from === 'user';
          return (
            <View style={[styles.msgRow, isUser ? styles.msgRowUser : styles.msgRowCeleb]}>
              {!isUser && <Image source={{ uri: convo.image }} style={styles.msgAvatar} />}
              <View style={{ maxWidth: '75%' }}>
                <View style={[
                  styles.bubble,
                  isUser
                    ? { backgroundColor: colors.primary }
                    : { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
                ]}>
                  <Text style={[fontVariants.body, { color: isUser ? '#fff' : colors.foreground }]}>{item.text}</Text>
                </View>
                <Text style={[fontVariants.caption, { color: colors.mutedForeground, marginTop: 4, textAlign: isUser ? 'right' : 'left' }]}>{item.time}</Text>
              </View>
              {isUser && (
                <View style={[styles.msgAvatar, { backgroundColor: colors.primary + '30', alignItems: 'center', justifyContent: 'center' }]}>
                  <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 12, color: colors.primary }}>
                    {user?.firstName?.charAt(0) ?? 'U'}
                  </Text>
                </View>
              )}
            </View>
          );
        }}
      />

      {/* Input */}
      <View style={[styles.inputRow, { paddingBottom: botPad + 12, backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <Pressable style={[styles.attachBtn, { backgroundColor: colors.backgroundSecondary }]}>
          <Icon name="paperclip" size={18} color={colors.mutedForeground} />
        </Pressable>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type a message…"
          placeholderTextColor={colors.mutedForeground}
          style={[styles.inputField, { backgroundColor: colors.input, borderColor: colors.border, color: colors.foreground, fontFamily: 'Inter_400Regular' }]}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
        />
        <Pressable onPress={sendMessage} style={{ opacity: input.trim() ? 1 : 0.5 }}>
          <LinearGradient colors={['#FF6B33', '#B44CFF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.sendBtn}>
            <Icon name="send" size={18} color="#fff" />
          </LinearGradient>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12, gap: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  headerAvatar: { width: 40, height: 40, borderRadius: 20 },
  msgRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  msgRowUser: { justifyContent: 'flex-end' },
  msgRowCeleb: { justifyContent: 'flex-start' },
  msgAvatar: { width: 32, height: 32, borderRadius: 16 },
  bubble: { borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10 },
  inputRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12, gap: 10, borderTopWidth: StyleSheet.hairlineWidth },
  attachBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  inputField: { flex: 1, borderRadius: 24, paddingHorizontal: 16, paddingVertical: 10, borderWidth: 1, fontSize: 15 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
