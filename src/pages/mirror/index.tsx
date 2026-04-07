import React, { useState, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useEmotionStore } from '@/store/emotionStore';
import { fetchMirror } from '@/services/ai';
import type { MirrorResult } from '@/types/emotion';
import './index.scss';

export default function Mirror() {
  const currentEntry = useEmotionStore(s => s.currentEntry);
  const currentBreakdown = useEmotionStore(s => s.currentBreakdown);
  const setMirror = useEmotionStore(s => s.setMirror);

  const [mirrorText, setMirrorText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [contextPrompt, setContextPrompt] = useState('');

  useEffect(() => {
    if (!currentEntry) {
      Taro.redirectTo({ url: '/pages/index/index' });
      return;
    }

    // 获取 URL 参数中的上下文提示词
    const instance = Taro.getCurrentInstance();
    const context = instance.router?.params?.context;
    if (context) {
      setContextPrompt(decodeURIComponent(context));
    }

    generateMirror(context);
  }, [currentEntry]);

  const generateMirror = async (context?: string) => {
    if (!currentEntry) return;
    setIsLoading(true);
    try {
      // 构建原因列表
      const causes = currentBreakdown?.priority?.length > 0
        ? currentBreakdown.priority.map(id => {
            const card = currentBreakdown.causes.find(c => c.id === id);
            return card?.text || '';
          }).filter(Boolean)
        : [];

      const res = await fetchMirror({
        emotion: currentEntry.emotion,
        causes,
        contextPrompt: context || contextPrompt // 传入用户回答的上下文
      });
      setMirrorText(res.mirrorText);
    } catch {
      // AI 生成失败时提供默认镜像
      const defaultText = context || contextPrompt
        ? `你感到${currentEntry.emotion}。${context || contextPrompt}。这些感受是被允许的，你不需要独自承担。`
        : `你感到${currentEntry.emotion}，这种情绪是被允许的。你的感受是真实的。`;
      setMirrorText(defaultText);
    }
    setIsLoading(false);
  };

  const handleConfirm = () => {
    const mirror: MirrorResult = {
      entryId: currentEntry!.id,
      mirrorText,
      confirmed: true
    };
    setMirror(mirror);
    Taro.navigateTo({ url: '/pages/action/index' });
  };

  const handleRegenerate = () => {
    generateMirror();
  };

  if (isLoading) {
    return (
      <View className='mirror-page-loading'>
        <Text>正在倾听...</Text>
      </View>
    );
  }

  return (
    <View className='mirror-page'>
      {/* 标题 */}
      <View className='header'>
        <Text className='title'>镜子里的你</Text>
      </View>

      {/* 引导语 */}
      <View className='prompt-area'>
        <Text className='prompt-text'>
          这是 AI 对你情绪的镜像重述，看看是否准确
        </Text>
      </View>

      {/* 镜像重述卡片 */}
      <View className='mirror-card'>
        <Text className='mirror-text'>{mirrorText}</Text>
        <Text className='ai-tag'>AI生成内容，仅供参考</Text>
      </View>

      {/* 用户回答摘要 */}
      {(contextPrompt || currentEntry?.userNote) && (
        <View className='summary-area'>
          <Text className='summary-label'>你的回答：</Text>
          <Text className='summary-text'>
            {contextPrompt || currentEntry?.userNote}
          </Text>
        </View>
      )}

      {/* 操作按钮 */}
      <View className='action-area'>
        <View className='regenerate-btn' onClick={handleRegenerate}>
          <Text>换一种说法</Text>
        </View>
        <View className='confirm-btn' onClick={handleConfirm}>
          <Text>是的，就是这样</Text>
        </View>
      </View>
    </View>
  );
}