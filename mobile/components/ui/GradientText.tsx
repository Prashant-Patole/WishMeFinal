import React from 'react';
import { Text, TextStyle } from 'react-native';

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
