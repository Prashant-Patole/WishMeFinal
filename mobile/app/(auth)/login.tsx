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
import { radius, shadows } from '@/constants/theme';

export default function LoginScreen() {
  const { colors, isDark } = useTheme();
  const { login } = useAuth();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const handleLogin = async () => {
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setError('');
    setIsLoading(true);
    try {
      await login(email.trim(), password);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(tabs)');
    } catch (e) {
      setError('Invalid credentials. Please try again.');
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
        {/* Header Gradient */}
        <LinearGradient
          colors={isDark ? ['#1F1530', '#1A2035'] : ['#FFF5F0', '#F8F0FF']}
          style={[styles.hero, { paddingTop: topPad + 24 }]}
        >
          <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
            <Icon name="arrow-left" size={20} color={colors.foreground} />
          </Pressable>
          <LinearGradient colors={['#FF6B33', '#B44CFF']} style={styles.logoWrap}>
            <Text style={{ fontFamily: 'DancingScript_700Bold', fontSize: 28, color: '#fff' }}>W</Text>
          </LinearGradient>
          <Text style={[fontVariants.h2, { color: colors.foreground, marginTop: 16, textAlign: 'center' }]}>
            Welcome Back
          </Text>
          <Text style={[fontVariants.body, { color: colors.mutedForeground, textAlign: 'center', marginTop: 6 }]}>
            Sign in to your WishMe account
          </Text>
        </LinearGradient>

        {/* Form */}
        <View style={[styles.form, { backgroundColor: colors.background }]}>
          {error ? (
            <View style={[styles.errorBox, { backgroundColor: colors.destructive + '15', borderColor: colors.destructive }]}>
              <Icon name="alert-circle" size={16} color={colors.destructive} />
              <Text style={[fontVariants.caption, { color: colors.destructive, flex: 1 }]}>{error}</Text>
            </View>
          ) : null}

          {/* Email */}
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

          {/* Password */}
          <View>
            <Text style={[fontVariants.captionMedium, { color: colors.foreground, marginBottom: 8 }]}>Password</Text>
            <View style={[styles.inputWrap, { backgroundColor: colors.input, borderColor: colors.border }]}>
              <Icon name="lock" size={18} color={colors.mutedForeground} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={colors.mutedForeground}
                secureTextEntry={!showPassword}
                style={[fontVariants.body, { color: colors.foreground, flex: 1 }]}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <Icon name={showPassword ? 'eye-off' : 'eye'} size={18} color={colors.mutedForeground} />
              </Pressable>
            </View>
          </View>

          <Pressable style={{ alignSelf: 'flex-end' }}>
            <Text style={[fontVariants.captionMedium, { color: colors.primary }]}>Forgot Password?</Text>
          </Pressable>

          {/* Sign In Button */}
          <Pressable onPress={handleLogin} disabled={isLoading} style={{ marginTop: 8 }}>
            <LinearGradient
              colors={['#FF6B33', '#B44CFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.signInBtn, { opacity: isLoading ? 0.8 : 1 }]}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 16 }}>Sign In</Text>
              )}
            </LinearGradient>
          </Pressable>

          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[fontVariants.caption, { color: colors.mutedForeground, marginHorizontal: 12 }]}>or</Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View>

          <View style={styles.signupRow}>
            <Text style={[fontVariants.body, { color: colors.mutedForeground }]}>Don't have an account?</Text>
            <Pressable onPress={() => router.replace('/(auth)/signup')}>
              <Text style={[fontVariants.bodySemibold, { color: colors.primary }]}> Sign Up</Text>
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
  form: { padding: 24, gap: 18, flex: 1 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderRadius: 12, borderWidth: 1 },
  errorBox: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 10, borderWidth: 1 },
  signInBtn: { paddingVertical: 18, borderRadius: 14, alignItems: 'center' },
  divider: { flexDirection: 'row', alignItems: 'center' },
  dividerLine: { flex: 1, height: 1 },
  signupRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
});
