import React, { useEffect, useMemo, useState } from 'react';
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

/** 取整像素，避免 background-position 亚像素导致像素画抖动 */
function px(n: number): number {
  return Math.round(n);
}

const DISPLAY_WIDTH: Record<LoadingSpriteSize, number> = {
  sm: 88,
  md: 200,
  lg: 260,
};

interface LoadingLayout {
  displayW: number;
  displayH: number;
  sheetW: number;
  sheetH: number;
  positions: ReadonlyArray<{ readonly x: number; readonly y: number }>;
}

function buildLayout(size: LoadingSpriteSize): LoadingLayout {
  const displayW = DISPLAY_WIDTH[size];
  const scale = displayW / LOADING_SPRITE.frameWidth;
  return {
    displayW,
    displayH: px(LOADING_SPRITE.frameHeight * scale),
    sheetW: px(LOADING_SPRITE.sheetWidth * scale),
    sheetH: px(LOADING_SPRITE.sheetHeight * scale),
    positions: LOADING_FRAMES.map(({ x, y }) => ({
      x: -px(x * scale),
      y: -px(y * scale),
    })),
  };
}

export interface LoadingSpriteProps {
  size?: LoadingSpriteSize;
  caption?: string;
  className?: string;
}

export function LoadingSprite({ size = 'md', caption, className = '' }: LoadingSpriteProps) {
  const [frameIndex, setFrameIndex] = useState(0);
  const layout = useMemo(() => buildLayout(size), [size]);
  const { x, y } = layout.positions[frameIndex]!;

  useEffect(() => {
    const timer = setInterval(() => {
      setFrameIndex(i => (i + 1) % LOADING_FRAMES.length);
    }, LOADING_SPRITE.frameDurationMs);
    return () => clearInterval(timer);
  }, []);

  const sheetStyle = useMemo(
    () => ({
      width: `${layout.displayW}px`,
      height: `${layout.displayH}px`,
      backgroundImage: `url(${loadingSprite})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: `${layout.sheetW}px ${layout.sheetH}px`,
      backgroundPosition: `${x}px ${y}px`,
    }),
    [layout, x, y]
  );

  return (
    <View className={`loading-sprite-wrap loading-sprite-wrap--${size} ${className}`.trim()}>
      <View
        className='loading-sprite-viewport'
        style={{ width: `${layout.displayW}px`, height: `${layout.displayH}px` }}
      >
        <View className='loading-sprite' style={sheetStyle} />
      </View>
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
