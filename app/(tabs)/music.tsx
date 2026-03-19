import { Icon, IconName } from '@/components/Icon';
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
import { useAuth } from '@/contexts/AuthContext';
import { fontVariants } from '@/constants/fonts';
import { radius, shadows } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TABS: { id: string; label: string; icon: IconName; cost: number }[] = [
  { id: 'tts', label: 'Text to Speech', icon: 'mic', cost: 50 },
  { id: 'music', label: 'AI Music', icon: 'music', cost: 200 },
  { id: 'sfx', label: 'Sound Effects', icon: 'zap', cost: 100 },
  { id: 'vocal', label: 'Voice Clone', icon: 'user', cost: 300 },
  { id: 'convert', label: 'Voice Convert', icon: 'refresh-cw', cost: 150 },
  { id: 'isolate', label: 'Audio Isolate', icon: 'scissors', cost: 150 },
];

const VOICES = ['Aria (Female, Hindi)', 'Dev (Male, Hindi)', 'Priya (Female, English)', 'Rohan (Male, English)', 'Kavya (Female, Soft)'];

const GENRES = ['Bollywood', 'Classical', 'Pop', 'Hip-Hop', 'Electronic', 'Folk', 'Jazz'];

const HISTORY: { id: string; type: string; title: string; duration: string; date: string; icon: IconName }[] = [
  { id: '1', type: 'AI Music', title: 'Birthday Song for Mom', duration: '2:34', date: '2 days ago', icon: 'music' },
  { id: '2', type: 'TTS', title: 'Wedding speech narration', duration: '1:12', date: '5 days ago', icon: 'mic' },
  { id: '3', type: 'Sound Effect', title: 'Thunderstorm ambience', duration: '0:45', date: '1 week ago', icon: 'zap' },
];

function TextToSpeechTab() {
  const { colors } = useTheme();
  const { user, updateWallet } = useAuth();
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState(VOICES[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    if (!text.trim()) return;
    if ((user?.walletBalance ?? 0) < 50) { alert('Insufficient wallet balance. Please add funds.'); return; }
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGenerated(true);
      updateWallet(-50);
    }, 2500);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingBottom: 40 }}>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[fontVariants.bodySemibold, { color: colors.foreground, marginBottom: 12 }]}>Enter Your Text</Text>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type or paste text to convert to speech…"
          placeholderTextColor={colors.mutedForeground}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          style={[
            styles.textArea,
            { backgroundColor: colors.input, color: colors.foreground, borderColor: colors.border },
          ]}
        />
        <Text style={[fontVariants.caption, { color: colors.mutedForeground, marginTop: 8, textAlign: 'right' }]}>
          {text.length} chars
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[fontVariants.bodySemibold, { color: colors.foreground, marginBottom: 12 }]}>Choose Voice</Text>
        <View style={{ gap: 8 }}>
          {VOICES.slice(0, 4).map((v) => (
            <Pressable
              key={v}
              onPress={() => setSelectedVoice(v)}
              style={[
                styles.voiceOption,
                {
                  backgroundColor: selectedVoice === v ? colors.primary + '15' : colors.input,
                  borderColor: selectedVoice === v ? colors.primary : colors.border,
                },
              ]}
            >
              <Icon name="mic" size={16} color={selectedVoice === v ? colors.primary : colors.mutedForeground} />
              <Text style={[fontVariants.captionMedium, { color: selectedVoice === v ? colors.primary : colors.foreground, flex: 1 }]}>
                {v}
              </Text>
              {selectedVoice === v && <Icon name="check" size={16} color={colors.primary} />}
            </Pressable>
          ))}
        </View>
      </View>

      {generated && (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.playerRow}>
            <LinearGradient colors={['#FF6B33', '#B44CFF']} style={styles.playerIcon}>
              <Icon name="volume-2" size={20} color="#fff" />
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={[fontVariants.bodySemibold, { color: colors.foreground }]}>Generated Audio</Text>
              <Text style={[fontVariants.caption, { color: colors.mutedForeground }]}>Ready to play & download</Text>
            </View>
            <Pressable style={[styles.playBtn, { backgroundColor: colors.primary }]}>
              <Icon name="play" size={18} color="#fff" />
            </Pressable>
            <Pressable style={[styles.playBtn, { backgroundColor: colors.muted }]}>
              <Icon name="download" size={18} color={colors.foreground} />
            </Pressable>
          </View>
        </View>
      )}

      <Pressable onPress={handleGenerate} disabled={isGenerating || !text.trim()}>
        <LinearGradient
          colors={['#FF6B33', '#B44CFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.genBtn, { opacity: !text.trim() ? 0.5 : 1 }]}
        >
          {isGenerating ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Icon name="zap" size={18} color="#fff" />
              <Text style={{ color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 16 }}>Generate · ₹50</Text>
            </>
          )}
        </LinearGradient>
      </Pressable>
    </ScrollView>
  );
}

