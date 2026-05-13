import React, { useState } from 'react';
import { View, Text, Slider, Textarea } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useEmotionStore } from '@/store/emotionStore';
import TabBar from '@/components/TabBar';
import { AppIcon } from '@/components/AppIcon';
import { FadeIn } from '@/components/motion';
import './index.scss';

const PLACEHOLDER_CLASS = 'home-textarea-placeholder';

export default function Index() {
  const startFlow = useEmotionStore(s => s.startFlow);
  const setActiveTab = useEmotionStore(s => s.setActiveTab);
  const [intensity, setIntensity] = useState(5);
  const [input, setInput] = useState('');

  Taro.useDidShow(() => {
    setActiveTab('home');
  });

  const handleStart = () => {
    startFlow(intensity, input.trim());
    Taro.navigateTo({ url: '/pages/breakdown/index' });
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

      <FadeIn variant='fadeInDelay'>
        <View className='home-card'>
          <Text className='home-card-title'>此刻你的心情是？</Text>
          <View className='slider-wrap'>
            <Slider
              className='home-slider'
              min={1}
              max={10}
              step={1}
              value={intensity}
              activeColor='#ffb347'
              backgroundColor='rgba(255,255,255,0.1)'
              blockSize={22}
              style={{ width: '100%' }}
              onChanging={e => setIntensity(Number(e.detail.value))}
              onChange={e => setIntensity(Number(e.detail.value))}
            />
          </View>
          <View className='slider-labels'>
            <Text className='slider-label'>平静</Text>
            <Text className='slider-value'>{intensity}</Text>
            <Text className='slider-label'>波澜</Text>
          </View>
        </View>
      </FadeIn>

      <FadeIn variant='fadeInDelay'>
        <View className='home-textarea-shell'>
          <Textarea
            className='home-textarea-input'
            placeholder='如果可以用一句话描述此刻…'
            placeholderClass={PLACEHOLDER_CLASS}
            value={input}
            maxlength={2000}
            onInput={e => setInput(e.detail.value)}
            nativeProps={{
              spellCheck: false,
              autoComplete: 'off',
              rows: 6,
              style: { background: 'transparent' },
            }}
          />
        </View>
      </FadeIn>

      <FadeIn variant='fadeInDelay'>
        <View className='home-primary' onClick={handleStart}>
          <Text className='home-primary-text'>开始梳理</Text>
          <AppIcon name='arrowRight' size={18} color='#151921' />
        </View>
      </FadeIn>

      <TabBar current='index' />
    </View>
  );
}
