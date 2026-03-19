import { Icon, IconName } from '@/components/Icon';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
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
import { shadows } from '@/constants/theme';

const STEPS = ['Request', 'Delivery', 'Script', 'Review', 'Checkout'];

const OCCASIONS = ['Birthday', 'Anniversary', 'Wedding', 'Baby Shower', 'Graduation', 'Farewell', 'Business', 'Other'];
const DELIVERY: { id: string; label: string; desc: string; price: number; icon: IconName }[] = [
  { id: 'standard', label: 'Standard', desc: '3-5 business days', price: 0, icon: 'package' },
  { id: 'express', label: 'Express', desc: 'Within 24 hours', price: 499, icon: 'zap' },
];
const STYLES = ['Warm & Heartfelt', 'Funny & Playful', 'Inspirational', 'Professional', 'Casual & Friendly'];

export default function BookingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, isDark } = useTheme();
  const { user, updateWallet } = useAuth();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const botPad = Platform.OS === 'web' ? 34 : 0;

  const [step, setStep] = useState(0);
  const [occasion, setOccasion] = useState('Birthday');
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');
  const [deliveryType, setDeliveryType] = useState('standard');
  const [style, setStyle] = useState('Warm & Heartfelt');
  const [script, setScript] = useState('');
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'razorpay'>('wallet');
  const [isComplete, setIsComplete] = useState(false);

  const basePrice = 2499;
  const expressExtra = deliveryType === 'express' ? 499 : 0;
  const discount = user?.plan === 'gold' ? 0.1 : user?.plan === 'platinum' ? 0.15 : user?.plan === 'silver' ? 0.05 : 0;
  const total = Math.round((basePrice + expressExtra) * (1 - discount));

  const handleGenerateScript = () => {
    setIsGeneratingScript(true);
    setTimeout(() => {
      setScript(`Hey ${recipientName}! I heard it's your ${occasion.toLowerCase()} and I just wanted to take a moment to wish you something truly special. You deserve all the happiness in the world. Keep shining and making everyone around you proud. Happy ${occasion}!`);
      setIsGeneratingScript(false);
    }, 2000);
  };

  const handlePlaceOrder = () => {
    setIsPlacingOrder(true);
    setTimeout(() => {
      if (paymentMethod === 'wallet') updateWallet(-total);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsPlacingOrder(false);
      setIsComplete(true);
    }, 2000);
  };

  if (isComplete) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <LinearGradient colors={['#22C55E', '#16A34A']} style={styles.successIcon}>
          <Icon name="check" size={44} color="#fff" />
        </LinearGradient>
        <Text style={[fontVariants.h2, { color: colors.foreground, marginTop: 24, textAlign: 'center' }]}>Booking Confirmed!</Text>
        <Text style={[fontVariants.body, { color: colors.mutedForeground, textAlign: 'center', marginTop: 8, marginBottom: 8 }]}>
          Your order has been placed. The celebrity will{'\n'}fulfill your request within the delivery window.
        </Text>
        <View style={[styles.orderCard, { backgroundColor: colors.card }]}>
          <Text style={[fontVariants.captionMedium, { color: colors.mutedForeground }]}>Order ID</Text>
          <Text style={[fontVariants.bodySemibold, { color: colors.foreground }]}>WM{Date.now().toString().slice(-8)}</Text>
          <Text style={[fontVariants.captionMedium, { color: colors.mutedForeground, marginTop: 10 }]}>Amount Paid</Text>
          <Text style={[fontVariants.h4, { color: colors.primary }]}>₹{total.toLocaleString()}</Text>
        </View>
        <Pressable onPress={() => router.push('/bookings')} style={{ width: '100%', marginTop: 24 }}>
          <LinearGradient colors={['#FF6B33', '#B44CFF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.doneBtn}>
            <Text style={{ color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 16 }}>View My Bookings</Text>
          </LinearGradient>
        </Pressable>
        <Pressable onPress={() => router.replace('/(tabs)')} style={{ padding: 14, marginTop: 4 }}>
          <Text style={[fontVariants.captionMedium, { color: colors.mutedForeground }]}>Go to Home</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => step === 0 ? router.back() : setStep(step - 1)}>
          <Icon name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={[fontVariants.bodySemibold, { color: colors.foreground }]}>{STEPS[step]}</Text>
          <Text style={[fontVariants.caption, { color: colors.mutedForeground }]}>Step {step + 1} of {STEPS.length}</Text>
        </View>
        <Text style={[fontVariants.bodySemibold, { color: colors.primary }]}>₹{total.toLocaleString()}</Text>
      </View>

      {/* Step progress */}
      <View style={[styles.progressRow, { backgroundColor: colors.card }]}>
        {STEPS.map((_, i) => (
          <View key={i} style={[styles.progressDot, { backgroundColor: i <= step ? colors.primary : colors.muted }]} />
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, gap: 18, paddingBottom: 120 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {/* Step 0: Request Details */}
        {step === 0 && (
          <>
            <Text style={[fontVariants.h4, { color: colors.foreground }]}>Request Details</Text>

            <View>
              <Text style={[fontVariants.captionMedium, { color: colors.foreground, marginBottom: 10 }]}>Occasion</Text>
              <View style={styles.occasions}>
                {OCCASIONS.map((o) => (
                  <Pressable key={o} onPress={() => setOccasion(o)} style={[styles.occasionChip, { backgroundColor: occasion === o ? colors.primary : colors.backgroundSecondary, borderColor: occasion === o ? colors.primary : colors.border }]}>
                    <Text style={[fontVariants.captionMedium, { color: occasion === o ? '#fff' : colors.mutedForeground }]}>{o}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View>
              <Text style={[fontVariants.captionMedium, { color: colors.foreground, marginBottom: 8 }]}>Recipient Name</Text>
              <View style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border }]}>
                <Icon name="user" size={18} color={colors.mutedForeground} />
                <TextInput value={recipientName} onChangeText={setRecipientName} placeholder="Who is this for?" placeholderTextColor={colors.mutedForeground} style={[fontVariants.body, { color: colors.foreground, flex: 1 }]} />
              </View>
            </View>

            <View>
              <Text style={[fontVariants.captionMedium, { color: colors.foreground, marginBottom: 8 }]}>Special Instructions</Text>
              <TextInput value={message} onChangeText={setMessage} placeholder="Share any details you'd like included…" placeholderTextColor={colors.mutedForeground} multiline numberOfLines={4} textAlignVertical="top" style={[styles.textarea, { backgroundColor: colors.input, borderColor: colors.border, color: colors.foreground }]} />
            </View>
          </>
        )}

        {/* Step 1: Delivery */}
        {step === 1 && (
          <>
            <Text style={[fontVariants.h4, { color: colors.foreground }]}>Delivery Type</Text>
            {DELIVERY.map((d) => (
              <Pressable key={d.id} onPress={() => setDeliveryType(d.id)} style={[styles.deliveryCard, { backgroundColor: colors.card, borderColor: deliveryType === d.id ? colors.primary : colors.border, borderWidth: deliveryType === d.id ? 2 : 1, ...shadows.sm }]}>
                <View style={[styles.deliveryIcon, { backgroundColor: colors.primary + '15' }]}>
                  <Icon name={d.icon} size={22} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[fontVariants.bodySemibold, { color: colors.foreground }]}>{d.label}</Text>
                  <Text style={[fontVariants.caption, { color: colors.mutedForeground }]}>{d.desc}</Text>
                </View>
                <Text style={[fontVariants.bodySemibold, { color: colors.primary }]}>{d.price === 0 ? 'Free' : `+₹${d.price}`}</Text>
                {deliveryType === d.id && <Icon name="check-circle" size={22} color={colors.primary} />}
              </Pressable>
            ))}

            <Text style={[fontVariants.h4, { color: colors.foreground, marginTop: 8 }]}>Style Preference</Text>
            <View style={styles.occasions}>
              {STYLES.map((s) => (
                <Pressable key={s} onPress={() => setStyle(s)} style={[styles.occasionChip, { backgroundColor: style === s ? colors.secondary : colors.backgroundSecondary, borderColor: style === s ? colors.secondary : colors.border }]}>
                  <Text style={[fontVariants.captionMedium, { color: style === s ? '#fff' : colors.mutedForeground }]}>{s}</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}

        {/* Step 2: Script */}
        {step === 2 && (
          <>
            <Text style={[fontVariants.h4, { color: colors.foreground }]}>Script Builder</Text>
            <Text style={[fontVariants.body, { color: colors.mutedForeground }]}>
              Write your own script or let AI generate one based on your details.
            </Text>
            <TextInput value={script} onChangeText={setScript} placeholder="Write your script here, or use the AI generator below…" placeholderTextColor={colors.mutedForeground} multiline numberOfLines={8} textAlignVertical="top" style={[styles.scriptArea, { backgroundColor: colors.input, borderColor: colors.border, color: colors.foreground }]} />
            <Pressable onPress={handleGenerateScript} disabled={isGeneratingScript}>
              <LinearGradient colors={['#B44CFF', '#FF6B33']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.genBtn}>
                {isGeneratingScript ? <ActivityIndicator color="#fff" /> : (
                  <>
                    <Icon name="zap" size={16} color="#fff" />
                    <Text style={{ color: '#fff', fontFamily: 'Inter_600SemiBold', fontSize: 14 }}>Generate with AI</Text>
                  </>
                )}
              </LinearGradient>
            </Pressable>
          </>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <>
            <Text style={[fontVariants.h4, { color: colors.foreground }]}>Order Summary</Text>
            {[
              { label: 'Occasion', value: occasion },
              { label: 'For', value: recipientName || '—' },
              { label: 'Delivery', value: deliveryType === 'express' ? 'Express (24h)' : 'Standard (3-5 days)' },
              { label: 'Style', value: style },
            ].map((row) => (
              <View key={row.label} style={[styles.summaryRow, { borderBottomColor: colors.border }]}>
                <Text style={[fontVariants.captionMedium, { color: colors.mutedForeground }]}>{row.label}</Text>
                <Text style={[fontVariants.captionMedium, { color: colors.foreground }]}>{row.value}</Text>
              </View>
            ))}
            <View style={[styles.priceBreakdown, { backgroundColor: colors.backgroundSecondary }]}>
              <View style={styles.summaryRow2}>
                <Text style={[fontVariants.caption, { color: colors.mutedForeground }]}>Base Price</Text>
                <Text style={[fontVariants.captionMedium, { color: colors.foreground }]}>₹{basePrice.toLocaleString()}</Text>
              </View>
              {deliveryType === 'express' && (
                <View style={styles.summaryRow2}>
                  <Text style={[fontVariants.caption, { color: colors.mutedForeground }]}>Express Delivery</Text>
                  <Text style={[fontVariants.captionMedium, { color: colors.foreground }]}>+₹499</Text>
                </View>
              )}
              {discount > 0 && (
                <View style={styles.summaryRow2}>
                  <Text style={[fontVariants.caption, { color: '#22C55E' }]}>{user?.plan?.toUpperCase()} Discount ({Math.round(discount * 100)}%)</Text>
                  <Text style={[fontVariants.captionMedium, { color: '#22C55E' }]}>-₹{Math.round((basePrice + expressExtra) * discount).toLocaleString()}</Text>
                </View>
              )}
              <View style={[styles.summaryRow2, { marginTop: 6 }]}>
                <Text style={[fontVariants.bodySemibold, { color: colors.foreground }]}>Total</Text>
                <Text style={[fontVariants.h4, { color: colors.primary }]}>₹{total.toLocaleString()}</Text>
              </View>
            </View>
          </>
        )}

        {/* Step 4: Checkout */}
        {step === 4 && (
          <>
            <Text style={[fontVariants.h4, { color: colors.foreground }]}>Payment</Text>
            <Text style={[fontVariants.h3, { color: colors.primary, textAlign: 'center' }]}>₹{total.toLocaleString()}</Text>

            <View style={{ gap: 12 }}>
              {[
                { id: 'wallet' as const, icon: 'credit-card' as IconName, label: 'WishMe Wallet', desc: `Balance: ₹${user?.walletBalance?.toLocaleString() ?? 0}`, available: (user?.walletBalance ?? 0) >= total },
                { id: 'razorpay' as const, icon: 'smartphone' as IconName, label: 'Razorpay', desc: 'UPI, Cards, Net Banking', available: true },
              ].map((pm) => (
                <Pressable key={pm.id} onPress={() => setPaymentMethod(pm.id)} style={[styles.payCard, { backgroundColor: colors.card, borderColor: paymentMethod === pm.id ? colors.primary : colors.border, borderWidth: paymentMethod === pm.id ? 2 : 1, opacity: pm.available ? 1 : 0.5 }]}>
                  <Icon name={pm.icon} size={22} color={paymentMethod === pm.id ? colors.primary : colors.mutedForeground} />
                  <View style={{ flex: 1 }}>
                    <Text style={[fontVariants.bodySemibold, { color: colors.foreground }]}>{pm.label}</Text>
                    <Text style={[fontVariants.caption, { color: pm.available ? colors.mutedForeground : colors.destructive }]}>{pm.desc}</Text>
                  </View>
                  {paymentMethod === pm.id && <Icon name="check-circle" size={20} color={colors.primary} />}
                </Pressable>
              ))}
            </View>

            {(user?.walletBalance ?? 0) < total && paymentMethod === 'wallet' && (
              <View style={[styles.warningBox, { backgroundColor: colors.destructive + '15', borderColor: colors.destructive }]}>
                <Icon name="alert-circle" size={16} color={colors.destructive} />
                <Text style={[fontVariants.caption, { color: colors.destructive, flex: 1 }]}>
                  Insufficient wallet balance.{' '}
                  <Text style={{ fontFamily: 'Inter_600SemiBold' }} onPress={() => router.push('/wallet')}>Add funds →</Text>
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.footer, { paddingBottom: botPad + 12, backgroundColor: colors.background, borderTopColor: colors.border }]}>
        {step < STEPS.length - 1 ? (
          <Pressable onPress={() => setStep(step + 1)} style={{ flex: 1 }}>
            <LinearGradient colors={['#FF6B33', '#B44CFF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.nextBtn}>
              <Text style={{ color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 16 }}>Continue</Text>
              <Icon name="arrow-right" size={18} color="#fff" />
            </LinearGradient>
          </Pressable>
        ) : (
          <Pressable onPress={handlePlaceOrder} disabled={isPlacingOrder} style={{ flex: 1 }}>
            <LinearGradient colors={['#FF6B33', '#B44CFF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.nextBtn}>
              {isPlacingOrder ? <ActivityIndicator color="#fff" /> : (
                <>
                  <Icon name="check" size={18} color="#fff" />
                  <Text style={{ color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 16 }}>Confirm & Pay ₹{total.toLocaleString()}</Text>
                </>
              )}
            </LinearGradient>
          </Pressable>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  progressRow: { flexDirection: 'row', gap: 4, paddingHorizontal: 20, paddingVertical: 12, justifyContent: 'center' },
  progressDot: { width: 32, height: 4, borderRadius: 2 },
  occasions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  occasionChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, borderWidth: 1 },
  input: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderRadius: 12, borderWidth: 1 },
  textarea: { borderRadius: 12, padding: 14, fontSize: 14, fontFamily: 'Inter_400Regular', minHeight: 100, borderWidth: 1 },
  scriptArea: { borderRadius: 12, padding: 14, fontSize: 14, fontFamily: 'Inter_400Regular', minHeight: 160, borderWidth: 1 },
  genBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 12 },
  deliveryCard: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 14, padding: 16 },
  deliveryIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth },
  summaryRow2: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  priceBreakdown: { borderRadius: 14, padding: 16, gap: 4 },
  payCard: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 14, padding: 16 },
  warningBox: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 10, borderWidth: 1 },
  footer: { paddingHorizontal: 20, paddingTop: 16, borderTopWidth: StyleSheet.hairlineWidth },
  nextBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 18, borderRadius: 16 },
  successIcon: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center' },
  orderCard: { borderRadius: 16, padding: 20, alignItems: 'center', gap: 4, width: '100%', marginTop: 20 },
  doneBtn: { paddingVertical: 18, borderRadius: 16, alignItems: 'center' },
});
