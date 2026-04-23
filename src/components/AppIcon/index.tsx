/**
 * H5 / 小程序：内联 SVG（`LucideLike`），不依赖 DOM 版 lucide-react。
 * RN 端请使用同目录 `index.rn.tsx`（Taro 按端解析）。
 */
import React from 'react';
import {
  IconArrowRight,
  IconCheck,
  IconChevronLeft,
  IconClock,
  IconHistory,
  IconHome,
  IconLeaf,
  IconSettings,
  IconShop,
  IconSparkles,
  IconSun,
  IconUser,
  IconWind
} from '@/components/icons/LucideLike';
import type { AppIconProps } from './types';

const MAP = {
  home: IconHome,
  history: IconHistory,
  leaf: IconLeaf,
  user: IconUser,
  settings: IconSettings,
  shop: IconShop,
  chevronLeft: IconChevronLeft,
  check: IconCheck,
  wind: IconWind,
  arrowRight: IconArrowRight,
  sparkles: IconSparkles,
  sun: IconSun,
  clock: IconClock
} as const;

export function AppIcon({ name, size, color = 'currentColor', className }: AppIconProps) {
  const Cmp = MAP[name];
  return <Cmp size={size} color={color} className={className} />;
}

export type { AppIconName, AppIconProps } from './types';
