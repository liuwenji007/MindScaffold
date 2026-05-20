import React, { useEffect, useMemo, useState } from 'react';
import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { resolveHomeBgSprite } from './homeBgAsset';
import './index.scss';

/** homeBg：1280×365，单排 8 帧（每帧 160×365，壁炉/星空等） */
export const HOME_BG_SPRITE = {
  sheetWidth: 1280,
  sheetHeight: 365,
  frameWidth: 160,
  frameHeight: 365,
  frameCount: 8,
  /** 火焰/星星微动，略慢更自然 */
  frameDurationMs: 420,
} as const;

const HOME_BG_FRAMES: ReadonlyArray<{ readonly x: number; readonly y: number }> = Array.from(
  { length: HOME_BG_SPRITE.frameCount },
  (_, i) => ({
    x: i * HOME_BG_SPRITE.frameWidth,
    y: 0,
  })
);

/** 竖向裁切时保留画面中心（0=顶对齐，1=底对齐） */
const CROP_ANCHOR_Y = 0.42;

function tabBarPhysicalPx(windowWidth: number): number {
  return (168 / 750) * windowWidth;
}

interface HomeBgLayout {
  scale: number;
  cropTop: number;
}

function measureLayout(): HomeBgLayout {
  const info = Taro.getSystemInfoSync();
  const viewportW = info.windowWidth || 375;
  const tabBarH = tabBarPhysicalPx(viewportW);
  const viewportH = Math.max(320, (info.windowHeight || 700) - tabBarH);
  const scale = viewportW / HOME_BG_SPRITE.frameWidth;
  const frameH = HOME_BG_SPRITE.frameHeight * scale;
  const cropTop = Math.max(0, (frameH - viewportH) * CROP_ANCHOR_Y);

  return { scale, cropTop };
}

export interface HomeBgSpriteProps {
  className?: string;
}

export default function HomeBgSprite({ className = '' }: HomeBgSpriteProps) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [layout, setLayout] = useState<HomeBgLayout>(measureLayout);
  const spriteUrl = useMemo(() => resolveHomeBgSprite(), []);
  const { x } = HOME_BG_FRAMES[frameIndex]!;

  useEffect(() => {
    const apply = () => setLayout(measureLayout());
    apply();
    if (process.env.TARO_ENV === 'h5' && typeof window !== 'undefined') {
      window.addEventListener('resize', apply);
      return () => window.removeEventListener('resize', apply);
    }
    return undefined;
  }, []);

  const sheetStyle = useMemo(() => {
    const { scale, cropTop } = layout;
    return {
      width: `${HOME_BG_SPRITE.frameWidth * scale}px`,
      height: `${HOME_BG_SPRITE.frameHeight * scale}px`,
      marginTop: `-${cropTop}px`,
      backgroundImage: `url(${spriteUrl})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: `${HOME_BG_SPRITE.sheetWidth * scale}px ${HOME_BG_SPRITE.sheetHeight * scale}px`,
      backgroundPosition: `-${x * scale}px 0px`,
    };
  }, [layout, x, spriteUrl]);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrameIndex(i => (i + 1) % HOME_BG_FRAMES.length);
    }, HOME_BG_SPRITE.frameDurationMs);
    return () => clearInterval(timer);
  }, []);

  return (
    <View className={`home-bg-sprite ${className}`.trim()} aria-hidden>
      <View className='home-bg-sprite__clip'>
        <View className='home-bg-sprite__sheet' style={sheetStyle} />
      </View>
      <View className='home-bg-sprite__feather' />
    </View>
  );
}
