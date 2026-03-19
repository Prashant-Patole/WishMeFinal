import { Icon } from '@/components/Icon';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
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
import { fontVariants } from '@/constants/fonts';
import { shadows } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CARD_STYLES = [
  { id: '1', name: 'Classic', gradients: ['#FF6B33', '#E8527A'] as const, emoji: '🎂' },
  { id: '2', name: 'Royal', gradients: ['#B44CFF', '#7B2FFF'] as const, emoji: '👑' },
  { id: '3', name: 'Golden', gradients: ['#F59E0B', '#FBBF24'] as const, emoji: '✨' },
  { id: '4', name: 'Nature', gradients: ['#22C55E', '#15803D'] as const, emoji: '🌸' },
  { id: '5', name: 'Ocean', gradients: ['#3B82F6', '#1D4ED8'] as const, emoji: '🌊' },
  { id: '6', name: 'Romantic', gradients: ['#EC4899', '#BE185D'] as const, emoji: '💕' },
];

const OCCASIONS = ['Birthday', 'Anniversary', 'Wedding', 'Get Well Soon', 'Congratulations', 'Thank You', 'Farewell', 'Festive'];

export default function GreetingCardsScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const [selectedStyle, setSelectedStyle] = useState('1');
  const [occasion, setOccasion] = useState('Birthday');
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const currentStyle = CARD_STYLES.find((s) => s.id === selectedStyle)!;

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGenerated(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 2000);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()}>
          <Icon name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[fontVariants.h4, { color: colors.foreground, flex: 1, marginLeft: 12 }]}>Greeting Cards</Text>
        <LinearGradient colors={['#FF6B33', '#B44CFF']} style={styles.costBadge}>
          <Text style={{ color: '#fff', fontSize: 11, fontFamily: 'Inter_600SemiBold' }}>Free</Text>
        </LinearGradient>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Card Style */}
        <View>
          <Text style={[fontVariants.h4, { color: colors.foreground, marginBottom: 14 }]}>Card Style</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {CARD_STYLES.map((s) => (
                <Pressable
                  key={s.id}
                  onPress={() => setSelectedStyle(s.id)}
                  style={[styles.styleCard, { borderColor: selectedStyle === s.id ? s.gradients[0] : 'transparent', borderWidth: 2 }]}
                >
                  <LinearGradient colors={s.gradients} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.styleGradient}>
                    <Text style={{ fontSize: 24 }}>{s.emoji}</Text>
                    <Text style={{ fontFamily: 'DancingScript_600SemiBold', fontSize: 14, color: '#fff', marginTop: 6 }}>{s.name}</Text>
                  </LinearGradient>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Occasion */}
        <View>
          <Text style={[fontVariants.captionMedium, { color: colors.foreground, marginBottom: 10 }]}>Occasion</Text>
          <View style={styles.occasions}>
            {OCCASIONS.map((o) => (
              <Pressable key={o} onPress={() => setOccasion(o)} style={[styles.chip, { backgroundColor: occasion === o ? colors.primary : colors.backgroundSecondary, borderColor: occasion === o ? colors.primary : colors.border }]}>
                <Text style={[fontVariants.captionMedium, { color: occasion === o ? '#fff' : colors.mutedForeground }]}>{o}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Recipient */}
        <View style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border }]}>
          <Icon name="user" size={18} color={colors.mutedForeground} />
          <TextInput value={recipientName} onChangeText={setRecipientName} placeholder="Recipient's name" placeholderTextColor={colors.mutedForeground} style={[fontVariants.body, { color: colors.foreground, flex: 1 }]} />
        </View>

        {/* Message */}
        <TextInput value={message} onChangeText={setMessage} placeholder="Write your greeting message…" placeholderTextColor={colors.mutedForeground} multiline numberOfLines={4} textAlignVertical="top" style={[styles.textarea, { backgroundColor: colors.input, borderColor: colors.border, color: colors.foreground }]} />

        {/* Preview */}
        {generated && (
          <View style={{ ...shadows.lg }}>
            <LinearGradient colors={currentStyle.gradients} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.previewCard}>
              <Text style={{ fontSize: 48, marginBottom: 16 }}>{currentStyle.emoji}</Text>
              <Text style={{ fontFamily: 'DancingScript_700Bold', fontSize: 28, color: '#fff', textAlign: 'center' }}>
                Happy {occasion}!
              </Text>
              {recipientName && (
                <Text style={{ fontFamily: 'PlayfairDisplay_700Bold', fontSize: 22, color: '#fff', textAlign: 'center', marginTop: 8 }}>
                  Dear {recipientName},
                </Text>
              )}
              {message ? (
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 15, color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginTop: 12, paddingHorizontal: 16, lineHeight: 24 }}>
                  {message}
                </Text>
              ) : (
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 15, color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginTop: 12, lineHeight: 24 }}>
                  Wishing you all the joy and happiness on your special day!
                </Text>
              )}
              <Text style={{ fontFamily: 'DancingScript_400Regular', fontSize: 18, color: 'rgba(255,255,255,0.8)', marginTop: 20 }}>
                — WishMe ✨
              </Text>
            </LinearGradient>
          </View>
        )}

        <Pressable onPress={handleGenerate} disabled={isGenerating}>
          <LinearGradient colors={['#FF6B33', '#B44CFF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.genBtn}>
            {isGenerating ? <ActivityIndicator color="#fff" /> : (
              <>
                <Icon name="mail" size={18} color="#fff" />
                <Text style={{ color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 16 }}>
                  {generated ? 'Regenerate Card' : 'Create Card'}
                </Text>
              </>
            )}
          </LinearGradient>
        </Pressable>

        {generated && (
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Pressable style={[styles.actionBtn, { backgroundColor: colors.card, borderColor: colors.border, flex: 1 }]}>
              <Icon name="download" size={18} color={colors.foreground} />
              <Text style={[fontVariants.captionMedium, { color: colors.foreground }]}>Download</Text>
            </Pressable>
            <Pressable style={[styles.actionBtn, { backgroundColor: colors.card, borderColor: colors.border, flex: 1 }]}>
              <Icon name="share-2" size={18} color={colors.foreground} />
              <Text style={[fontVariants.captionMedium, { color: colors.foreground }]}>Share</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  costBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999 },
  styleCard: { width: 100, height: 90, borderRadius: 14, overflow: 'hidden' },
  styleGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  occasions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, borderWidth: 1 },
  input: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12, borderWidth: 1 },
  textarea: { borderRadius: 12, padding: 14, fontSize: 14, fontFamily: 'Inter_400Regular', minHeight: 100, borderWidth: 1 },
  previewCard: { borderRadius: 24, padding: 40, alignItems: 'center' },
  genBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 18, borderRadius: 16 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 14, borderRadius: 14, borderWidth: 1 },
});
