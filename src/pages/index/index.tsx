import React, { useState } from 'react';
import { View, Text, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useEmotionStore } from '@/store/emotionStore';
import TabBar from '@/components/TabBar';
import { AppIcon } from '@/components/AppIcon';
import { FadeIn } from '@/components/motion';
import AwoPixel from '@/components/AwoPixel';
import './index.scss';

export default function Index() {
  const startFlow = useEmotionStore(s => s.startFlow);
  const setActiveTab = useEmotionStore(s => s.setActiveTab);
  const [input, setInput] = useState('');

  Taro.useDidShow(() => {
    setActiveTab('home');
  });

  const handleStart = () => {
    startFlow(5, input.trim());
    Taro.navigateTo({ url: '/pages/chat/index' });
  };

  return (
    <View className='index-page'>
      <FadeIn variant='fadeIn'>
        <View className='header'>
          <View className='home-logo-wrap'>
            <View className='home-logo-glow' />
            <View className='home-logo-icon'>
              <AppIcon name='wind' size={32} color='#151921' />
            </View>
          </View>
          <Text className='title'>阿窝睡了</Text>
          <Text className='subtitle'>"把你的今天，放进软窝里"</Text>
        </View>
      </FadeIn>

      {/* Awo pixel scene */}
      <View className='home-awo-scene'>
        <AwoPixel onEnterPress={handleStart} />
      </View>

      <FadeIn variant='fadeInDelay'>
        <View className='home-card'>
          <Text className='home-card-title'>和阿窝说说话吧</Text>
          <View className='home-input-wrap'>
            <Input
              className='home-textarea-input'
              placeholder='可以简单说说什么事…（选填）'
              placeholderClass='home-textarea-placeholder'
              value={input}
              maxlength={2000}
              onInput={e => setInput(e.detail.value)}
            />
          </View>
        </View>
      </FadeIn>

      <FadeIn variant='fadeInDelay'>
        <View className='home-secondary' onClick={handleStart}>
          <Text className='home-secondary-text'>和阿窝聊聊</Text>
          <AppIcon name='arrowRight' size={14} color='#151921' />
        </View>
      </FadeIn>

      <TabBar current='index' />
    </View>
  );
}
