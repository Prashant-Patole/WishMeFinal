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

const STEPS = ['Personal Info', 'Contact', 'Done'];

function Input({ label, value, onChange, placeholder, keyboardType = 'default', icon }: any) {
  const { colors } = useTheme();
  return (
    <View>
      <Text style={[fontVariants.captionMedium, { color: colors.foreground, marginBottom: 8 }]}>{label}</Text>
      <View style={[styles.inputWrap, { backgroundColor: colors.input, borderColor: colors.border }]}>
        <Icon name={icon} size={18} color={colors.mutedForeground} />
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={colors.mutedForeground}
          keyboardType={keyboardType}
          style={[fontVariants.body, { color: colors.foreground, flex: 1 }]}
        />
      </View>
    </View>
  );
}

export default function CompleteProfileScreen() {
  const { colors, isDark } = useTheme();
  const { updateProfile } = useAuth();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const botPad = Platform.OS === 'web' ? 34 : 0;

  const [step, setStep] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleNext = async () => {
    if (step < STEPS.length - 2) {
      setStep(step + 1);
    } else {
      setIsSaving(true);
      await updateProfile({ firstName, lastName, phone, dob, address });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsSaving(false);
      setStep(2);
    }
  };

  if (step === 2) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <LinearGradient colors={['#FF6B33', '#B44CFF']} style={styles.successIcon}>
          <Icon name="check" size={40} color="#fff" />
        </LinearGradient>
        <Text style={[fontVariants.h2, { color: colors.foreground, marginTop: 24, textAlign: 'center' }]}>
          Profile Complete!
        </Text>
        <Text style={[fontVariants.body, { color: colors.mutedForeground, textAlign: 'center', marginTop: 8, marginBottom: 40 }]}>
          You're all set. Start exploring celebrities and booking personalized messages.
        </Text>
        <Pressable onPress={() => router.replace('/(tabs)')} style={{ width: '100%' }}>
          <LinearGradient colors={['#FF6B33', '#B44CFF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.doneBtn}>
            <Text style={{ color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 16 }}>Explore WishMe</Text>
          </LinearGradient>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={isDark ? ['#1A2035', '#20293E'] : ['#F8F0FF', '#FFF5F0']}
          style={[styles.header, { paddingTop: topPad + 24 }]}
        >
          <Pressable onPress={() => step === 0 ? router.back() : setStep(step - 1)} style={[styles.backBtn, { backgroundColor: colors.card }]}>
            <Icon name="arrow-left" size={20} color={colors.foreground} />
          </Pressable>
          <Text style={[fontVariants.h3, { color: colors.foreground, textAlign: 'center' }]}>Complete Profile</Text>
          <Text style={[fontVariants.caption, { color: colors.mutedForeground, textAlign: 'center', marginTop: 4 }]}>
            Step {step + 1} of {STEPS.length - 1} — {STEPS[step]}
          </Text>
          <View style={styles.stepBars}>
            {STEPS.slice(0, -1).map((_, i) => (
              <LinearGradient
                key={i}
                colors={i <= step ? ['#FF6B33', '#B44CFF'] : [colors.muted, colors.muted]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.stepBar}
              />
            ))}
          </View>
        </LinearGradient>

        <View style={{ padding: 24, gap: 18, flex: 1 }}>
          {step === 0 && (
            <>
              <Input label="First Name" value={firstName} onChange={setFirstName} placeholder="Rahul" icon="user" />
              <Input label="Last Name" value={lastName} onChange={setLastName} placeholder="Sharma" icon="user" />
              <Input label="Date of Birth" value={dob} onChange={setDob} placeholder="DD/MM/YYYY" icon="calendar" />
            </>
          )}
          {step === 1 && (
            <>
              <Input label="Phone Number" value={phone} onChange={setPhone} placeholder="+91 98765 43210" keyboardType="phone-pad" icon="phone" />
              <Input label="Address" value={address} onChange={setAddress} placeholder="Mumbai, Maharashtra" icon="map-pin" />
            </>
          )}

          <View style={{ flex: 1 }} />
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: botPad + 16, backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <Pressable onPress={handleNext} disabled={isSaving}>
          <LinearGradient
            colors={['#FF6B33', '#B44CFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.nextBtn}
          >
            {isSaving ? <ActivityIndicator color="#fff" /> : (
              <>
                <Text style={{ color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 16 }}>
                  {step === STEPS.length - 2 ? 'Save Profile' : 'Continue'}
                </Text>
                <Icon name="arrow-right" size={18} color="#fff" />
              </>
            )}
          </LinearGradient>
        </Pressable>
        <Pressable onPress={() => step === STEPS.length - 2 ? router.replace('/(tabs)') : setStep(step + 1)} style={{ padding: 12, alignItems: 'center' }}>
          <Text style={[fontVariants.captionMedium, { color: colors.mutedForeground }]}>Skip for now</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 24, paddingBottom: 24, alignItems: 'center', gap: 8 },
  backBtn: { position: 'absolute', top: 0, left: 20, width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  stepBars: { flexDirection: 'row', gap: 6, marginTop: 8, width: '100%', paddingHorizontal: 40 },
  stepBar: { flex: 1, height: 4, borderRadius: 2 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderRadius: 12, borderWidth: 1 },
  footer: { paddingHorizontal: 20, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, gap: 4 },
  nextBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 18, borderRadius: 16 },
  doneBtn: { paddingVertical: 18, borderRadius: 16, alignItems: 'center' },
  successIcon: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center' },
});
