import React, { useState } from 'react';
import { View, Text, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useEmotionStore } from '@/store/emotionStore';
import TabBar from '@/components/TabBar';
import { AppIcon } from '@/components/AppIcon';
import { FadeIn } from '@/components/motion';
import HomeBgSprite from '@/components/HomeBgSprite';
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
      <HomeBgSprite />

      <View className='index-hero-tagline'>
        <Text className='index-hero-title'>阿窝睡了</Text>
        <Text className='index-hero-subtitle'>把你的今天，放进软窝里</Text>
      </View>

      <View className='index-page-content'>
        <FadeIn variant='fadeInDelay'>
          <View className='home-entry'>
            <Text className='home-entry-greeting'>阿窝在这儿。</Text>
            <Text className='home-entry-hint'>今天想聊点什么？</Text>
            <View className='home-entry-input-wrap'>
              <Input
                className='home-entry-input'
                placeholder='可以简单说说…（选填）'
                placeholderClass='home-entry-input-placeholder'
                value={input}
                maxlength={2000}
                onInput={e => setInput(e.detail.value)}
                onConfirm={handleStart}
              />
            </View>
            <View className='home-entry-btn' onClick={handleStart}>
              <Text className='home-entry-btn-text'>和阿窝聊聊</Text>
              <AppIcon name='arrowRight' size={14} color='#151921' />
            </View>
          </View>
        </FadeIn>
      </View>

      <TabBar current='index' />
    </View>
  );
}
