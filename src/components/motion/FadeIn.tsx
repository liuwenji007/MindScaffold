/**
 * H5 / 小程序：CSS 动效（`app.scss` 中 `aw-animate-in` / `aw-animate-in-delay`）。
 */
import React from 'react';
import { View } from '@tarojs/components';
import type { FadeInProps } from './types';

export function FadeIn({ children, className = '', variant = 'fadeIn' }: FadeInProps) {
  const anim = variant === 'fadeInDelay' ? 'aw-animate-in-delay' : 'aw-animate-in';
  const merged = [anim, className].filter(Boolean).join(' ');
  return <View className={merged}>{children}</View>;
}
