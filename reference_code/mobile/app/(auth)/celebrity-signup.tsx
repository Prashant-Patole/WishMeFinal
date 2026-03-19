import { Icon, IconName } from '@/components/Icon';
import { fontVariants, fontSize } from '@/constants/fonts';
import { radius, shadows } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CATEGORIES = [
  'Actor/Actress', 'Musician', 'Comedian', 'Athlete', 'Model',
  'Influencer', 'YouTuber', 'Politician', 'Chef', 'Author', 'Other',
];

const SOCIAL_FIELDS: { key: string; label: string; icon: IconName; placeholder: string }[] = [
  { key: 'instagram', label: 'Instagram', icon: 'camera', placeholder: 'instagram.com/yourprofile' },
  { key: 'youtube', label: 'YouTube', icon: 'play-circle', placeholder: 'youtube.com/c/yourchannel' },
  { key: 'twitter', label: 'Twitter / X', icon: 'send', placeholder: 'twitter.com/yourhandle' },
  { key: 'tiktok', label: 'TikTok', icon: 'music-2', placeholder: 'tiktok.com/@yourprofile' },
  { key: 'facebook', label: 'Facebook', icon: 'users', placeholder: 'facebook.com/yourpage' },
  { key: 'linkedin', label: 'LinkedIn', icon: 'briefcase', placeholder: 'linkedin.com/in/yourprofile' },
  { key: 'website', label: 'Website', icon: 'globe', placeholder: 'https://yourwebsite.com' },
  { key: 'other', label: 'Other Link', icon: 'link', placeholder: 'https://otherlink.com' },
];

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  stageName: string;
  category: string;
  bio: string;
  portfolio: string;
  social: Record<string, string>;
  agreeTerms: boolean;
  agreeBackground: boolean;
}

