import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/inter';
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_500Medium,
  PlayfairDisplay_600SemiBold,
  PlayfairDisplay_700Bold,
  PlayfairDisplay_800ExtraBold,
} from '@expo-google-fonts/playfair-display';
import {
  DancingScript_400Regular,
  DancingScript_500Medium,
  DancingScript_600SemiBold,
  DancingScript_700Bold,
} from '@expo-google-fonts/dancing-script';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import OnboardingSplash from '@/components/OnboardingSplash';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import DrawerMenu from '@/components/DrawerMenu';
import { AuthProvider } from '@/contexts/AuthContext';
import { DrawerProvider } from '@/contexts/DrawerContext';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootSafeArea({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: colors.background }}>
      {children}
    </SafeAreaView>
  );
}

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false, presentation: 'card' }} />
      <Stack.Screen name="celebrity/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="booking/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="wallet" options={{ headerShown: false }} />
      <Stack.Screen name="messages" options={{ headerShown: false }} />
      <Stack.Screen name="chat/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="bookings" options={{ headerShown: false }} />
      <Stack.Screen name="referrals" options={{ headerShown: false }} />
      <Stack.Screen name="loved-ones" options={{ headerShown: false }} />
      <Stack.Screen name="photo-wish" options={{ headerShown: false }} />
      <Stack.Screen name="greeting-cards" options={{ headerShown: false }} />
      <Stack.Screen name="wish-celebrity" options={{ headerShown: false }} />
      <Stack.Screen name="wish-orders" options={{ headerShown: false }} />
      <Stack.Screen name="occasions" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ headerShown: false }} />
      <Stack.Screen name="favorites" options={{ headerShown: false }} />
      <Stack.Screen name="for-business" options={{ headerShown: false }} />
      <Stack.Screen name="image-promotions" options={{ headerShown: false }} />
      <Stack.Screen name="commission" options={{ headerShown: false }} />
      <Stack.Screen name="occasion-alerts" options={{ headerShown: false }} />
      <Stack.Screen name="celebrity-dashboard" options={{ headerShown: false }} />
    </Stack>
  );
}

function AppShell() {
  const [showOnboarding, setShowOnboarding] = useState(true);

  const handleSplashComplete = useCallback(() => {
    setShowOnboarding(false);
    router.replace('/(auth)');
  }, []);

  return (
    <DrawerProvider>
      <DrawerMenu>
        <RootSafeArea>
          <RootLayoutNav />
          {showOnboarding && (
            <View style={StyleSheet.absoluteFillObject}>
              <OnboardingSplash onComplete={handleSplashComplete} />
            </View>
          )}
        </RootSafeArea>
      </DrawerMenu>
    </DrawerProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    PlayfairDisplay_400Regular,
    PlayfairDisplay_500Medium,
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
    PlayfairDisplay_800ExtraBold,
    DancingScript_400Regular,
    DancingScript_500Medium,
    DancingScript_600SemiBold,
    DancingScript_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <ThemeProvider>
          <AuthProvider>
            <QueryClientProvider client={queryClient}>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <AppShell />
              </GestureHandlerRootView>
            </QueryClientProvider>
          </AuthProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
