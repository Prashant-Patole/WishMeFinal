import { Icon, IconName } from '@/components/Icon';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/contexts/ThemeContext';
import { fontVariants } from '@/constants/fonts';

function SettingRow({ icon, label, value, onToggle, type = 'toggle', onPress }: { icon: IconName; label: string; value?: boolean | string; onToggle?: (v: boolean) => void; type?: 'toggle' | 'nav'; onPress?: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress} style={[styles.row, { backgroundColor: colors.card }]}>
      <View style={[styles.rowIcon, { backgroundColor: colors.primary + '15' }]}>
        <Icon name={icon} size={18} color={colors.primary} />
      </View>
      <Text style={[fontVariants.bodyMedium, { color: colors.foreground, flex: 1 }]}>{label}</Text>
      {type === 'toggle' && typeof value === 'boolean' && (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: colors.muted, true: colors.primary }}
          thumbColor="#fff"
        />
      )}
      {type === 'nav' && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          {typeof value === 'string' && <Text style={[fontVariants.caption, { color: colors.mutedForeground }]}>{value}</Text>}
          <Icon name="chevron-right" size={16} color={colors.mutedForeground} />
        </View>
      )}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const [notifications, setNotifications] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [promoNotifs, setPromoNotifs] = useState(false);
  const [biometrics, setBiometrics] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()}>
          <Icon name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[fontVariants.h4, { color: colors.foreground, flex: 1, marginLeft: 12 }]}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, gap: 24, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        {/* Appearance */}
        <View>
          <Text style={[fontVariants.label, { color: colors.mutedForeground, marginBottom: 12 }]}>Appearance</Text>
          <View style={[styles.group, { backgroundColor: colors.card }]}>
            <SettingRow icon="moon" label="Dark Mode" value={isDark} onToggle={toggleTheme} />
          </View>
        </View>

        {/* Notifications */}
        <View>
          <Text style={[fontVariants.label, { color: colors.mutedForeground, marginBottom: 12 }]}>Notifications</Text>
          <View style={[styles.group, { backgroundColor: colors.card }]}>
            <SettingRow icon="bell" label="Push Notifications" value={notifications} onToggle={setNotifications} />
            <SettingRow icon="mail" label="Email Notifications" value={emailNotifs} onToggle={setEmailNotifs} />
            <SettingRow icon="tag" label="Promotional Offers" value={promoNotifs} onToggle={setPromoNotifs} />
          </View>
        </View>

        {/* Security */}
        <View>
          <Text style={[fontVariants.label, { color: colors.mutedForeground, marginBottom: 12 }]}>Security</Text>
          <View style={[styles.group, { backgroundColor: colors.card }]}>
            <SettingRow icon="lock" label="Change Password" type="nav" onPress={() => {}} />
            <SettingRow icon="shield" label="Biometric Login" value={biometrics} onToggle={setBiometrics} />
          </View>
        </View>

        {/* About */}
        <View>
          <Text style={[fontVariants.label, { color: colors.mutedForeground, marginBottom: 12 }]}>About</Text>
          <View style={[styles.group, { backgroundColor: colors.card }]}>
            <SettingRow icon="info" label="App Version" value="1.0.0" type="nav" />
            <SettingRow icon="file-text" label="Terms of Service" type="nav" onPress={() => {}} />
            <SettingRow icon="shield" label="Privacy Policy" type="nav" onPress={() => {}} />
            <SettingRow icon="help-circle" label="Help & Support" type="nav" onPress={() => router.push('/chat/2')} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  group: { borderRadius: 16, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(0,0,0,0.05)' },
  rowIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
});
