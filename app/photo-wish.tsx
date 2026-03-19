import { Icon } from '@/components/Icon';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
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
import { fontVariants } from '@/constants/fonts';
import { shadows } from '@/constants/theme';

const TEMPLATES = [
  { id: '1', label: 'Birthday', gradient: ['#FF6B33', '#E8527A'] as const },
  { id: '2', label: 'Wedding', gradient: ['#B44CFF', '#7B2FFF'] as const },
  { id: '3', label: 'Anniversary', gradient: ['#F59E0B', '#FBBF24'] as const },
  { id: '4', label: 'Baby Shower', gradient: ['#EC4899', '#BE185D'] as const },
  { id: '5', label: 'Graduation', gradient: ['#3B82F6', '#1D4ED8'] as const },
  { id: '6', label: 'Farewell', gradient: ['#22C55E', '#15803D'] as const },
];

export default function PhotoWishScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const [image, setImage] = useState<string | null>(null);
  const [template, setTemplate] = useState('1');
  const [message, setMessage] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGenerated(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 2500);
  };

  const selectedTemplate = TEMPLATES.find((t) => t.id === template)!;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()}>
          <Icon name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[fontVariants.h4, { color: colors.foreground, flex: 1, marginLeft: 12 }]}>Photo Wish</Text>
        <LinearGradient colors={['#FF6B33', '#B44CFF']} style={styles.costBadge}>
          <Text style={{ color: '#fff', fontSize: 11, fontFamily: 'Inter_600SemiBold' }}>₹29</Text>
        </LinearGradient>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Photo Upload */}
        <Pressable onPress={pickImage} style={[styles.uploadArea, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
          {image ? (
            <Image source={{ uri: image }} style={styles.uploadedImage} />
          ) : (
            <>
              <LinearGradient colors={['#FF6B33', '#B44CFF']} style={styles.uploadIcon}>
                <Icon name="image" size={28} color="#fff" />
              </LinearGradient>
              <Text style={[fontVariants.bodySemibold, { color: colors.foreground, marginTop: 12 }]}>Upload Photo</Text>
              <Text style={[fontVariants.caption, { color: colors.mutedForeground, marginTop: 4 }]}>
                Tap to select from gallery
              </Text>
            </>
          )}
        </Pressable>

        {/* Template Selection */}
        <View>
          <Text style={[fontVariants.h4, { color: colors.foreground, marginBottom: 12 }]}>Choose Template</Text>
          <View style={styles.templateGrid}>
            {TEMPLATES.map((t) => (
              <Pressable
                key={t.id}
                onPress={() => setTemplate(t.id)}
                style={[styles.templateCard, { borderColor: template === t.id ? t.gradient[0] : 'transparent', borderWidth: 2 }]}
              >
                <LinearGradient colors={t.gradient} style={styles.templateGradient}>
                  <Text style={{ color: '#fff', fontFamily: 'DancingScript_600SemiBold', fontSize: 14 }}>{t.label}</Text>
                </LinearGradient>
                {template === t.id && (
                  <View style={[styles.templateCheck, { backgroundColor: t.gradient[0] }]}>
                    <Icon name="check" size={10} color="#fff" />
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {/* Message */}
        <View>
          <Text style={[fontVariants.captionMedium, { color: colors.foreground, marginBottom: 8 }]}>Recipient Name</Text>
          <View style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border }]}>
            <TextInput value={recipientName} onChangeText={setRecipientName} placeholder="Who is this for?" placeholderTextColor={colors.mutedForeground} style={[fontVariants.body, { color: colors.foreground, flex: 1 }]} />
          </View>
        </View>

        <View>
          <Text style={[fontVariants.captionMedium, { color: colors.foreground, marginBottom: 8 }]}>Wish Message</Text>
          <TextInput value={message} onChangeText={setMessage} placeholder="Write a heartfelt message…" placeholderTextColor={colors.mutedForeground} multiline numberOfLines={4} textAlignVertical="top" style={[styles.textarea, { backgroundColor: colors.input, borderColor: colors.border, color: colors.foreground }]} />
        </View>

        {/* Preview */}
        {generated && (
          <View style={[styles.previewCard, { ...shadows.lg }]}>
            <LinearGradient colors={selectedTemplate.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.previewGradient}>
              {image && <Image source={{ uri: image }} style={styles.previewImage} />}
              <Text style={{ fontFamily: 'DancingScript_700Bold', fontSize: 24, color: '#fff', textAlign: 'center', marginTop: 12 }}>
                Happy {TEMPLATES.find((t) => t.id === template)?.label}!
              </Text>
              {recipientName && <Text style={{ fontFamily: 'PlayfairDisplay_700Bold', fontSize: 20, color: '#fff', textAlign: 'center', marginTop: 4 }}>{recipientName}</Text>}
              {message && <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginTop: 8, paddingHorizontal: 16 }}>{message}</Text>}
            </LinearGradient>
          </View>
        )}

        <Pressable onPress={handleGenerate} disabled={isGenerating}>
          <LinearGradient colors={['#FF6B33', '#B44CFF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.genBtn}>
            {isGenerating ? <ActivityIndicator color="#fff" /> : (
              <>
                <Icon name="image" size={18} color="#fff" />
                <Text style={{ color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 16 }}>
                  {generated ? 'Regenerate · ₹29' : 'Generate Wish · ₹29'}
                </Text>
              </>
            )}
          </LinearGradient>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  costBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999 },
  uploadArea: { height: 180, borderRadius: 20, borderWidth: 2, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  uploadIcon: { width: 60, height: 60, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  uploadedImage: { width: '100%', height: '100%' },
  templateGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  templateCard: { width: 96, height: 64, borderRadius: 12, overflow: 'hidden', position: 'relative' },
  templateGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  templateCheck: { position: 'absolute', top: 4, right: 4, width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  input: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12, borderWidth: 1 },
  textarea: { borderRadius: 12, padding: 14, fontSize: 14, fontFamily: 'Inter_400Regular', minHeight: 100, borderWidth: 1 },
  previewCard: { borderRadius: 20, overflow: 'hidden' },
  previewGradient: { padding: 24, alignItems: 'center' },
  previewImage: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#fff' },
  genBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 18, borderRadius: 16 },
});
