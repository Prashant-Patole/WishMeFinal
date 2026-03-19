import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

import { fontVariants } from '@/constants/fonts';
import { radius, shadows } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'gradient';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
}

export function Button({ label, onPress, variant = 'primary', size = 'md', isLoading, disabled, style, icon }: ButtonProps) {
  const { colors, gradients, isDark } = useTheme();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const sizeStyles = {
    sm: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: radius.sm },
    md: { paddingHorizontal: 24, paddingVertical: 14, borderRadius: radius.md },
    lg: { paddingHorizontal: 32, paddingVertical: 18, borderRadius: radius.lg },
  }[size];

  const textSize = { sm: 14, md: 16, lg: 18 }[size];

  const getContainerStyle = (pressed: boolean): ViewStyle => {
    const base: ViewStyle = {
      ...sizeStyles,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      opacity: pressed ? 0.85 : disabled ? 0.5 : 1,
      transform: [{ scale: pressed ? 0.97 : 1 }],
    };

    if (variant === 'outline') {
      return { ...base, borderWidth: 1.5, borderColor: colors.primary, backgroundColor: 'transparent' };
    }
    if (variant === 'ghost') {
      return { ...base, backgroundColor: 'transparent' };
    }
    if (variant === 'destructive') {
      return { ...base, backgroundColor: colors.destructive, ...shadows.colored(colors.destructive) };
    }
    if (variant === 'secondary') {
      return { ...base, backgroundColor: colors.secondary, ...shadows.colored(colors.secondary) };
    }
    if (variant === 'gradient' || variant === 'primary') {
      return { ...base };
    }
    return base;
  };

  const getTextColor = () => {
    if (variant === 'outline' || variant === 'ghost') return colors.primary;
    if (variant === 'secondary') return colors.secondaryForeground;
    return '#FFFFFF';
  };

  if (variant === 'gradient' || variant === 'primary') {
    const gradColors = isDark ? gradients.primaryDark : gradients.primaryLight;
    return (
      <Pressable onPress={handlePress} disabled={disabled || isLoading} style={style}>
        {({ pressed }) => (
          <LinearGradient
            colors={gradColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={getContainerStyle(pressed)}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                {icon}
                <Text style={[fontVariants.bodySemibold, { color: '#fff', fontSize: textSize }]}>{label}</Text>
              </>
            )}
          </LinearGradient>
        )}
      </Pressable>
    );
  }

  return (
    <Pressable onPress={handlePress} disabled={disabled || isLoading} style={style}>
      {({ pressed }) => (
        <React.Fragment>
          <Pressable style={getContainerStyle(pressed)}>
            {isLoading ? (
              <ActivityIndicator color={getTextColor()} size="small" />
            ) : (
              <>
                {icon}
                <Text style={[fontVariants.bodySemibold, { color: getTextColor(), fontSize: textSize }]}>{label}</Text>
              </>
            )}
          </Pressable>
        </React.Fragment>
      )}
    </Pressable>
  );
}
