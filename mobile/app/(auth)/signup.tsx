import { Icon } from '@/components/Icon';
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

import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { fontVariants } from '@/constants/fonts';

function PasswordStrength({ password }: { password: string }) {
  const { colors } = useTheme();
  const checks = [
    { label: '8+ characters', ok: password.length >= 8 },
    { label: 'Uppercase', ok: /[A-Z]/.test(password) },
    { label: 'Number', ok: /[0-9]/.test(password) },
    { label: 'Special char', ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][score];
  const strengthColor = ['', '#EF4444', '#F59E0B', '#22C55E', '#16A34A'][score];

  if (!password) return null;

  return (
    <View style={{ gap: 8 }}>
      <View style={styles.strengthBars}>
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            style={[styles.strengthBar, { backgroundColor: i < score ? strengthColor : colors.muted }]}
          />
        ))}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {checks.map((c) => (
            <View key={c.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
              <Icon name={c.ok ? 'check' : 'x'} size={11} color={c.ok ? '#22C55E' : colors.mutedForeground} />
              <Text style={{ fontSize: 11, fontFamily: 'Inter_400Regular', color: c.ok ? '#22C55E' : colors.mutedForeground }}>
                {c.label}
              </Text>
            </View>
          ))}
        </View>
        {score > 0 && <Text style={{ fontSize: 12, fontFamily: 'Inter_600SemiBold', color: strengthColor }}>{strengthLabel}</Text>}
      </View>
    </View>
  );
}

export default function SignupScreen() {
  const { colors, isDark } = useTheme();
  const { signup } = useAuth();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setError('');
    setIsLoading(true);
    try {
      await signup(email.trim(), password, referralCode || undefined);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.push('/(auth)/verify-otp');
    } catch (e) {
      setError('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={isDark ? ['#1F1530', '#1A2035'] : ['#F8F0FF', '#FFF5F0']}
          style={[styles.hero, { paddingTop: topPad + 24 }]}
        >
          <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
            <Icon name="arrow-left" size={20} color={colors.foreground} />
          </Pressable>
          <LinearGradient colors={['#B44CFF', '#FF6B33']} style={styles.logoWrap}>
            <Text style={{ fontFamily: 'DancingScript_700Bold', fontSize: 28, color: '#fff' }}>W</Text>
          </LinearGradient>
          <Text style={[fontVariants.h2, { color: colors.foreground, marginTop: 16, textAlign: 'center' }]}>Create Account</Text>
          <Text style={[fontVariants.body, { color: colors.mutedForeground, textAlign: 'center', marginTop: 6 }]}>
            Join 2M+ users on WishMe
          </Text>
        </LinearGradient>

        <View style={[styles.form, { backgroundColor: colors.background }]}>
          {error ? (
            <View style={[styles.errorBox, { backgroundColor: colors.destructive + '15', borderColor: colors.destructive }]}>
              <Icon name="alert-circle" size={16} color={colors.destructive} />
              <Text style={[fontVariants.caption, { color: colors.destructive, flex: 1 }]}>{error}</Text>
            </View>
          ) : null}

          <View>
            <Text style={[fontVariants.captionMedium, { color: colors.foreground, marginBottom: 8 }]}>Email Address</Text>
            <View style={[styles.inputWrap, { backgroundColor: colors.input, borderColor: colors.border }]}>
              <Icon name="mail" size={18} color={colors.mutedForeground} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="email-address"
                autoCapitalize="none"
                style={[fontVariants.body, { color: colors.foreground, flex: 1 }]}
              />
            </View>
          </View>

          <View>
            <Text style={[fontVariants.captionMedium, { color: colors.foreground, marginBottom: 8 }]}>Password</Text>
            <View style={[styles.inputWrap, { backgroundColor: colors.input, borderColor: colors.border }]}>
              <Icon name="lock" size={18} color={colors.mutedForeground} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Create a strong password"
                placeholderTextColor={colors.mutedForeground}
                secureTextEntry={!showPassword}
                style={[fontVariants.body, { color: colors.foreground, flex: 1 }]}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <Icon name={showPassword ? 'eye-off' : 'eye'} size={18} color={colors.mutedForeground} />
              </Pressable>
            </View>
            <View style={{ marginTop: 10 }}>
              <PasswordStrength password={password} />
            </View>
          </View>

          <View>
            <Text style={[fontVariants.captionMedium, { color: colors.foreground, marginBottom: 8 }]}>
              Referral Code <Text style={{ color: colors.mutedForeground }}>(Optional)</Text>
            </Text>
            <View style={[styles.inputWrap, { backgroundColor: colors.input, borderColor: colors.border }]}>
              <Icon name="gift" size={18} color={colors.mutedForeground} />
              <TextInput
                value={referralCode}
                onChangeText={setReferralCode}
                placeholder="Enter referral code"
                placeholderTextColor={colors.mutedForeground}
                autoCapitalize="characters"
                style={[fontVariants.body, { color: colors.foreground, flex: 1 }]}
              />
            </View>
          </View>

          <Pressable onPress={handleSignup} disabled={isLoading}>
            <LinearGradient
              colors={['#FF6B33', '#B44CFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.signUpBtn, { opacity: isLoading ? 0.8 : 1 }]}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 16 }}>Create Account</Text>
              )}
            </LinearGradient>
          </Pressable>

          <Text style={[fontVariants.caption, { color: colors.mutedForeground, textAlign: 'center' }]}>
            By signing up, you agree to our{' '}
            <Text style={{ color: colors.primary }}>Terms of Service</Text> and{' '}
            <Text style={{ color: colors.primary }}>Privacy Policy</Text>
          </Text>

          <View style={styles.loginRow}>
            <Text style={[fontVariants.body, { color: colors.mutedForeground }]}>Already have an account?</Text>
            <Pressable onPress={() => router.replace('/(auth)/login')}>
              <Text style={[fontVariants.bodySemibold, { color: colors.primary }]}> Sign In</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  hero: { paddingHorizontal: 24, paddingBottom: 40, alignItems: 'center' },
  backBtn: { position: 'absolute', top: 0, left: 20, width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  logoWrap: { width: 72, height: 72, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  form: { padding: 24, gap: 18 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderRadius: 12, borderWidth: 1 },
  errorBox: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 10, borderWidth: 1 },
  signUpBtn: { paddingVertical: 18, borderRadius: 14, alignItems: 'center' },
  strengthBars: { flexDirection: 'row', gap: 4 },
  strengthBar: { flex: 1, height: 4, borderRadius: 2 },
  loginRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
});
