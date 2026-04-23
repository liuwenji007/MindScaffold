/**
 * React Native：`lucide-react-native` + `react-native-svg`（与 Lucide 命名一致）。
 */
import React from 'react';
import {
  ArrowRight,
  Check,
  ChevronLeft,
  Leaf,
  History,
  Home,
  Settings,
  ShoppingBag,
  Sparkles,
  User,
  Wind
} from 'lucide-react-native';
import type { AppIconProps } from './types';

const MAP = {
  home: Home,
  history: History,
  leaf: Leaf,
  user: User,
  settings: Settings,
  shop: ShoppingBag,
  chevronLeft: ChevronLeft,
  check: Check,
  wind: Wind,
  arrowRight: ArrowRight,
  sparkles: Sparkles
} as const;

export function AppIcon({ name, size = 24, color = '#e0e6ed', className }: AppIconProps) {
  const Cmp = MAP[name];
  void className;
  return <Cmp size={size} color={color} />;
}

export type { AppIconName, AppIconProps } from './types';
