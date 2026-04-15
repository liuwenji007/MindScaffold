/**
 * RN：使用 `Animated` 做透明度入场（不依赖 framer-motion / DOM）。
 */
import React, { useEffect, useRef, type PropsWithChildren } from 'react';
import { Animated } from 'react-native';
import { View } from '@tarojs/components';
import type { FadeInProps } from './types';

const AnimatedView = Animated.createAnimatedComponent(View);

export function FadeIn({ children, className = '', variant = 'fadeIn' }: FadeInProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const delay = variant === 'fadeInDelay' ? 80 : 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      }).start();
    }, delay);
    return () => clearTimeout(timer);
  }, [delay, opacity]);

  return (
    <AnimatedView style={{ opacity }} className={className}>
      {children}
    </AnimatedView>
  );
}
