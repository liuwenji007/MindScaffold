import React, { useEffect, useMemo, useState } from 'react';
import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { resolveHomeBgSprite } from './homeBgAsset';
import './index.scss';

/** homeBg：2560×711，单排 8 帧（每帧 320×711） */
export const HOME_BG_SPRITE = {
  sheetWidth: 2560,
  sheetHeight: 711,
  frameWidth: 320,
  frameHeight: 711,
  frameCount: 8,
  frameDurationMs: 420,
  /** 略放大，裁掉 AI 帧内圆角/黑边 */
  coverOverscan: 1.08,
} as const;

const CROP_ANCHOR_Y = 0.38;

function tabBarPhysicalPx(windowWidth: number): number {
  return (168 / 750) * windowWidth;
}

/** 像素对齐，避免 sub-pixel 导致像素画抖动 */
function px(n: number): number {
  return Math.round(n);
}

interface HomeBgLayout {
  frameW: number;
  frameH: number;
  sheetW: number;
  sheetH: number;
  frameStep: number;
  marginLeft: number;
  cropTop: number;
}

function measureLayout(): HomeBgLayout {
  const info = Taro.getSystemInfoSync();
  const viewportW = info.windowWidth || 375;
  const tabBarH = tabBarPhysicalPx(viewportW);
  const viewportH = Math.max(320, (info.windowHeight || 700) - tabBarH);

  const scaleW = viewportW / HOME_BG_SPRITE.frameWidth;
  const scaleH = viewportH / HOME_BG_SPRITE.frameHeight;
  const scale = Math.max(scaleW, scaleH) * HOME_BG_SPRITE.coverOverscan;

  const frameW = px(HOME_BG_SPRITE.frameWidth * scale);
  const frameH = px(HOME_BG_SPRITE.frameHeight * scale);
  const sheetW = px(HOME_BG_SPRITE.sheetWidth * scale);
  const sheetH = px(HOME_BG_SPRITE.sheetHeight * scale);
  const frameStep = px(HOME_BG_SPRITE.frameWidth * scale);
  const marginLeft = -px((frameW - viewportW) / 2);
  const cropTop = px(Math.max(0, (frameH - viewportH) * CROP_ANCHOR_Y));

  return { frameW, frameH, sheetW, sheetH, frameStep, marginLeft, cropTop };
}

export interface HomeBgSpriteProps {
  className?: string;
}

export default function HomeBgSprite({ className = '' }: HomeBgSpriteProps) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [layout, setLayout] = useState<HomeBgLayout>(measureLayout);
  const spriteUrl = useMemo(() => resolveHomeBgSprite(), []);

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
    const { frameW, frameH, sheetW, sheetH, frameStep, marginLeft, cropTop } = layout;
    const bgX = frameIndex * frameStep;

    return {
      width: `${frameW}px`,
      height: `${frameH}px`,
      marginLeft: `${marginLeft}px`,
      marginTop: `-${cropTop}px`,
      backgroundImage: `url(${spriteUrl})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: `${sheetW}px ${sheetH}px`,
      backgroundPosition: `-${bgX}px 0px`,
    };
  }, [layout, frameIndex, spriteUrl]);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrameIndex(i => (i + 1) % HOME_BG_SPRITE.frameCount);
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
