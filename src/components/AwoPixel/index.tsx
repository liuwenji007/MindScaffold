import React from 'react';
import { View, Text } from '@tarojs/components';
import './index.scss';

interface AwoPixelProps {
  onEnterPress?: () => void;
}

export default function AwoPixel({ onEnterPress }: AwoPixelProps) {
  return (
    <View className='awo-pixel-scene'>
      {/* night sky through window */}
      <View className='scene-sky'>
        <View className='scene-sky-divider' />
        <View className='scene-star scene-star--1' />
        <View className='scene-star scene-star--2' />
        <View className='scene-star scene-star--3' />
        <View className='scene-star scene-star--4' />
        <View className='scene-star scene-star--5' />
      </View>

      {/* fireplace with flames */}
      <View className='scene-fireplace'>
        <View className='fp-mantel' />
        <View className='fp-body'>
          <View className='fp-firebox'>
            <View className='flame-pixel' />
            <View className='flame-pixel-2' />
          </View>
        </View>
        <View className='fp-hearth' />
      </View>

      {/* Awo sitting on sofa, facing right toward fireplace */}
      <View className='scene-awo-wrap'>
        <View className='awo-body' />
        <View className='awo-glow' />
      </View>

      {/* sofa */}
      <View className='scene-sofa'>
        <View className='sofa-arm-r' />
      </View>

      {/* enter button */}
      {onEnterPress && (
        <View className='scene-enter-btn' onClick={onEnterPress}>
          <Text className='btn-text'>坐下聊聊</Text>
        </View>
      )}
    </View>
  );
}
