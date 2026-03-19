import React from 'react';
import Svg, { Circle, Line, Path, Polygon, Polyline, Rect } from 'react-native-svg';
import { StyleProp, ViewStyle } from 'react-native';

export type IconName =
  | 'alert-circle' | 'arrow-down-left' | 'arrow-left' | 'arrow-right'
  | 'arrow-up' | 'arrow-up-right' | 'award' | 'bell' | 'briefcase'
  | 'calendar' | 'camera' | 'check' | 'check-circle' | 'chevron-right'
  | 'chevron-up' | 'chevron-down' | 'circle'
  | 'clock' | 'copy' | 'credit-card' | 'dollar-sign' | 'download'
  | 'edit' | 'edit-2' | 'external-link' | 'eye' | 'eye-off' | 'file-text' | 'gift' | 'globe'
  | 'heart' | 'help-circle' | 'home' | 'image' | 'inbox' | 'info'
  | 'key' | 'link' | 'lock' | 'log-out' | 'mail' | 'mail-check' | 'map-pin' | 'message-circle' | 'mic'
  | 'menu' | 'moon' | 'more-vertical' | 'music' | 'music-2' | 'package' | 'paperclip' | 'phone'
  | 'pause' | 'play' | 'play-circle' | 'plus' | 'refresh-cw' | 'rotate-ccw'
  | 'scissors' | 'search' | 'send' | 'settings' | 'share-2' | 'shield' | 'shield-check'
  | 'shopping-bag' | 'sliders' | 'smartphone' | 'sparkles' | 'star' | 'sun' | 'tag'
  | 'trash-2' | 'trending-up' | 'upload' | 'user' | 'users' | 'video' | 'volume-2'
  | 'volume-x' | 'x' | 'zap';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

type DrawFn = (c: string, w: number) => React.ReactElement;

