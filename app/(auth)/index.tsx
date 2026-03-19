import { Icon, IconName } from '@/components/Icon';
import { fontVariants, fontSize } from '@/constants/fonts';
import { radius, shadows } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
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

type AuthTab = 'signin' | 'signup' | 'celebrity';
type ForgotStep = 'form' | 'sent';
type ForgotMethod = 'email' | 'phone';
type SignupStep = 'form' | 'otp';

function generatePassword(): string {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const nums = '0123456789';
  const special = '!@#$%^&*';
  const all = upper + lower + nums + special;
  let pwd = upper[Math.floor(Math.random() * upper.length)];
  pwd += lower[Math.floor(Math.random() * lower.length)];
  pwd += nums[Math.floor(Math.random() * nums.length)];
  pwd += special[Math.floor(Math.random() * special.length)];
  for (let i = 4; i < 16; i++) pwd += all[Math.floor(Math.random() * all.length)];
  return pwd.split('').sort(() => Math.random() - 0.5).join('');
}

function getPasswordChecks(password: string) {
  return [
    { label: '12+ characters', ok: password.length >= 12 },
    { label: 'Uppercase letter', ok: /[A-Z]/.test(password) },
    { label: 'Lowercase letter', ok: /[a-z]/.test(password) },
    { label: 'Number', ok: /[0-9]/.test(password) },
    { label: 'Special char (!@#$%^&*)', ok: /[!@#$%^&*]/.test(password) },
  ];
}

function PasswordStrengthMeter({ password, onGenerate }: { password: string; onGenerate: (p: string) => void }) {
  const { colors } = useTheme();
  const checks = getPasswordChecks(password);
  const score = checks.filter((c) => c.ok).length;
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const barColors = ['', '#EF4444', '#F59E0B', '#EAB308', '#22C55E', '#16A34A'];
  const strengthLabel = labels[score];
  const strengthColor = barColors[score];

  return (
    <View style={{ gap: 10, marginTop: 10 }}>
      <Pressable
        onPress={() => onGenerate(generatePassword())}
        style={[styles.generateBtn, { borderColor: colors.primary + '60', backgroundColor: colors.primary + '10' }]}
      >
        <Icon name="sparkles" size={14} color={colors.primary} />
        <Text style={[fontVariants.captionMedium, { color: colors.primary }]}>Generate Strong Password</Text>
      </Pressable>

      {password.length > 0 && (
        <>
          <View style={{ flexDirection: 'row', gap: 4 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <View
                key={i}
                style={[
                  styles.strengthBar,
                  { backgroundColor: i < score ? strengthColor : colors.muted },
                ]}
              />
            ))}
          </View>
          {strengthLabel ? (
            <Text style={[fontVariants.caption, { color: strengthColor, textAlign: 'right' }]}>
              {strengthLabel}
            </Text>
          ) : null}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {checks.map((c) => (
              <View key={c.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Icon name={c.ok ? 'check-circle' : 'circle'} size={12} color={c.ok ? '#22C55E' : colors.mutedForeground} />
                <Text style={{ fontSize: 11, fontFamily: 'Inter_400Regular', color: c.ok ? '#22C55E' : colors.mutedForeground }}>
                  {c.label}
                </Text>
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  );
}

function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  keyboardType,
  secureTextEntry,
  autoCapitalize,
  rightElement,
  error,
  helper,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  icon: IconName;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'number-pad';
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'words' | 'sentences' | 'characters';
  rightElement?: React.ReactNode;
  error?: string;
  helper?: string;
}) {
  const { colors } = useTheme();
  return (
    <View style={{ gap: 6 }}>
      <Text style={[fontVariants.captionMedium, { color: colors.foreground }]}>{label}</Text>
      <View
        style={[
          styles.inputWrap,
          {
            backgroundColor: colors.input,
            borderColor: error ? colors.destructive : colors.border,
          },
        ]}
      >
        <Icon name={icon} size={16} color={colors.mutedForeground} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.mutedForeground}
          keyboardType={keyboardType ?? 'default'}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize ?? 'sentences'}
          style={[fontVariants.body, { color: colors.foreground, flex: 1 }]}
        />
        {rightElement}
      </View>
      {error ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Icon name="alert-circle" size={12} color={colors.destructive} />
          <Text style={[fontVariants.caption, { color: colors.destructive }]}>{error}</Text>
        </View>
      ) : null}
      {helper && !error ? (
        <Text style={[fontVariants.caption, { color: colors.mutedForeground }]}>{helper}</Text>
      ) : null}
    </View>
  );
}

function SignInTab() {
  const { colors } = useTheme();
  const { login, user } = useAuth();

  const [view, setView] = useState<'form' | 'forgot'>('form');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [forgotMethod, setForgotMethod] = useState<ForgotMethod>('email');
  const [forgotInput, setForgotInput] = useState('');
  const [forgotStep, setForgotStep] = useState<ForgotStep>('form');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');

  const handleLogin = async () => {
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    if (!password) { setError('Please enter your password.'); return; }
    setError('');
    setIsLoading(true);
    try {
      await login(email.trim(), password);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const role = user?.role ?? 'user';
      if (role === 'admin') router.replace('/admin' as never);
      else if (role === 'celebrity') router.replace('/celebrity-dashboard' as never);
      else router.replace('/(tabs)');
    } catch {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendReset = () => {
    if (!forgotInput.trim()) { setForgotError('Please enter your ' + (forgotMethod === 'email' ? 'email' : 'phone number') + '.'); return; }
    setForgotError('');
    setForgotLoading(true);
    setTimeout(() => {
      setForgotLoading(false);
      setForgotStep('sent');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 1500);
  };

  if (view === 'forgot') {
    return (
      <View style={{ gap: 20 }}>
        <Pressable onPress={() => { setView('form'); setForgotStep('form'); setForgotInput(''); setForgotError(''); }}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Icon name="arrow-left" size={18} color={colors.primary} />
          <Text style={[fontVariants.captionMedium, { color: colors.primary }]}>Back to Sign In</Text>
        </Pressable>

        <View style={{ alignItems: 'center', gap: 8 }}>
          <View style={[styles.iconCircle, { backgroundColor: colors.primary + '15' }]}>
            <Icon name="key" size={28} color={colors.primary} />
          </View>
          <Text style={[fontVariants.h3, { color: colors.foreground, textAlign: 'center' }]}>Forgot Password</Text>
          <Text style={[fontVariants.caption, { color: colors.mutedForeground, textAlign: 'center' }]}>
            We'll send a reset link to your registered contact
          </Text>
        </View>

        {forgotStep === 'sent' ? (
          <View style={{ alignItems: 'center', gap: 16 }}>
            <View style={[styles.iconCircle, { backgroundColor: '#22C55E15', width: 80, height: 80, borderRadius: 40 }]}>
              <Icon name="check-circle" size={40} color="#22C55E" />
            </View>
            <Text style={[fontVariants.h4, { color: colors.foreground }]}>Reset Link Sent!</Text>
            <Text style={[fontVariants.body, { color: colors.mutedForeground, textAlign: 'center' }]}>
              Check your {forgotMethod === 'email' ? 'inbox' : 'phone'} for the password reset link.
            </Text>
            <Pressable onPress={() => { setView('form'); setForgotStep('form'); setForgotInput(''); }}
              style={[styles.gradientBtn, { backgroundColor: colors.primary + '15', borderRadius: radius.base }]}>
              <Text style={[fontVariants.bodySemibold, { color: colors.primary }]}>Back to Sign In</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {(['email', 'phone'] as ForgotMethod[]).map((m) => (
                <Pressable
                  key={m}
                  onPress={() => { setForgotMethod(m); setForgotInput(''); }}
                  style={[
                    styles.methodToggle,
                    {
                      flex: 1,
                      borderColor: forgotMethod === m ? colors.primary : colors.border,
                      backgroundColor: forgotMethod === m ? colors.primary + '10' : colors.input,
                    },
                  ]}
                >
                  <Icon name={m === 'email' ? 'mail' : 'phone'} size={14} color={forgotMethod === m ? colors.primary : colors.mutedForeground} />
                  <Text style={[fontVariants.captionMedium, { color: forgotMethod === m ? colors.primary : colors.mutedForeground }]}>
                    {m === 'email' ? 'Email' : 'Phone'}
                  </Text>
                </Pressable>
              ))}
            </View>

            <InputField
              label={forgotMethod === 'email' ? 'Email Address' : 'Phone Number'}
              value={forgotInput}
              onChangeText={setForgotInput}
              placeholder={forgotMethod === 'email' ? 'your@email.com' : '+91 98765 43210'}
              icon={forgotMethod === 'email' ? 'mail' : 'phone'}
              keyboardType={forgotMethod === 'email' ? 'email-address' : 'phone-pad'}
              autoCapitalize="none"
              error={forgotError}
            />

            <Pressable onPress={handleSendReset} disabled={forgotLoading}>
              <LinearGradient colors={['#FF6B33', '#B44CFF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={[styles.gradientBtn, { opacity: forgotLoading ? 0.8 : 1 }]}>
                {forgotLoading ? <ActivityIndicator color="#fff" /> : (
                  <Text style={{ color: '#fff', fontFamily: 'Inter_700Bold', fontSize: fontSize.base }}>Send Reset Link</Text>
                )}
              </LinearGradient>
            </Pressable>
          </>
        )}
      </View>
    );
  }

  return (
    <View style={{ gap: 18 }}>
      {error ? (
        <View style={[styles.errorBox, { backgroundColor: colors.destructive + '12', borderColor: colors.destructive + '40' }]}>
          <Icon name="alert-circle" size={15} color={colors.destructive} />
          <Text style={[fontVariants.caption, { color: colors.destructive, flex: 1 }]}>{error}</Text>
        </View>
      ) : null}

      <InputField
        label="Email Address"
        value={email}
        onChangeText={setEmail}
        placeholder="your@email.com"
        icon="mail"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={{ gap: 6 }}>
        <Text style={[fontVariants.captionMedium, { color: colors.foreground }]}>Password</Text>
        <View style={[styles.inputWrap, { backgroundColor: colors.input, borderColor: colors.border }]}>
          <Icon name="lock" size={16} color={colors.mutedForeground} />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor={colors.mutedForeground}
            secureTextEntry={!showPwd}
            style={[fontVariants.body, { color: colors.foreground, flex: 1 }]}
          />
          <Pressable onPress={() => setShowPwd(!showPwd)}>
            <Icon name={showPwd ? 'eye-off' : 'eye'} size={16} color={colors.mutedForeground} />
          </Pressable>
        </View>
      </View>

      <Pressable onPress={() => setView('forgot')} style={{ alignSelf: 'flex-end' }}>
        <Text style={[fontVariants.captionMedium, { color: colors.primary }]}>Forgot Password?</Text>
      </Pressable>

      <Pressable onPress={handleLogin} disabled={isLoading}>
        <LinearGradient colors={['#FF6B33', '#B44CFF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={[styles.gradientBtn, { opacity: isLoading ? 0.8 : 1 }]}>
          {isLoading ? <ActivityIndicator color="#fff" /> : (
            <Text style={{ color: '#fff', fontFamily: 'Inter_700Bold', fontSize: fontSize.base }}>Sign In</Text>
          )}
        </LinearGradient>
      </Pressable>
    </View>
  );
}

function SignUpTab() {
  const { colors } = useTheme();
  const { signup } = useAuth();

  const [step, setStep] = useState<SignupStep>('form');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);
  const otpRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (resendCountdown > 0) {
      const t = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendCountdown]);

  const checks = getPasswordChecks(password);
  const isPasswordValid = checks.every((c) => c.ok);

  const validateForm = (): boolean => {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = 'First name is required';
    if (!lastName.trim()) e.lastName = 'Last name is required';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email address';
    if (!phone.trim() || !/^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''))) e.phone = 'Enter a valid 10-digit Indian mobile number';
    if (!isPasswordValid) e.password = 'Password does not meet all requirements';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleContinue = () => {
    router.replace('/(tabs)');
  };

  const handleOtpChange = (val: string, idx: number) => {
    const next = [...otp];
    next[idx] = val.replace(/[^0-9]/g, '').slice(-1);
    setOtp(next);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
    if (next.every((d) => d !== '')) {
      setTimeout(() => handleVerify(next.join('')), 100);
    }
  };

  const handleOtpKey = (key: string, idx: number) => {
    if (key === 'Backspace' && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  const handleVerify = async (code?: string) => {
    const fullCode = code ?? otp.join('');
    if (fullCode.length < 6) { setOtpError('Please enter the complete 6-digit code.'); return; }
    setOtpError('');
    setIsVerifying(true);
    try {
      await signup(email.trim(), password, firstName.trim(), lastName.trim(), phone.trim(), referralCode || undefined);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(tabs)');
    } catch {
      setOtpError('Failed to create account. Please try again.');
      setIsVerifying(false);
    }
  };

  const handleResend = () => {
    setResendCountdown(30);
    setOtp(['', '', '', '', '', '']);
    otpRefs.current[0]?.focus();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  if (step === 'otp') {
    return (
      <View style={{ gap: 20 }}>
        <Pressable onPress={() => setStep('form')} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Icon name="arrow-left" size={18} color={colors.primary} />
          <Text style={[fontVariants.captionMedium, { color: colors.primary }]}>Back to Registration</Text>
        </Pressable>

        <View style={{ alignItems: 'center', gap: 8 }}>
          <View style={[styles.iconCircle, { backgroundColor: colors.primary + '15' }]}>
            <Icon name="mail-check" size={28} color={colors.primary} />
          </View>
          <Text style={[fontVariants.h3, { color: colors.foreground, textAlign: 'center' }]}>Verify Your Email</Text>
          <Text style={[fontVariants.caption, { color: colors.mutedForeground, textAlign: 'center', lineHeight: 20 }]}>
            We sent a 6-digit code to{'\n'}
            <Text style={{ color: colors.primary, fontFamily: 'Inter_600SemiBold' }}>{email}</Text>
          </Text>
        </View>

        {isVerifying ? (
          <View style={{ alignItems: 'center', gap: 12, paddingVertical: 20 }}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[fontVariants.captionMedium, { color: colors.mutedForeground }]}>Creating your account…</Text>
          </View>
        ) : (
          <>
            <View style={styles.otpRow}>
              {otp.map((digit, idx) => (
                <TextInput
                  key={idx}
                  ref={(r) => { otpRefs.current[idx] = r; }}
                  value={digit}
                  onChangeText={(v) => handleOtpChange(v, idx)}
                  onKeyPress={({ nativeEvent }) => handleOtpKey(nativeEvent.key, idx)}
                  maxLength={1}
                  keyboardType="number-pad"
                  style={[
                    styles.otpBox,
                    {
                      backgroundColor: colors.input,
                      borderColor: digit ? colors.primary : colors.border,
                      color: colors.foreground,
                    },
                  ]}
                  textAlign="center"
                />
              ))}
            </View>

            {otpError ? (
              <View style={[styles.errorBox, { backgroundColor: colors.destructive + '12', borderColor: colors.destructive + '40' }]}>
                <Icon name="alert-circle" size={15} color={colors.destructive} />
                <Text style={[fontVariants.caption, { color: colors.destructive, flex: 1 }]}>{otpError}</Text>
              </View>
            ) : null}

            <Pressable onPress={() => handleVerify()} disabled={!otp.every((d) => d !== '')}>
              <LinearGradient colors={['#FF6B33', '#B44CFF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={[styles.gradientBtn, { opacity: otp.every((d) => d !== '') ? 1 : 0.45 }]}>
                <Text style={{ color: '#fff', fontFamily: 'Inter_700Bold', fontSize: fontSize.base }}>Verify Email</Text>
              </LinearGradient>
            </Pressable>

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 }}>
              <Text style={[fontVariants.caption, { color: colors.mutedForeground }]}>Didn't receive the code?</Text>
              {resendCountdown > 0 ? (
                <Text style={[fontVariants.captionMedium, { color: colors.mutedForeground }]}>
                  Resend in {resendCountdown}s
                </Text>
              ) : (
                <Pressable onPress={handleResend}>
                  <Text style={[fontVariants.captionMedium, { color: colors.primary }]}>Resend OTP</Text>
                </Pressable>
              )}
            </View>
          </>
        )}
      </View>
    );
  }

  return (
    <View style={{ gap: 16 }}>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1, gap: 6 }}>
          <Text style={[fontVariants.captionMedium, { color: colors.foreground }]}>First Name</Text>
          <View style={[styles.inputWrap, { backgroundColor: colors.input, borderColor: errors.firstName ? colors.destructive : colors.border }]}>
            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              placeholder="First"
              placeholderTextColor={colors.mutedForeground}
              autoCapitalize="words"
              style={[fontVariants.body, { color: colors.foreground, flex: 1 }]}
            />
          </View>
          {errors.firstName ? <Text style={[fontVariants.caption, { color: colors.destructive }]}>{errors.firstName}</Text> : null}
        </View>
        <View style={{ flex: 1, gap: 6 }}>
          <Text style={[fontVariants.captionMedium, { color: colors.foreground }]}>Last Name</Text>
          <View style={[styles.inputWrap, { backgroundColor: colors.input, borderColor: errors.lastName ? colors.destructive : colors.border }]}>
            <TextInput
              value={lastName}
              onChangeText={setLastName}
              placeholder="Last"
              placeholderTextColor={colors.mutedForeground}
              autoCapitalize="words"
              style={[fontVariants.body, { color: colors.foreground, flex: 1 }]}
            />
          </View>
          {errors.lastName ? <Text style={[fontVariants.caption, { color: colors.destructive }]}>{errors.lastName}</Text> : null}
        </View>
      </View>

      <InputField
        label="Email Address"
        value={email}
        onChangeText={setEmail}
        placeholder="your@email.com"
        icon="mail"
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email}
      />

      <InputField
        label="Phone Number"
        value={phone}
        onChangeText={setPhone}
        placeholder="+91 98765 43210"
        icon="phone"
        keyboardType="phone-pad"
        autoCapitalize="none"
        helper="Enter 10-digit Indian mobile number"
        error={errors.phone}
      />

      <View style={{ gap: 6 }}>
        <Text style={[fontVariants.captionMedium, { color: colors.foreground }]}>Password</Text>
        <View style={[styles.inputWrap, { backgroundColor: colors.input, borderColor: errors.password ? colors.destructive : colors.border }]}>
          <Icon name="lock" size={16} color={colors.mutedForeground} />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Create a strong password"
            placeholderTextColor={colors.mutedForeground}
            secureTextEntry={!showPwd}
            style={[fontVariants.body, { color: colors.foreground, flex: 1 }]}
          />
          <Pressable onPress={() => setShowPwd(!showPwd)}>
            <Icon name={showPwd ? 'eye-off' : 'eye'} size={16} color={colors.mutedForeground} />
          </Pressable>
        </View>
        {errors.password ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Icon name="alert-circle" size={12} color={colors.destructive} />
            <Text style={[fontVariants.caption, { color: colors.destructive }]}>{errors.password}</Text>
          </View>
        ) : null}
        <PasswordStrengthMeter password={password} onGenerate={(p) => { setPassword(p); setShowPwd(true); }} />
      </View>

      <InputField
        label="Referral Code (Optional)"
        value={referralCode}
        onChangeText={setReferralCode}
        placeholder="Enter referral code"
        icon="gift"
        autoCapitalize="characters"
      />

      <Pressable onPress={handleContinue}>
        <LinearGradient
          colors={['#FF6B33', '#B44CFF']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={[styles.gradientBtn, { opacity: 1 }]}
        >
          {isLoading ? <ActivityIndicator color="#fff" /> : (
            <Text style={{ color: '#fff', fontFamily: 'Inter_700Bold', fontSize: fontSize.base }}>
              Continue to Verification
            </Text>
          )}
        </LinearGradient>
      </Pressable>

      <Text style={[fontVariants.caption, { color: colors.mutedForeground, textAlign: 'center', lineHeight: 20 }]}>
        By signing up, you agree to our{' '}
        <Text style={{ color: colors.primary }}>Terms of Service</Text> and{' '}
        <Text style={{ color: colors.primary }}>Privacy Policy</Text>
      </Text>
    </View>
  );
}

function CelebrityTab() {
  const { colors } = useTheme();

  const benefits: { icon: IconName; title: string; desc: string }[] = [
    { icon: 'trending-up', title: 'Earn Extra Income', desc: 'Monetize your fame with personalized video messages for fans' },
    { icon: 'users', title: 'Connect with Fans', desc: 'Build deeper relationships with your audience through direct interaction' },
    { icon: 'star', title: 'Flexible Schedule', desc: 'Work on your own time and set your own pricing for requests' },
  ];

  return (
    <View style={{ gap: 20 }}>
      <View style={{ gap: 12 }}>
        {benefits.map((b) => (
          <View
            key={b.title}
            style={[
              styles.benefitCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.primary + '25',
              },
              shadows.sm,
            ]}
          >
            <View style={[styles.benefitIcon, { backgroundColor: colors.primary + '15' }]}>
              <Icon name={b.icon} size={22} color={colors.primary} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={[fontVariants.bodySemibold, { color: colors.foreground }]}>{b.title}</Text>
              <Text style={[fontVariants.caption, { color: colors.mutedForeground, lineHeight: 18 }]}>{b.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={[styles.infoBox, { backgroundColor: colors.secondary + '10', borderColor: colors.secondary + '30' }]}>
        <Icon name="info" size={16} color={colors.secondary} />
        <Text style={[fontVariants.caption, { color: colors.mutedForeground, flex: 1, lineHeight: 18 }]}>
          Celebrity registration submits an application for admin review. Once approved, your account will be created.
        </Text>
      </View>

      <Pressable onPress={() => router.push('/(auth)/celebrity-signup')}>
        <LinearGradient
          colors={['#B44CFF', '#FF6B33']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={styles.gradientBtn}
        >
          <Icon name="star" size={18} color="#fff" />
          <Text style={{ color: '#fff', fontFamily: 'Inter_700Bold', fontSize: fontSize.base }}>Apply as Celebrity</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const TABS: { key: AuthTab; label: string }[] = [
  { key: 'signin', label: 'Sign In' },
  { key: 'signup', label: 'Sign Up' },
  { key: 'celebrity', label: 'Celebrity' },
];

export default function AuthScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<AuthTab>('signin');

  const tabTitles: Record<AuthTab, { title: string; sub: string }> = {
    signin: { title: 'Welcome Back!', sub: 'Sign in to your account' },
    signup: { title: 'Create Account', sub: 'Join WishMe and start connecting' },
    celebrity: { title: 'Join as Celebrity', sub: 'Connect with your fans directly' },
  };


  const features: { icon: IconName; title: string; desc: string }[] = [
    { icon: 'video', title: 'Personal Videos', desc: 'Custom messages for any occasion' },
    { icon: 'heart', title: 'Direct Connection', desc: 'Chat directly with your favorite stars' },
    { icon: 'shield-check', title: 'Verified Celebrities', desc: 'All stars are verified and authentic' },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={isDark ? ['#1F1530', '#1A2035', colors.background] : ['#FFF5F0', '#F8F0FF', colors.background]}
          style={[styles.hero, { paddingTop: insets.top + 20 }]}
        >
          <LinearGradient colors={['#FF6B33', '#B44CFF']} style={styles.logoMark}>
            <Text style={{ fontFamily: 'DancingScript_700Bold', fontSize: 30, color: '#fff' }}>W</Text>
          </LinearGradient>
          <Text style={[fontVariants.h2, { color: colors.foreground, marginTop: 12 }]}>WishMe</Text>
          <Text style={[fontVariants.caption, { color: colors.mutedForeground, marginTop: 2 }]}>
            India's Celebrity Engagement Platform
          </Text>
        </LinearGradient>

        <View style={styles.cardContainer}>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.primary + '20' }, shadows.lg]}>
            <View style={[styles.tabBar, { backgroundColor: colors.muted }]}>
              {TABS.map((t) => (
                <Pressable
                  key={t.key}
                  onPress={() => { setActiveTab(t.key); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                  style={[
                    styles.tabItem,
                    activeTab === t.key && [styles.tabItemActive, { backgroundColor: colors.card }, shadows.sm],
                  ]}
                >
                  <Text
                    style={[
                      fontVariants.captionMedium,
                      { color: activeTab === t.key ? colors.foreground : colors.mutedForeground },
                      activeTab === t.key && { fontFamily: 'Inter_600SemiBold' },
                    ]}
                  >
                    {t.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={{ paddingHorizontal: 4, paddingTop: 4, paddingBottom: 4 }}>
              <Text style={[fontVariants.h3, { color: colors.foreground, marginBottom: 2 }]}>
                {tabTitles[activeTab].title}
              </Text>
              <Text style={[fontVariants.caption, { color: colors.mutedForeground, marginBottom: 20 }]}>
                {tabTitles[activeTab].sub}
              </Text>

              {activeTab === 'signin' && <SignInTab />}
              {activeTab === 'signup' && <SignUpTab />}
              {activeTab === 'celebrity' && <CelebrityTab />}
            </View>
          </View>

          {activeTab === 'signin' && (
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 16 }}>
              <Text style={[fontVariants.body, { color: colors.mutedForeground }]}>Don't have an account?</Text>
              <Pressable onPress={() => setActiveTab('signup')}>
                <Text style={[fontVariants.bodySemibold, { color: colors.primary }]}>Sign Up</Text>
              </Pressable>
            </View>
          )}
          {activeTab === 'signup' && (
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 16 }}>
              <Text style={[fontVariants.body, { color: colors.mutedForeground }]}>Already have an account?</Text>
              <Pressable onPress={() => setActiveTab('signin')}>
                <Text style={[fontVariants.bodySemibold, { color: colors.primary }]}>Sign In</Text>
              </Pressable>
            </View>
          )}

          <View style={[styles.sectionBlock, { marginTop: 32 }]}>
            <Text style={[fontVariants.h4, { color: colors.foreground, marginBottom: 16 }]}>Why Choose WishMe?</Text>
            <View style={{ gap: 14 }}>
              {features.map((f) => (
                <View key={f.title} style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                  <View style={[styles.featureIcon, { backgroundColor: colors.primary + '12' }]}>
                    <Icon name={f.icon} size={18} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[fontVariants.bodySemibold, { color: colors.foreground }]}>{f.title}</Text>
                    <Text style={[fontVariants.caption, { color: colors.mutedForeground }]}>{f.desc}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  logoMark: {
    width: 68,
    height: 68,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    paddingHorizontal: 16,
    marginTop: -20,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    overflow: 'hidden',
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 9,
  },
  tabItemActive: {
    borderRadius: 9,
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
  gradientBtn: {
    flexDirection: 'row',
    height: 52,
    borderRadius: radius.base,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: radius.base,
    borderWidth: 1,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    borderRadius: radius.base,
    borderWidth: 1,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: radius.base,
    borderWidth: 1.5,
  },
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radius.base,
    borderWidth: 1,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  otpBox: {
    width: 46,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    fontFamily: 'Inter_700Bold',
    fontSize: 22,
  },
  benefitCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    padding: 14,
    borderRadius: radius.base,
    borderWidth: 1,
  },
  benefitIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionBlock: {
    paddingHorizontal: 4,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