function AIMusicTab() {
  const { colors } = useTheme();
  const { user, updateWallet } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Bollywood');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGenerated(true);
      updateWallet(-200);
    }, 3500);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingBottom: 40 }}>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[fontVariants.bodySemibold, { color: colors.foreground, marginBottom: 12 }]}>Describe Your Song</Text>
        <TextInput
          value={prompt}
          onChangeText={setPrompt}
          placeholder="A happy birthday song for my mom with classical Indian instruments…"
          placeholderTextColor={colors.mutedForeground}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          style={[styles.textArea, { backgroundColor: colors.input, color: colors.foreground, borderColor: colors.border }]}
        />
      </View>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[fontVariants.bodySemibold, { color: colors.foreground, marginBottom: 12 }]}>Genre</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {GENRES.map((g) => (
              <Pressable
                key={g}
                onPress={() => setSelectedGenre(g)}
                style={[
                  styles.chip,
                  { backgroundColor: selectedGenre === g ? colors.primary : colors.input, borderColor: selectedGenre === g ? colors.primary : colors.border },
                ]}
              >
                <Text style={[fontVariants.captionMedium, { color: selectedGenre === g ? '#fff' : colors.mutedForeground }]}>{g}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>

      {generated && (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.playerRow}>
            <LinearGradient colors={['#B44CFF', '#7B2FFF']} style={styles.playerIcon}>
              <Icon name="music" size={20} color="#fff" />
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={[fontVariants.bodySemibold, { color: colors.foreground }]}>Your AI Song</Text>
              <Text style={[fontVariants.caption, { color: colors.mutedForeground }]}>3:24 · {selectedGenre}</Text>
            </View>
            <Pressable style={[styles.playBtn, { backgroundColor: colors.primary }]}>
              <Icon name="play" size={18} color="#fff" />
            </Pressable>
            <Pressable style={[styles.playBtn, { backgroundColor: colors.muted }]}>
              <Icon name="download" size={18} color={colors.foreground} />
            </Pressable>
          </View>
        </View>
      )}

      <Pressable onPress={handleGenerate} disabled={isGenerating || !prompt.trim()}>
        <LinearGradient
          colors={['#B44CFF', '#FF6B33']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.genBtn, { opacity: !prompt.trim() ? 0.5 : 1 }]}
        >
          {isGenerating ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Icon name="music" size={18} color="#fff" />
              <Text style={{ color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 16 }}>Generate · ₹200</Text>
            </>
          )}
        </LinearGradient>
      </Pressable>
    </ScrollView>
  );
}

