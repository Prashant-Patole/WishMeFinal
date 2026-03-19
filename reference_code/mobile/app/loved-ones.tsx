import { Icon } from '@/components/Icon';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/contexts/ThemeContext';
import { fontVariants } from '@/constants/fonts';
import { shadows } from '@/constants/theme';

const INITIAL_LOVED_ONES = [
  { id: '1', name: 'Priya (Sister)', relation: 'Sister', dob: '25 March', mobile: '+91 98765 43210' },
  { id: '2', name: 'Dad', relation: 'Father', dob: '10 October', mobile: '+91 87654 32109' },
];

const RELATIONS = ['Mother', 'Father', 'Sister', 'Brother', 'Wife', 'Husband', 'Friend', 'Boss', 'Colleague', 'Other'];

function PersonCard({ person, onDelete }: { person: typeof INITIAL_LOVED_ONES[0]; onDelete: () => void }) {
  const { colors } = useTheme();
  const avatarColors: Record<string, string[]> = {
    Sister: ['#FF6B33', '#E8527A'],
    Father: ['#3B82F6', '#1D4ED8'],
    Mother: ['#EC4899', '#BE185D'],
    Friend: ['#22C55E', '#15803D'],
    default: ['#B44CFF', '#7B2FFF'],
  };
  const gradCols = avatarColors[person.relation] ?? avatarColors.default;

  return (
    <View style={[styles.personCard, { backgroundColor: colors.card, ...shadows.sm }]}>
      <LinearGradient colors={gradCols} style={styles.personAvatar}>
        <Text style={{ fontFamily: 'PlayfairDisplay_700Bold', fontSize: 22, color: '#fff' }}>
          {person.name.charAt(0)}
        </Text>
      </LinearGradient>
      <View style={{ flex: 1 }}>
        <Text style={[fontVariants.bodySemibold, { color: colors.foreground }]}>{person.name}</Text>
        <Text style={[fontVariants.caption, { color: colors.mutedForeground }]}>{person.relation}</Text>
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 4 }}>
          {person.dob && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Icon name="gift" size={11} color={colors.mutedForeground} />
              <Text style={[fontVariants.caption, { color: colors.mutedForeground }]}>{person.dob}</Text>
            </View>
          )}
        </View>
      </View>
      <View style={{ gap: 8 }}>
        <Pressable onPress={() => router.push('/celebrities')} style={[styles.wishBtn, { backgroundColor: colors.primary }]}>
          <Icon name="gift" size={14} color="#fff" />
          <Text style={{ color: '#fff', fontSize: 11, fontFamily: 'Inter_600SemiBold' }}>Wish</Text>
        </Pressable>
        <Pressable onPress={onDelete}>
          <Icon name="trash-2" size={16} color={colors.destructive} />
        </Pressable>
      </View>
    </View>
  );
}

export default function LovedOnesScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const [people, setPeople] = useState(INITIAL_LOVED_ONES);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('Friend');
  const [dob, setDob] = useState('');

  const handleAdd = () => {
    if (!name.trim()) return;
    setPeople([...people, { id: Date.now().toString(), name, relation, dob, mobile: '' }]);
    setName(''); setDob(''); setShowAdd(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()}>
          <Icon name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[fontVariants.h4, { color: colors.foreground, flex: 1, marginLeft: 12 }]}>Loved Ones</Text>
        <Pressable onPress={() => setShowAdd(!showAdd)} style={[styles.addBtn, { backgroundColor: colors.primary }]}>
          <Icon name="plus" size={18} color="#fff" />
        </Pressable>
      </View>

      <FlatList
        data={people}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={showAdd ? (
          <View style={[styles.addForm, { backgroundColor: colors.card, ...shadows.md }]}>
            <Text style={[fontVariants.h4, { color: colors.foreground, marginBottom: 16 }]}>Add Person</Text>
            <View style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border }]}>
              <TextInput value={name} onChangeText={setName} placeholder="Name" placeholderTextColor={colors.mutedForeground} style={[fontVariants.body, { color: colors.foreground, flex: 1 }]} />
            </View>
            <View style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border }]}>
              <TextInput value={dob} onChangeText={setDob} placeholder="Birthday (e.g. 25 March)" placeholderTextColor={colors.mutedForeground} style={[fontVariants.body, { color: colors.foreground, flex: 1 }]} />
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
              {RELATIONS.slice(0, 6).map((r) => (
                <Pressable key={r} onPress={() => setRelation(r)} style={[styles.chip, { backgroundColor: relation === r ? colors.primary : colors.backgroundSecondary, borderColor: relation === r ? colors.primary : colors.border }]}>
                  <Text style={[fontVariants.captionMedium, { color: relation === r ? '#fff' : colors.mutedForeground }]}>{r}</Text>
                </Pressable>
              ))}
            </View>
            <Pressable onPress={handleAdd}>
              <LinearGradient colors={['#FF6B33', '#B44CFF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.saveBtn}>
                <Text style={{ color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 15 }}>Save Person</Text>
              </LinearGradient>
            </Pressable>
          </View>
        ) : null}
        renderItem={({ item }) => (
          <PersonCard person={item} onDelete={() => setPeople(people.filter((p) => p.id !== item.id))} />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Icon name="users" size={48} color={colors.mutedForeground} />
            <Text style={[fontVariants.h4, { color: colors.foreground, marginTop: 16 }]}>No loved ones added</Text>
            <Text style={[fontVariants.body, { color: colors.mutedForeground, textAlign: 'center', marginTop: 8 }]}>
              Add your family and friends to quickly book wishes for them
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  addBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  personCard: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 16, padding: 16 },
  personAvatar: { width: 54, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center' },
  wishBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  addForm: { borderRadius: 20, padding: 20, marginBottom: 16, gap: 12 },
  input: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12, borderWidth: 1 },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, borderWidth: 1 },
  saveBtn: { paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginTop: 4 },
  empty: { alignItems: 'center', paddingTop: 80 },
});
