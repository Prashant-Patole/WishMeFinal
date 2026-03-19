export const lightColors = {
  background: '#FFFFFF',
  backgroundSecondary: '#F5F6F8',
  foreground: '#151921',
  card: '#FFFFFF',
  cardSecondary: '#F5F6F8',
  cardForeground: '#151921',
  primary: '#FF6B33',
  primaryDark: '#FF5500',
  primaryForeground: '#FFFFFF',
  secondary: '#B44CFF',
  secondaryDark: '#9B1FFF',
  secondaryForeground: '#FFFFFF',
  accent: '#B44CFF',
  accentForeground: '#FFFFFF',
  muted: '#EDEEF1',
  mutedForeground: '#6B7085',
  destructive: '#EF4444',
  border: '#DCDFE5',
  input: '#E6E8EC',
  ring: '#FF6B33',
  sidebarBackground: '#F5F6F8',
  sidebarForeground: '#151921',
  sidebarPrimary: '#FF6B33',
  sidebarAccent: '#EDEEF1',
  sidebarBorder: '#DCDFE5',
};

export const darkColors = {
  background: '#1E283E',
  backgroundSecondary: '#253049',
  foreground: '#F0F1F4',
  card: '#1A2035',
  cardSecondary: '#20293E',
  cardForeground: '#F0F1F4',
  primary: '#FF7F4D',
  primaryDark: '#FF6119',
  primaryForeground: '#171D2B',
  secondary: '#C266FF',
  secondaryDark: '#A633FF',
  secondaryForeground: '#F0F1F4',
  accent: '#C266FF',
  accentForeground: '#171D2B',
  muted: '#1F2940',
  mutedForeground: '#919199',
  destructive: '#EF4444',
  border: '#252F47',
  input: '#1A2035',
  ring: '#FF7F4D',
  sidebarBackground: '#171E30',
  sidebarForeground: '#DFE1E8',
  sidebarPrimary: '#FF7F4D',
  sidebarAccent: '#1F2940',
  sidebarBorder: '#1F2940',
};

export type AppColors = typeof lightColors;

export const gradients = {
  primaryLight: ['#FF6B33', '#E8527A', '#B44CFF'] as const,
  primaryDark: ['#FF7F4D', '#EC5F83', '#C266FF'] as const,
  heroLight: ['#F5F6F8', '#F8F0FF', '#FFF5F0'] as const,
  heroDark: ['#141A29', '#1F1530', '#161D2B', '#1C1430'] as const,
};

export const radius = {
  base: 12,
  lg: 12,
  md: 10,
  sm: 8,
  xs: 6,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
  colored: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  }),
};
