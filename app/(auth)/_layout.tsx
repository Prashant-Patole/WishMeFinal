import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="verify-otp" />
      <Stack.Screen name="celebrity-signup" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="select-plan" />
      <Stack.Screen name="complete-profile" />
    </Stack>
  );
}
