import React, { useEffect, useState } from 'react';
import { View, Text } from '@tarojs/components';
import loadingSprite from '@/assets/sprite/loading.png';
import './index.scss';

export const LOADING_SPRITE = {
  sheetWidth: 2752,
  sheetHeight: 1536,
  frameWidth: 688,
  frameHeight: 768,
  frameCount: 7,
  frameDurationMs: 150,
} as const;

/**
 * 每帧在雪碧图上的左上角坐标（px）。
 * 上排 4 帧对齐网格；下排 3 帧相对上排水平错开半帧（落在上一行帧间隙下方）。
 */
export const LOADING_FRAMES: ReadonlyArray<{ readonly x: number; readonly y: number }> = [
  { x: 0, y: 0 },
  { x: 688, y: 0 },
  { x: 1376, y: 0 },
  { x: 2064, y: 0 },
  { x: 344, y: 768 },
  { x: 1032, y: 768 },
  { x: 1720, y: 768 },
];

export type LoadingSpriteSize = 'sm' | 'md' | 'lg';

const DISPLAY_WIDTH: Record<LoadingSpriteSize, number> = {
  sm: 88,
  md: 200,
  lg: 260,
};

export interface LoadingSpriteProps {
  size?: LoadingSpriteSize;
  caption?: string;
  className?: string;
}

export function LoadingSprite({ size = 'md', caption, className = '' }: LoadingSpriteProps) {
  const [frameIndex, setFrameIndex] = useState(0);

  const displayW = DISPLAY_WIDTH[size];
  const scale = displayW / LOADING_SPRITE.frameWidth;
  const displayH = LOADING_SPRITE.frameHeight * scale;
  const { x, y } = LOADING_FRAMES[frameIndex]!;

  useEffect(() => {
    const timer = setInterval(() => {
      setFrameIndex(i => (i + 1) % LOADING_FRAMES.length);
    }, LOADING_SPRITE.frameDurationMs);
    return () => clearInterval(timer);
  }, []);

  return (
    <View className={`loading-sprite-wrap ${className}`.trim()}>
      <View
        className='loading-sprite'
        style={{
          width: `${displayW}px`,
          height: `${displayH}px`,
          backgroundImage: `url(${loadingSprite})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: `${LOADING_SPRITE.sheetWidth * scale}px ${LOADING_SPRITE.sheetHeight * scale}px`,
          backgroundPosition: `-${x * scale}px -${y * scale}px`,
        }}
      />
      {caption ? <Text className='loading-sprite-caption'>{caption}</Text> : null}
    </View>
  );
}

export interface LoadingScreenProps {
  caption?: string;
  className?: string;
}

export function LoadingScreen({ caption, className = '' }: LoadingScreenProps) {
  return (
    <View className={`loading-screen ${className}`.trim()}>
      <LoadingSprite size='lg' caption={caption} />
    </View>
  );
}
