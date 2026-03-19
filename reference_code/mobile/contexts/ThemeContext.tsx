import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

import { AppColors, darkColors, gradients, lightColors } from '@/constants/theme';

type ColorScheme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  colors: AppColors;
  gradients: typeof gradients;
  isDark: boolean;
  colorScheme: ColorScheme;
  toggleTheme: () => void;
  setColorScheme: (scheme: ColorScheme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = 'wishme_color_scheme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>('system');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        setColorSchemeState(stored);
      }
    });
  }, []);

  const setColorScheme = useCallback(async (scheme: ColorScheme) => {
    setColorSchemeState(scheme);
    await AsyncStorage.setItem(STORAGE_KEY, scheme);
  }, []);

  const toggleTheme = useCallback(() => {
    const resolved = colorScheme === 'system' ? (systemScheme ?? 'light') : colorScheme;
    const next = resolved === 'dark' ? 'light' : 'dark';
    setColorScheme(next);
  }, [colorScheme, systemScheme, setColorScheme]);

  const resolvedScheme = colorScheme === 'system' ? (systemScheme ?? 'light') : colorScheme;
  const isDark = resolvedScheme === 'dark';
  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ colors, gradients, isDark, colorScheme, toggleTheme, setColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