export default function MusicStudioScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('tts');
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const currentTab = TABS.find((t) => t.id === activeTab)!;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <LinearGradient
        colors={isDark ? ['#1F1530', '#1A2035'] : ['#F8F0FF', '#FFF5F0']}
        style={[styles.header, { paddingTop: topPad + 16 }]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <LinearGradient colors={['#B44CFF', '#FF6B33']} style={styles.studioIcon}>
            <Icon name="music" size={20} color="#fff" />
          </LinearGradient>
          <View>
            <Text style={[fontVariants.h3, { color: colors.foreground }]}>AI Music Studio</Text>
            <Text style={[fontVariants.caption, { color: colors.mutedForeground }]}>
              Powered by ElevenLabs & Suno
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Tab Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ borderBottomWidth: 1, borderBottomColor: colors.border, maxHeight: 56 }}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 4, alignItems: 'center', paddingVertical: 8 }}
      >
        {TABS.map((tab) => (
          <Pressable
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            style={[
              styles.tabChip,
              {
                backgroundColor: activeTab === tab.id ? colors.primary : colors.backgroundSecondary,
              },
            ]}
          >
            <Icon name={tab.icon} size={13} color={activeTab === tab.id ? '#fff' : colors.mutedForeground} />
            <Text style={[fontVariants.captionMedium, { color: activeTab === tab.id ? '#fff' : colors.mutedForeground }]}>
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Content */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ padding: 20 }}>
          {/* Cost pill */}
          <View style={[styles.costPill, { backgroundColor: colors.backgroundSecondary }]}>
            <Icon name="credit-card" size={13} color={colors.primary} />
            <Text style={[fontVariants.captionMedium, { color: colors.foreground }]}>
              Cost: <Text style={{ color: colors.primary }}>₹{currentTab.cost}</Text> per generation
            </Text>
          </View>

          <View style={{ marginTop: 16 }}>
            {activeTab === 'tts' && <TextToSpeechTab />}
            {activeTab === 'music' && <AIMusicTab />}
            {(activeTab === 'sfx' || activeTab === 'vocal' || activeTab === 'convert' || activeTab === 'isolate') && (
              <View style={[styles.card, { backgroundColor: colors.card, alignItems: 'center', paddingVertical: 40 }]}>
                <LinearGradient colors={['#B44CFF', '#FF6B33']} style={{ width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Icon name={currentTab.icon} size={28} color="#fff" />
                </LinearGradient>
                <Text style={[fontVariants.h4, { color: colors.foreground, marginBottom: 8 }]}>{currentTab.label}</Text>
                <Text style={[fontVariants.body, { color: colors.mutedForeground, textAlign: 'center' }]}>
                  Upload your audio file to get started
                </Text>
                <Pressable style={[styles.uploadBtn, { borderColor: colors.primary, marginTop: 24 }]}>
                  <Icon name="upload" size={18} color={colors.primary} />
                  <Text style={[fontVariants.bodySemibold, { color: colors.primary }]}>Upload Audio</Text>
                </Pressable>
              </View>
            )}
          </View>

          {/* History */}
          <Text style={[fontVariants.h4, { color: colors.foreground, marginTop: 28, marginBottom: 16 }]}>
            Recent Generations
          </Text>
          <View style={{ gap: 10 }}>
            {HISTORY.map((h) => (
              <View key={h.id} style={[styles.historyItem, { backgroundColor: colors.card, ...shadows.sm }]}>
                <View style={[styles.historyIcon, { backgroundColor: colors.primary + '20' }]}>
                  <Icon name={h.icon} size={16} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[fontVariants.captionMedium, { color: colors.foreground }]} numberOfLines={1}>{h.title}</Text>
                  <Text style={[fontVariants.caption, { color: colors.mutedForeground }]}>{h.type} · {h.date}</Text>
                </View>
                <Text style={[fontVariants.caption, { color: colors.mutedForeground }]}>{h.duration}</Text>
                <Pressable>
                  <Icon name="play-circle" size={26} color={colors.primary} />
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  studioIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  tabChip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  card: { borderRadius: 16, padding: 16 },
  costPill: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, alignSelf: 'flex-start' },
  textArea: { borderRadius: 12, padding: 14, fontSize: 14, fontFamily: 'Inter_400Regular', minHeight: 120, borderWidth: 1 },
  voiceOption: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 10, borderWidth: 1 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, borderWidth: 1 },
  genBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 18, borderRadius: 16 },
  playerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  playerIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  playBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  historyItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 12 },
  historyIcon: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  uploadBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12, borderWidth: 1.5 },
});