const a = (c: string, w: number) => ({
  stroke: c,
  strokeWidth: w,
  fill: 'none' as const,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

const ICONS: Record<string, DrawFn> = {
  'alert-circle': (c, w) => (
    <>
      <Circle cx="12" cy="12" r="10" {...a(c,w)} />
      <Line x1="12" y1="8" x2="12" y2="12" {...a(c,w)} />
      <Line x1="12" y1="16" x2="12.01" y2="16" {...a(c,w)} />
    </>
  ),
  'arrow-down-left': (c, w) => (
    <>
      <Line x1="17" y1="7" x2="7" y2="17" {...a(c,w)} />
      <Polyline points="17 17 7 17 7 7" {...a(c,w)} />
    </>
  ),
  'arrow-left': (c, w) => (
    <>
      <Line x1="19" y1="12" x2="5" y2="12" {...a(c,w)} />
      <Polyline points="12 19 5 12 12 5" {...a(c,w)} />
    </>
  ),
  'arrow-right': (c, w) => (
    <>
      <Line x1="5" y1="12" x2="19" y2="12" {...a(c,w)} />
      <Polyline points="12 5 19 12 12 19" {...a(c,w)} />
    </>
  ),
  'arrow-up': (c, w) => (
    <>
      <Line x1="12" y1="19" x2="12" y2="5" {...a(c,w)} />
      <Polyline points="5 12 12 5 19 12" {...a(c,w)} />
    </>
  ),
  'arrow-up-right': (c, w) => (
    <>
      <Line x1="7" y1="17" x2="17" y2="7" {...a(c,w)} />
      <Polyline points="7 7 17 7 17 17" {...a(c,w)} />
    </>
  ),
  'award': (c, w) => (
    <>
      <Circle cx="12" cy="8" r="6" {...a(c,w)} />
      <Polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" {...a(c,w)} />
    </>
  ),
  'bell': (c, w) => (
    <>
      <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" {...a(c,w)} />
      <Line x1="13.73" y1="21" x2="10.27" y2="21" {...a(c,w)} />
    </>
  ),
  'briefcase': (c, w) => (
    <>
      <Rect x="2" y="7" width="20" height="14" rx="2" ry="2" {...a(c,w)} />
      <Path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" {...a(c,w)} />
    </>
  ),
  'calendar': (c, w) => (
    <>
      <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" {...a(c,w)} />
      <Line x1="16" y1="2" x2="16" y2="6" {...a(c,w)} />
      <Line x1="8" y1="2" x2="8" y2="6" {...a(c,w)} />
      <Line x1="3" y1="10" x2="21" y2="10" {...a(c,w)} />
    </>
  ),
  'camera': (c, w) => (
    <>
      <Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" {...a(c,w)} />
      <Circle cx="12" cy="13" r="4" {...a(c,w)} />
    </>
  ),
  'check': (c, w) => (
    <Polyline points="20 6 9 17 4 12" {...a(c,w)} />
  ),
  'check-circle': (c, w) => (
    <>
      <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" {...a(c,w)} />
      <Polyline points="22 4 12 14.01 9 11.01" {...a(c,w)} />
    </>
  ),
  'chevron-right': (c, w) => (
    <Polyline points="9 18 15 12 9 6" {...a(c,w)} />
  ),
  'chevron-up': (c, w) => (
    <Polyline points="18 15 12 9 6 15" {...a(c,w)} />
  ),
  'chevron-down': (c, w) => (
    <Polyline points="6 9 12 15 18 9" {...a(c,w)} />
  ),
  'circle': (c, w) => (
    <Circle cx="12" cy="12" r="10" {...a(c,w)} />
  ),
  'external-link': (c, w) => (
    <>
      <Path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" {...a(c,w)} />
      <Polyline points="15 3 21 3 21 9" {...a(c,w)} />
      <Line x1="10" y1="14" x2="21" y2="3" {...a(c,w)} />
    </>
  ),
  'globe': (c, w) => (
    <>
      <Circle cx="12" cy="12" r="10" {...a(c,w)} />
      <Line x1="2" y1="12" x2="22" y2="12" {...a(c,w)} />
      <Path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" {...a(c,w)} />
    </>
  ),
  'key': (c, w) => (
    <>
      <Path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" {...a(c,w)} />
    </>
  ),
  'link': (c, w) => (
    <>
      <Path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" {...a(c,w)} />
      <Path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" {...a(c,w)} />
    </>
  ),
  'mail-check': (c, w) => (
    <>
      <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" {...a(c,w)} />
      <Polyline points="22,6 12,13 2,6" {...a(c,w)} />
      <Polyline points="8 13 11 16 16 11" {...a(c,w)} />
    </>
  ),
  'music-2': (c, w) => (
    <>
      <Circle cx="8" cy="18" r="4" {...a(c,w)} />
      <Path d="M12 18V2l7 4" {...a(c,w)} />
    </>
  ),
  'shield-check': (c, w) => (
    <>
      <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" {...a(c,w)} />
      <Polyline points="9 12 11 14 15 10" {...a(c,w)} />
    </>
  ),
  'sparkles': (c, w) => (
    <>
      <Path d="M12 2l1.09 3.26L16 6l-3.26 1.09L12 10l-1.09-3.26L8 6l2.91-.74z" {...a(c,w)} />
      <Path d="M5 14l.55 1.64L7 16l-1.64.55L5 18l-.55-1.64L3 16l1.45-.36z" {...a(c,w)} />
      <Path d="M19 14l.55 1.64L21 16l-1.64.55L19 18l-.55-1.64L17 16l1.45-.36z" {...a(c,w)} />
    </>
  ),
  'trending-up': (c, w) => (
    <>
      <Polyline points="23 6 13.5 15.5 8.5 10.5 1 18" {...a(c,w)} />
      <Polyline points="17 6 23 6 23 12" {...a(c,w)} />
    </>
  ),
  'clock': (c, w) => (
    <>
      <Circle cx="12" cy="12" r="10" {...a(c,w)} />
      <Polyline points="12 6 12 12 16 14" {...a(c,w)} />
    </>
  ),
  'copy': (c, w) => (
    <>
      <Rect x="9" y="9" width="13" height="13" rx="2" ry="2" {...a(c,w)} />
      <Path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" {...a(c,w)} />
    </>
  ),
  'credit-card': (c, w) => (
    <>
      <Rect x="1" y="4" width="22" height="16" rx="2" ry="2" {...a(c,w)} />
      <Line x1="1" y1="10" x2="23" y2="10" {...a(c,w)} />
    </>
  ),
  'dollar-sign': (c, w) => (
    <>
      <Line x1="12" y1="1" x2="12" y2="23" {...a(c,w)} />
      <Path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" {...a(c,w)} />
    </>
  ),
  'download': (c, w) => (
    <>
      <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" {...a(c,w)} />
      <Polyline points="7 10 12 15 17 10" {...a(c,w)} />
      <Line x1="12" y1="15" x2="12" y2="3" {...a(c,w)} />
    </>
  ),
  'edit': (c, w) => (
    <>
      <Path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" {...a(c,w)} />
      <Path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" {...a(c,w)} />
    </>
  ),
  'edit-2': (c, w) => (
    <Path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" {...a(c,w)} />
  ),
  'eye': (c, w) => (
    <>
      <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" {...a(c,w)} />
      <Circle cx="12" cy="12" r="3" {...a(c,w)} />
    </>
  ),
  'eye-off': (c, w) => (
    <>
      <Path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" {...a(c,w)} />
      <Line x1="1" y1="1" x2="23" y2="23" {...a(c,w)} />
    </>
  ),
  'file-text': (c, w) => (
    <>
      <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" {...a(c,w)} />
      <Polyline points="14 2 14 8 20 8" {...a(c,w)} />
      <Line x1="16" y1="13" x2="8" y2="13" {...a(c,w)} />
      <Line x1="16" y1="17" x2="8" y2="17" {...a(c,w)} />
      <Polyline points="10 9 9 9 8 9" {...a(c,w)} />
    </>
  ),
  'gift': (c, w) => (
    <>
      <Polyline points="20 12 20 22 4 22 4 12" {...a(c,w)} />
      <Rect x="2" y="7" width="20" height="5" {...a(c,w)} />
      <Line x1="12" y1="22" x2="12" y2="7" {...a(c,w)} />
      <Path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" {...a(c,w)} />
      <Path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" {...a(c,w)} />
    </>
  ),
  'heart': (c, w) => (
    <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" {...a(c,w)} />
  ),
  'help-circle': (c, w) => (
    <>
      <Circle cx="12" cy="12" r="10" {...a(c,w)} />
      <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" {...a(c,w)} />
      <Line x1="12" y1="17" x2="12.01" y2="17" {...a(c,w)} />
    </>
  ),
  'home': (c, w) => (
    <>
      <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...a(c,w)} />
      <Polyline points="9 22 9 12 15 12 15 22" {...a(c,w)} />
    </>
  ),
  'image': (c, w) => (
    <>
      <Rect x="3" y="3" width="18" height="18" rx="2" ry="2" {...a(c,w)} />
      <Circle cx="8.5" cy="8.5" r="1.5" {...a(c,w)} />
      <Polyline points="21 15 16 10 5 21" {...a(c,w)} />
    </>
  ),
  'inbox': (c, w) => (
    <>
      <Polyline points="22 12 16 12 14 15 10 15 8 12 2 12" {...a(c,w)} />
      <Path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" {...a(c,w)} />
    </>
  ),
  'info': (c, w) => (
    <>
      <Circle cx="12" cy="12" r="10" {...a(c,w)} />
      <Line x1="12" y1="16" x2="12" y2="12" {...a(c,w)} />
      <Line x1="12" y1="8" x2="12.01" y2="8" {...a(c,w)} />
    </>
  ),
  'lock': (c, w) => (
    <>
      <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" {...a(c,w)} />
      <Path d="M7 11V7a5 5 0 0 1 10 0v4" {...a(c,w)} />
    </>
  ),
  'log-out': (c, w) => (
    <>
      <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" {...a(c,w)} />
      <Polyline points="16 17 21 12 16 7" {...a(c,w)} />
      <Line x1="21" y1="12" x2="9" y2="12" {...a(c,w)} />
    </>
  ),
  'mail': (c, w) => (
    <>
      <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" {...a(c,w)} />
      <Polyline points="22,6 12,13 2,6" {...a(c,w)} />
    </>
  ),
  'map-pin': (c, w) => (
    <>
      <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" {...a(c,w)} />
      <Circle cx="12" cy="10" r="3" {...a(c,w)} />
    </>
  ),
  'message-circle': (c, w) => (
    <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" {...a(c,w)} />
  ),
  'mic': (c, w) => (
    <>
      <Path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" {...a(c,w)} />
      <Path d="M19 10v2a7 7 0 0 1-14 0v-2" {...a(c,w)} />
      <Line x1="12" y1="19" x2="12" y2="23" {...a(c,w)} />
      <Line x1="8" y1="23" x2="16" y2="23" {...a(c,w)} />
    </>
  ),
  'moon': (c, w) => (
    <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" {...a(c,w)} />
  ),
  'menu': (c, w) => (
    <>
      <Line x1="3" y1="12" x2="21" y2="12" {...a(c,w)} />
      <Line x1="3" y1="6" x2="21" y2="6" {...a(c,w)} />
      <Line x1="3" y1="18" x2="21" y2="18" {...a(c,w)} />
    </>
  ),
  'more-vertical': (c, w) => (
    <>
      <Circle cx="12" cy="5" r="1" stroke={c} strokeWidth={w} fill={c} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="12" cy="12" r="1" stroke={c} strokeWidth={w} fill={c} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="12" cy="19" r="1" stroke={c} strokeWidth={w} fill={c} strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  'music': (c, w) => (
    <>
      <Path d="M9 18V5l12-2v13" {...a(c,w)} />
      <Circle cx="6" cy="18" r="3" {...a(c,w)} />
      <Circle cx="18" cy="16" r="3" {...a(c,w)} />
    </>
  ),
  'package': (c, w) => (
    <>
      <Line x1="16.5" y1="9.4" x2="7.5" y2="4.21" {...a(c,w)} />
      <Path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" {...a(c,w)} />
      <Polyline points="3.27 6.96 12 12.01 20.73 6.96" {...a(c,w)} />
      <Line x1="12" y1="22.08" x2="12" y2="12" {...a(c,w)} />
    </>
  ),
  'paperclip': (c, w) => (
    <Path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" {...a(c,w)} />
  ),
  'phone': (c, w) => (
    <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.28h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" {...a(c,w)} />
  ),
  'pause': (c, w) => (
    <>
      <Rect x="6" y="4" width="4" height="16" {...a(c,w)} />
      <Rect x="14" y="4" width="4" height="16" {...a(c,w)} />
    </>
  ),
  'play': (c, w) => (
    <Polygon points="5 3 19 12 5 21 5 3" {...a(c,w)} />
  ),
  'play-circle': (c, w) => (
    <>
      <Circle cx="12" cy="12" r="10" {...a(c,w)} />
      <Polygon points="10 8 16 12 10 16 10 8" {...a(c,w)} />
    </>
  ),
  'plus': (c, w) => (
    <>
      <Line x1="12" y1="5" x2="12" y2="19" {...a(c,w)} />
      <Line x1="5" y1="12" x2="19" y2="12" {...a(c,w)} />
    </>
  ),
  'refresh-cw': (c, w) => (
    <>
      <Polyline points="23 4 23 10 17 10" {...a(c,w)} />
      <Polyline points="1 20 1 14 7 14" {...a(c,w)} />
      <Path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" {...a(c,w)} />
    </>
  ),
  'rotate-ccw': (c, w) => (
    <>
      <Polyline points="1 4 1 10 7 10" {...a(c,w)} />
      <Path d="M3.51 15a9 9 1 0 1 2.13-9.36L1 10" {...a(c,w)} />
    </>
  ),
  'scissors': (c, w) => (
    <>
      <Circle cx="6" cy="6" r="3" {...a(c,w)} />
      <Circle cx="6" cy="18" r="3" {...a(c,w)} />
      <Line x1="20" y1="4" x2="8.12" y2="15.88" {...a(c,w)} />
      <Line x1="14.47" y1="14.48" x2="20" y2="20" {...a(c,w)} />
    </>
  ),
  'search': (c, w) => (
    <>
      <Circle cx="11" cy="11" r="8" {...a(c,w)} />
      <Line x1="21" y1="21" x2="16.65" y2="16.65" {...a(c,w)} />
    </>
  ),
  'send': (c, w) => (
    <>
      <Line x1="22" y1="2" x2="11" y2="13" {...a(c,w)} />
      <Polygon points="22 2 15 22 11 13 2 9 22 2" {...a(c,w)} />
    </>
  ),
  'settings': (c, w) => (
    <>
      <Circle cx="12" cy="12" r="3" {...a(c,w)} />
      <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" {...a(c,w)} />
    </>
  ),
  'share-2': (c, w) => (
    <>
      <Circle cx="18" cy="5" r="3" {...a(c,w)} />
      <Circle cx="6" cy="12" r="3" {...a(c,w)} />
      <Circle cx="18" cy="19" r="3" {...a(c,w)} />
      <Line x1="8.59" y1="13.51" x2="15.42" y2="17.49" {...a(c,w)} />
      <Line x1="15.41" y1="6.51" x2="8.59" y2="10.49" {...a(c,w)} />
    </>
  ),
  'shield': (c, w) => (
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" {...a(c,w)} />
  ),
  'shopping-bag': (c, w) => (
    <>
      <Path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" {...a(c,w)} />
      <Line x1="3" y1="6" x2="21" y2="6" {...a(c,w)} />
      <Path d="M16 10a4 4 0 0 1-8 0" {...a(c,w)} />
    </>
  ),
  'sliders': (c, w) => (
    <>
      <Line x1="4" y1="21" x2="4" y2="14" {...a(c,w)} />
      <Line x1="4" y1="10" x2="4" y2="3" {...a(c,w)} />
      <Line x1="12" y1="21" x2="12" y2="12" {...a(c,w)} />
      <Line x1="12" y1="8" x2="12" y2="3" {...a(c,w)} />
      <Line x1="20" y1="21" x2="20" y2="16" {...a(c,w)} />
      <Line x1="20" y1="12" x2="20" y2="3" {...a(c,w)} />
      <Line x1="1" y1="14" x2="7" y2="14" {...a(c,w)} />
      <Line x1="9" y1="8" x2="15" y2="8" {...a(c,w)} />
      <Line x1="17" y1="16" x2="23" y2="16" {...a(c,w)} />
    </>
  ),
  'smartphone': (c, w) => (
    <>
      <Rect x="5" y="2" width="14" height="20" rx="2" ry="2" {...a(c,w)} />
      <Line x1="12" y1="18" x2="12.01" y2="18" {...a(c,w)} />
    </>
  ),
  'star': (c, w) => (
    <Polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" {...a(c,w)} />
  ),
  'sun': (c, w) => (
    <>
      <Circle cx="12" cy="12" r="5" {...a(c,w)} />
      <Line x1="12" y1="1" x2="12" y2="3" {...a(c,w)} />
      <Line x1="12" y1="21" x2="12" y2="23" {...a(c,w)} />
      <Line x1="4.22" y1="4.22" x2="5.64" y2="5.64" {...a(c,w)} />
      <Line x1="18.36" y1="18.36" x2="19.78" y2="19.78" {...a(c,w)} />
      <Line x1="1" y1="12" x2="3" y2="12" {...a(c,w)} />
      <Line x1="21" y1="12" x2="23" y2="12" {...a(c,w)} />
      <Line x1="4.22" y1="19.78" x2="5.64" y2="18.36" {...a(c,w)} />
      <Line x1="18.36" y1="5.64" x2="19.78" y2="4.22" {...a(c,w)} />
    </>
  ),
  'tag': (c, w) => (
    <>
      <Path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" {...a(c,w)} />
      <Line x1="7" y1="7" x2="7.01" y2="7" {...a(c,w)} />
    </>
  ),
  'trash-2': (c, w) => (
    <>
      <Polyline points="3 6 5 6 21 6" {...a(c,w)} />
      <Path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" {...a(c,w)} />
      <Line x1="10" y1="11" x2="10" y2="17" {...a(c,w)} />
      <Line x1="14" y1="11" x2="14" y2="17" {...a(c,w)} />
    </>
  ),
  'upload': (c, w) => (
    <>
      <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" {...a(c,w)} />
      <Polyline points="17 8 12 3 7 8" {...a(c,w)} />
      <Line x1="12" y1="3" x2="12" y2="15" {...a(c,w)} />
    </>
  ),
  'user': (c, w) => (
    <>
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...a(c,w)} />
      <Circle cx="12" cy="7" r="4" {...a(c,w)} />
    </>
  ),
  'users': (c, w) => (
    <>
      <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" {...a(c,w)} />
      <Circle cx="9" cy="7" r="4" {...a(c,w)} />
      <Path d="M23 21v-2a4 4 0 0 0-3-3.87" {...a(c,w)} />
      <Path d="M16 3.13a4 4 0 0 1 0 7.75" {...a(c,w)} />
    </>
  ),
  'video': (c, w) => (
    <>
      <Polygon points="23 7 16 12 23 17 23 7" {...a(c,w)} />
      <Rect x="1" y="5" width="15" height="14" rx="2" ry="2" {...a(c,w)} />
    </>
  ),
  'volume-2': (c, w) => (
    <>
      <Polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" {...a(c,w)} />
      <Path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" {...a(c,w)} />
    </>
  ),
  'volume-x': (c, w) => (
    <>
      <Polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" {...a(c,w)} />
      <Line x1="23" y1="9" x2="17" y2="15" {...a(c,w)} />
      <Line x1="17" y1="9" x2="23" y2="15" {...a(c,w)} />
    </>
  ),
  'x': (c, w) => (
    <>
      <Line x1="18" y1="6" x2="6" y2="18" {...a(c,w)} />
      <Line x1="6" y1="6" x2="18" y2="18" {...a(c,w)} />
    </>
  ),
  'zap': (c, w) => (
    <Polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" {...a(c,w)} />
  ),
};

export function Icon({ name, size = 24, color = '#000000', style }: IconProps) {
  const draw = ICONS[name];
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      {draw ? draw(color, 2) : null}
    </Svg>
  );
}
