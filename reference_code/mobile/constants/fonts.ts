export const fontFamilies = {
  primary: 'Inter',
  display: 'PlayfairDisplay',
  script: 'DancingScript',
} as const;

export const fontWeights = {
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  xl2: 24,
  xl3: 30,
  xl4: 36,
  xl5: 48,
};

export const lineHeight = {
  tight: 1.2,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
};

export const fontVariants = {
  h1: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: fontSize.xl4,
    lineHeight: fontSize.xl4 * 1.2,
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: fontSize.xl3,
    lineHeight: fontSize.xl3 * 1.25,
    letterSpacing: -0.3,
  },
  h3: {
    fontFamily: 'Inter_700Bold',
    fontSize: fontSize.xl2,
    lineHeight: fontSize.xl2 * 1.3,
  },
  h4: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: fontSize.xl,
    lineHeight: fontSize.xl * 1.35,
  },
  body: {
    fontFamily: 'Inter_400Regular',
    fontSize: fontSize.base,
    lineHeight: fontSize.base * 1.5,
  },
  bodyMedium: {
    fontFamily: 'Inter_500Medium',
    fontSize: fontSize.base,
    lineHeight: fontSize.base * 1.5,
  },
  bodySemibold: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: fontSize.base,
    lineHeight: fontSize.base * 1.5,
  },
  caption: {
    fontFamily: 'Inter_400Regular',
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * 1.5,
  },
  captionMedium: {
    fontFamily: 'Inter_500Medium',
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * 1.5,
  },
  label: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: fontSize.xs,
    lineHeight: fontSize.xs * 1.5,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },
  script: {
    fontFamily: 'DancingScript_600SemiBold',
    fontSize: fontSize.xl2,
    lineHeight: fontSize.xl2 * 1.4,
  },
  price: {
    fontFamily: 'Inter_700Bold',
    fontSize: fontSize.xl,
    lineHeight: fontSize.xl * 1.2,
  },
};
