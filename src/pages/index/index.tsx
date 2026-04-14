import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { v4 as uuidv4 } from 'uuid';
import { useEmotionStore } from '@/store/emotionStore';
import type { EmotionEntry } from '@/types/emotion';
import TabBar from '@/components/TabBar';
import EmotionSwiper from '@/components/EmotionSwiper';
import './index.scss';

export default function Index() {
  const setEntry = useEmotionStore(s => s.setEntry);

  const handleEmotionSelect = (emotion: string, note?: string) => {
    const entry: EmotionEntry = {
      id: uuidv4(),
      emotion,
      userNote: note,
      timestamp: Date.now()
    };

    setEntry(entry);
    Taro.navigateTo({ url: '/pages/breakdown/index' });
  };

  return (
    <View className='index-page'>
      {/* 头部区域 */}
      <View className='header'>
        <Text className='title'>阿窝睡了</Text>
        <Text className='subtitle'>把乱糟糟的今天，先轻轻放下来</Text>
      </View>

      {/* 情绪滑动选择器 */}
      <EmotionSwiper onSelect={handleEmotionSelect} />

      {/* 底部声明 */}
      <View className='footer'>
        <Text className='disclaimer'>
          本产品不替代专业心理咨询或治疗
        </Text>
      </View>

      {/* 底部导航 */}
      <TabBar current='index' />
    </View>
  );
}