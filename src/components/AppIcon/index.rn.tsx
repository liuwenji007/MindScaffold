/**
 * React Native：`lucide-react-native` + `react-native-svg`（与 Lucide 命名一致）。
 */
import React from 'react';
import {
  ArrowRight,
  History,
  Home,
  Sparkles,
  User,
  Wind
} from 'lucide-react-native';
import type { AppIconProps } from './types';

const MAP = {
  home: Home,
  history: History,
  user: User,
  wind: Wind,
  arrowRight: ArrowRight,
  sparkles: Sparkles
} as const;

export function AppIcon({ name, size = 24, color = '#e0e6ed', className }: AppIconProps) {
  const Cmp = MAP[name];
  return <Cmp size={size} color={color} className={className} />;
}

export type { AppIconName, AppIconProps } from './types';
