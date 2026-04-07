import React, { useState } from 'react';
import { Swiper, SwiperItem, View, Text, Input } from '@tarojs/components';
import { EMOTION_BLOCKS } from '@/config/emotions';
import type { EmotionBlock } from '@/types/emotion';
import './index.scss';

interface EmotionSwiperProps {
  onSelect: (emotion: string, note?: string) => void;
}

export default function EmotionSwiper({ onSelect }: EmotionSwiperProps) {
  const [current, setCurrent] = useState(0);
  const [userNote, setUserNote] = useState('');
  const currentEmotion = EMOTION_BLOCKS[current];

  const handleSwiperChange = (e) => {
    setCurrent(e.detail.current);
  };

  const handleConfirm = () => {
    onSelect(currentEmotion.type, userNote.trim() || undefined);
  };

  return (
    <View className='emotion-swiper-container'>
      {/* 引导语 */}
      <View className='guide-section'>
        <Text className='guide-text'>此刻，心里有什么在轻轻叹气？</Text>
        <Text className='guide-hint'>← 左右滑动选择情绪 →</Text>
      </View>

      {/* 滑动卡片 */}
      <Swiper
        className='emotion-swiper'
        indicatorDots
        indicatorColor='rgba(0, 0, 0, 0.2)'
        indicatorActiveColor='#81b29a'
        circular
        onChange={handleSwiperChange}
      >
        {EMOTION_BLOCKS.map((emotion: EmotionBlock) => (
          <SwiperItem key={emotion.type}>
            <View
              className='emotion-card'
              style={{ backgroundColor: emotion.color }}
            >
              <Text className='emotion-name'>{emotion.type}</Text>
              <Text className='emotion-desc'>{emotion.description}</Text>

              {/* 装饰元素 */}
              <View className='emotion-decoration'>
                <View className='decoration-circle circle-1' />
                <View className='decoration-circle circle-2' />
                <View className='decoration-circle circle-3' />
              </View>
            </View>
          </SwiperItem>
        ))}
      </Swiper>

      {/* 当前情绪信息 */}
      <View className='current-info'>
        <Text className='emotion-label'>当前选择</Text>
        <Text className='emotion-current'>{currentEmotion.type}</Text>
      </View>

      {/* 自由输入 */}
      <View className='note-section'>
        <Input
          className='note-input'
          placeholder='想说点什么？（选填）'
          value={userNote}
          onInput={e => setUserNote(e.detail.value)}
          maxlength={200}
        />
      </View>

      {/* 确认按钮 */}
      <View className='confirm-section'>
        <View className='confirm-btn' onClick={handleConfirm}>
          <Text className='confirm-btn-text'>选择这个情绪</Text>
        </View>
      </View>
    </View>
  );
}