function SectionHeader({ title }: { title: string }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.sectionHeader, { borderBottomColor: colors.border }]}>
      <Text style={[fontVariants.h4, { color: colors.foreground }]}>{title}</Text>
    </View>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  keyboardType,
  autoCapitalize,
  multiline,
  required,
  error,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  icon?: IconName;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'url';
  autoCapitalize?: 'none' | 'words' | 'sentences';
  multiline?: boolean;
  required?: boolean;
  error?: string;
}) {
  const { colors } = useTheme();
  return (
    <View style={{ gap: 6 }}>
      <Text style={[fontVariants.captionMedium, { color: colors.foreground }]}>
        {label}
        {required && <Text style={{ color: colors.destructive }}> *</Text>}
      </Text>
      <View
        style={[
          styles.inputWrap,
          multiline && { height: 100, alignItems: 'flex-start', paddingTop: 12 },
          { backgroundColor: colors.input, borderColor: error ? colors.destructive : colors.border },
        ]}
      >
        {icon && !multiline && <Icon name={icon} size={16} color={colors.mutedForeground} />}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.mutedForeground}
          keyboardType={keyboardType ?? 'default'}
          autoCapitalize={autoCapitalize ?? 'sentences'}
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
          style={[
            fontVariants.body,
            { color: colors.foreground, flex: 1 },
            multiline && { textAlignVertical: 'top' },
          ]}
        />
      </View>
      {error ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Icon name="alert-circle" size={12} color={colors.destructive} />
          <Text style={[fontVariants.caption, { color: colors.destructive }]}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
}

export default function CelebritySignupScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const [form, setForm] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    stageName: '',
    category: '',
    bio: '',
    portfolio: '',
    social: {},
    agreeTerms: false,
    agreeBackground: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const setField = (key: keyof FormData, val: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: val }));
  const setSocial = (key: string, val: string) =>
    setForm((prev) => ({ ...prev, social: { ...prev.social, [key]: val } }));

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone.trim()) e.phone = 'Required';
    if (!form.stageName.trim()) e.stageName = 'Required';
    if (!form.category) e.category = 'Please select a category';
    if (!form.bio.trim()) e.bio = 'Bio is required';
    if (!form.agreeTerms) e.agreeTerms = 'You must agree to the Terms & Celebrity Agreement';
    if (!form.agreeBackground) e.agreeBackground = 'You must consent to background verification';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => router.replace('/(tabs)'), 2000);
    }, 1800);
  };

  if (isSuccess) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 20 }}>
        <View style={[styles.successIcon, { backgroundColor: '#22C55E15' }]}>
          <Icon name="check-circle" size={60} color="#22C55E" />
        </View>
        <Text style={[fontVariants.h2, { color: colors.foreground, textAlign: 'center' }]}>Application Submitted!</Text>
        <Text style={[fontVariants.body, { color: colors.mutedForeground, textAlign: 'center', lineHeight: 24 }]}>
          Our admin team will review your application and contact you within 2–3 business days.
        </Text>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <LinearGradient
        colors={isDark ? ['#1F1530', '#1A2035'] : ['#F8F0FF', '#FFF5F0']}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      >
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
          <Icon name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <LinearGradient colors={['#B44CFF', '#FF6B33']} style={styles.logoMark}>
          <Icon name="star" size={26} color="#fff" />
        </LinearGradient>
        <Text style={[fontVariants.h2, { color: colors.foreground, marginTop: 14, textAlign: 'center' }]}>
          Join as Celebrity
        </Text>
        <Text style={[fontVariants.caption, { color: colors.mutedForeground, textAlign: 'center', marginTop: 4 }]}>
          Connect with your fans directly
        </Text>

        <View style={styles.benefitsRow}>
          {([
            { icon: 'trending-up' as IconName, label: 'Earn Income' },
            { icon: 'users' as IconName, label: 'Fan Connect' },
            { icon: 'clock' as IconName, label: 'Flexible' },
          ] as { icon: IconName; label: string }[]).map((b) => (
            <View key={b.label} style={[styles.benefitPill, { backgroundColor: colors.card + 'CC' }]}>
              <Icon name={b.icon} size={14} color={colors.primary} />
              <Text style={[fontVariants.caption, { color: colors.foreground, fontFamily: 'Inter_500Medium' }]}>{b.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={{ padding: 20, gap: 0, paddingBottom: insets.bottom + 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader title="Personal Information" />
        <View style={{ gap: 14, marginTop: 16 }}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Field label="First Name" value={form.firstName} onChangeText={(v) => setField('firstName', v)}
                placeholder="First" autoCapitalize="words" required error={errors.firstName} />
            </View>
            <View style={{ flex: 1 }}>
              <Field label="Last Name" value={form.lastName} onChangeText={(v) => setField('lastName', v)}
                placeholder="Last" autoCapitalize="words" required error={errors.lastName} />
            </View>
          </View>
          <Field label="Email" value={form.email} onChangeText={(v) => setField('email', v)}
            placeholder="your@email.com" icon="mail" keyboardType="email-address" autoCapitalize="none" required error={errors.email} />
          <Field label="Phone" value={form.phone} onChangeText={(v) => setField('phone', v)}
            placeholder="+91 98765 43210" icon="phone" keyboardType="phone-pad" autoCapitalize="none" required error={errors.phone} />
          <Field label="Date of Birth (Optional)" value={form.dob} onChangeText={(v) => setField('dob', v)}
            placeholder="DD/MM/YYYY" icon="calendar" />
        </View>

        <View style={{ marginTop: 28 }}>
          <SectionHeader title="Professional Information" />
          <View style={{ gap: 14, marginTop: 16 }}>
            <Field label="Stage Name" value={form.stageName} onChangeText={(v) => setField('stageName', v)}
              placeholder="Your public name" icon="user" required error={errors.stageName} />

            <View style={{ gap: 6 }}>
              <Text style={[fontVariants.captionMedium, { color: colors.foreground }]}>
                Category<Text style={{ color: colors.destructive }}> *</Text>
              </Text>
              <Pressable
                onPress={() => setShowCategoryPicker(!showCategoryPicker)}
                style={[styles.inputWrap, { backgroundColor: colors.input, borderColor: errors.category ? colors.destructive : colors.border }]}
              >
                <Icon name="briefcase" size={16} color={colors.mutedForeground} />
                <Text style={[fontVariants.body, { color: form.category ? colors.foreground : colors.mutedForeground, flex: 1 }]}>
                  {form.category || 'Select category…'}
                </Text>
                <Icon name={showCategoryPicker ? 'chevron-up' : 'chevron-down'} size={16} color={colors.mutedForeground} />
              </Pressable>
              {errors.category ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Icon name="alert-circle" size={12} color={colors.destructive} />
                  <Text style={[fontVariants.caption, { color: colors.destructive }]}>{errors.category}</Text>
                </View>
              ) : null}
              {showCategoryPicker && (
                <View style={[styles.categoryList, { backgroundColor: colors.card, borderColor: colors.border }, shadows.md]}>
                  {CATEGORIES.map((cat) => (
                    <Pressable
                      key={cat}
                      onPress={() => { setField('category', cat); setShowCategoryPicker(false); }}
                      style={[styles.categoryItem, { borderBottomColor: colors.border, backgroundColor: form.category === cat ? colors.primary + '10' : 'transparent' }]}
                    >
                      <Text style={[fontVariants.body, { color: form.category === cat ? colors.primary : colors.foreground }]}>{cat}</Text>
                      {form.category === cat && <Icon name="check" size={14} color={colors.primary} />}
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            <Field label="Bio" value={form.bio} onChangeText={(v) => setField('bio', v)}
              placeholder="Tell us about yourself, your career achievements…"
              multiline required error={errors.bio} />
          </View>
        </View>

        <View style={{ marginTop: 28 }}>
          <SectionHeader title="Social Media Links" />
          <View style={{ gap: 12, marginTop: 16 }}>
            {SOCIAL_FIELDS.map((s) => (
              <Field
                key={s.key}
                label={s.label}
                value={form.social[s.key] ?? ''}
                onChangeText={(v) => setSocial(s.key, v)}
                placeholder={s.placeholder}
                icon={s.icon}
                keyboardType="url"
                autoCapitalize="none"
              />
            ))}
          </View>
        </View>

        <View style={{ marginTop: 28 }}>
          <SectionHeader title="Verification" />
          <View style={{ marginTop: 16 }}>
            <Field label="Portfolio Link (Optional)" value={form.portfolio} onChangeText={(v) => setField('portfolio', v)}
              placeholder="https://yourportfolio.com" icon="external-link" keyboardType="url" autoCapitalize="none" />
          </View>
        </View>

        <View style={{ marginTop: 28, gap: 14 }}>
          <SectionHeader title="Terms & Agreements" />

          {[
            { key: 'agreeTerms', label: 'I agree to the Terms of Service and Celebrity Agreement', error: errors.agreeTerms },
            { key: 'agreeBackground', label: 'I consent to a background verification check', error: errors.agreeBackground },
          ].map((item) => (
            <View key={item.key} style={{ gap: 4, marginTop: 12 }}>
              <Pressable
                onPress={() => setField(item.key as keyof FormData, !form[item.key as keyof FormData])}
                style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}
              >
                <View style={[
                  styles.checkbox,
                  {
                    backgroundColor: form[item.key as keyof FormData] ? colors.primary : colors.input,
                    borderColor: item.error ? colors.destructive : form[item.key as keyof FormData] ? colors.primary : colors.border,
                  },
                ]}>
                  {form[item.key as keyof FormData] && <Icon name="check" size={13} color="#fff" />}
                </View>
                <Text style={[fontVariants.caption, { color: colors.foreground, flex: 1, lineHeight: 20 }]}>
                  {item.label}
                </Text>
              </Pressable>
              {item.error ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginLeft: 34 }}>
                  <Icon name="alert-circle" size={12} color={colors.destructive} />
                  <Text style={[fontVariants.caption, { color: colors.destructive }]}>{item.error}</Text>
                </View>
              ) : null}
            </View>
          ))}
        </View>

        <View style={{ marginTop: 28 }}>
          <Pressable onPress={handleSubmit} disabled={isSubmitting}>
            <LinearGradient
              colors={['#B44CFF', '#FF6B33']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={[styles.submitBtn, { opacity: isSubmitting ? 0.8 : 1 }]}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Icon name="star" size={18} color="#fff" />
                  <Text style={{ color: '#fff', fontFamily: 'Inter_700Bold', fontSize: fontSize.base }}>
                    Submit Application
                  </Text>
                </>
              )}
            </LinearGradient>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  backBtn: {
    position: 'absolute',
    top: 0,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoMark: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  benefitPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  sectionHeader: {
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    height: 48,
    borderRadius: radius.base,
    borderWidth: 1,
  },
  categoryList: {
    borderRadius: radius.base,
    borderWidth: 1,
    overflow: 'hidden',
    marginTop: 4,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  submitBtn: {
    flexDirection: 'row',
    height: 56,
    borderRadius: radius.base,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
