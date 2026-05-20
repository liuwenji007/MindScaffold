import React, { useEffect, useMemo, useState } from 'react';
import { View } from '@tarojs/components';
import ipHeadSprite from '@/assets/sprite/ip-head.png';
import './index.scss';

/** ip-head.png：2048×261，单排 8 帧（每帧 256×261） */
export const IP_HEAD_SPRITE = {
  sheetWidth: 2048,
  sheetHeight: 261,
  frameWidth: 256,
  frameHeight: 261,
  frameCount: 8,
  frameDurationMs: 140,
} as const;

function px(n: number): number {
  return Math.round(n);
}

interface IpHeadLayout {
  displayW: number;
  displayH: number;
  sheetW: number;
  sheetH: number;
  frameStep: number;
}

function buildLayout(displayW: number): IpHeadLayout {
  const scale = displayW / IP_HEAD_SPRITE.frameWidth;
  return {
    displayW,
    displayH: px(IP_HEAD_SPRITE.frameHeight * scale),
    sheetW: px(IP_HEAD_SPRITE.sheetWidth * scale),
    sheetH: px(IP_HEAD_SPRITE.sheetHeight * scale),
    frameStep: px(IP_HEAD_SPRITE.frameWidth * scale),
  };
}

export interface IpHeadSpriteProps {
  /** 为 true 时循环说话帧；为 false 时停在首帧 */
  speaking?: boolean;
  /** 单帧展示宽度（物理 px，头像区域约 64–72） */
  size?: number;
  className?: string;
}

export default function IpHeadSprite({
  speaking = false,
  size = 72,
  className = '',
}: IpHeadSpriteProps) {
  const [frameIndex, setFrameIndex] = useState(0);
  const layout = useMemo(() => buildLayout(size), [size]);

  useEffect(() => {
    if (!speaking) {
      setFrameIndex(0);
      return undefined;
    }
    const timer = setInterval(() => {
      setFrameIndex(i => (i + 1) % IP_HEAD_SPRITE.frameCount);
    }, IP_HEAD_SPRITE.frameDurationMs);
    return () => clearInterval(timer);
  }, [speaking]);

  const sheetStyle = useMemo(() => {
    const bgX = frameIndex * layout.frameStep;
    return {
      width: `${layout.displayW}px`,
      height: `${layout.displayH}px`,
      backgroundImage: `url(${ipHeadSprite})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: `${layout.sheetW}px ${layout.sheetH}px`,
      backgroundPosition: `-${bgX}px 0px`,
    };
  }, [layout, frameIndex]);

  return (
    <View
      className={`ip-head-sprite ${speaking ? 'ip-head-sprite--speaking' : ''} ${className}`.trim()}
      style={{ width: `${size}px`, height: `${size}px` }}
      aria-hidden
    >
      <View className='ip-head-sprite__viewport'>
        <View className='ip-head-sprite__sheet' style={sheetStyle} />
      </View>
    </View>
  );
}
