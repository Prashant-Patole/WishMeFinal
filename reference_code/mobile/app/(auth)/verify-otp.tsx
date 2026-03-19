import { Icon } from '@/components/Icon';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { fontVariants } from '@/constants/fonts';

export default function VerifyOTPScreen() {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const refs = useRef<(TextInput | null)[]>([]);

  const handleChange = (val: string, idx: number) => {
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
    if (val && idx < 5) refs.current[idx + 1]?.focus();
  };

  const handleKeyPress = (key: string, idx: number) => {
    if (key === 'Backspace' && !otp[idx] && idx > 0) {
      refs.current[idx - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length < 6) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(auth)/select-plan');
    }, 1500);
  };

  const handleResend = () => {
    setIsResending(true);
    setTimeout(() => setIsResending(false), 2000);
  };

  const isComplete = otp.every((d) => d !== '');

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient
        colors={isDark ? ['#1F1530', '#1A2035'] : ['#FFF5F0', '#F8F0FF']}
        style={[styles.hero, { paddingTop: topPad + 24 }]}
      >
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
          <Icon name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <View style={[styles.iconWrap, { backgroundColor: colors.primary + '20' }]}>
          <Icon name="mail" size={36} color={colors.primary} />
        </View>
        <Text style={[fontVariants.h2, { color: colors.foreground, marginTop: 20, textAlign: 'center' }]}>
          Verify Your Email
        </Text>
        <Text style={[fontVariants.body, { color: colors.mutedForeground, textAlign: 'center', marginTop: 8 }]}>
          We sent a 6-digit code to{'\n'}
          <Text style={{ color: colors.primary }}>{user?.email ?? 'your email'}</Text>
        </Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* OTP Input */}
        <View style={styles.otpRow}>
          {otp.map((digit, idx) => (
            <TextInput
              key={idx}
              ref={(r) => { refs.current[idx] = r; }}
              value={digit}
              onChangeText={(val) => handleChange(val, idx)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, idx)}
              maxLength={1}
              keyboardType="number-pad"
              style={[
                styles.otpBox,
                {
                  backgroundColor: colors.input,
                  borderColor: digit ? colors.primary : colors.border,
                  color: colors.foreground,
                  fontFamily: 'Inter_700Bold',
                  fontSize: 22,
                },
              ]}
              textAlign="center"
            />
          ))}
        </View>

        <Pressable onPress={handleVerify} disabled={!isComplete || isVerifying}>
          <LinearGradient
            colors={['#FF6B33', '#B44CFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.verifyBtn, { opacity: isComplete ? 1 : 0.5 }]}
          >
            {isVerifying ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 16 }}>Verify Code</Text>
            )}
          </LinearGradient>
        </Pressable>

        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
          <Text style={[fontVariants.body, { color: colors.mutedForeground }]}>Didn't receive it?</Text>
          <Pressable onPress={handleResend} disabled={isResending} style={{ marginLeft: 6 }}>
            {isResending ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text style={[fontVariants.bodySemibold, { color: colors.primary }]}>Resend Code</Text>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { paddingHorizontal: 24, paddingBottom: 48, alignItems: 'center' },
  backBtn: { position: 'absolute', top: 0, left: 20, width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  iconWrap: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 32, gap: 24 },
  otpRow: { flexDirection: 'row', justifyContent: 'center', gap: 10 },
  otpBox: { width: 48, height: 60, borderRadius: 12, borderWidth: 2, textAlignVertical: 'center' },
  verifyBtn: { paddingVertical: 18, borderRadius: 14, alignItems: 'center' },
});
