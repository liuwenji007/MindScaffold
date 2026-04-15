import React, { useState, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useEmotionStore } from '@/store/emotionStore';
import { AppIcon } from '@/components/AppIcon';
import './index.scss';

function buildMirrorCopy(input: string): string {
  const frag = input ? `「${input}」` : '沉重';
  return `听起来，你现在感到有些${frag}。这并不是你的错，大脑只是在试图保护你免受那些不确定性的伤害。我们可以试着把这些情绪看作是路过的云，而不是你本身。`;
}

export default function Mirror() {
  const draft = useEmotionStore(s => s.draft);
  const setMirrorText = useEmotionStore(s => s.setMirrorText);

  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!draft) {
      Taro.redirectTo({ url: '/pages/index/index' });
      return;
    }

    setLoading(true);
    const t = setTimeout(() => {
      setText(buildMirrorCopy(draft.input));
      setLoading(false);
    }, 2000);
    return () => clearTimeout(t);
  }, [draft, reloadKey]);

  const handleConfirm = () => {
    setMirrorText(text);
    Taro.navigateTo({ url: '/pages/action/index' });
  };

  const handleRegenerate = () => {
    setReloadKey(k => k + 1);
  };

  if (!draft) {
    return (
      <View className='mirror-page-loading'>
        <Text>正在回到首页…</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View className='mirror-page-loading'>
        <View className='mirror-loading-visual'>
          <View className='mirror-loading-dot' />
          <View className='mirror-loading-spark'>
            <AppIcon name='sparkles' size={40} color='#ffb347' />
          </View>
        </View>
        <Text className='mirror-loading-text'>阿窝正在为你镜像情绪…</Text>
      </View>
    );
  }

  return (
    <View className='mirror-page'>
      <View className='mirror-inner'>
        <View className='mirror-badge'>
          <View className='mirror-badge-icon'>
            <AppIcon name='sparkles' size={14} color='#ffb347' />
          </View>
          <Text className='mirror-badge-text'>AI 镜像重述</Text>
        </View>
        <Text className='mirror-heading'>这是我听到的你</Text>

        <View className='mirror-card'>
          <Text className='mirror-text'>{text}</Text>
        </View>

        <View className='mirror-actions'>
          <View className='mirror-btn secondary' onClick={handleRegenerate}>
            <Text>换一种说法</Text>
          </View>
          <View className='mirror-btn primary' onClick={handleConfirm}>
            <Text>确认重述</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
