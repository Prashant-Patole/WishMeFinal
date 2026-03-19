import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';

interface GradientTextProps {
  text: string;
  colors: readonly string[];
  style?: TextStyle;
  start?: { x: number; y: number };
  end?: { x: number; y: number };
}

export function GradientText({ text, colors: gradColors, style, start = { x: 0, y: 0 }, end = { x: 1, y: 0 } }: GradientTextProps) {
  return (
    <Text style={[style, { color: gradColors[0] }]}>{text}</Text>
  );
}
