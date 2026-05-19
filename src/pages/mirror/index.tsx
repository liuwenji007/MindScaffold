import React, { useState, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useEmotionStore } from '@/store/emotionStore';
import { post } from '@/services/api';
import { AppIcon } from '@/components/AppIcon';
import './index.scss';

export default function Mirror() {
  const draft = useEmotionStore(s => s.draft);
  const setReviewText = useEmotionStore(s => s.setReviewText);

  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!draft) {
      Taro.redirectTo({ url: '/pages/index/index' });
      return;
    }

    setLoading(true);
    setError('');

    const chatHistory = draft.chatHistory ?? [];
    if (chatHistory.length === 0) {
      setText(buildFallbackCopy(draft.input));
      setLoading(false);
      return;
    }

    void (async () => {
      const res = await post<{ review_text: string }>('/mirror/review', {
        input_text: draft.input,
        chat_history: chatHistory.map(m => ({ role: m.role, content: m.content })),
      });

      if (res.error) {
        setError(res.error);
        setLoading(false);
        return;
      }

      setText(res.data?.review_text || buildFallbackCopy(draft.input));
      setLoading(false);
    })();
  }, [draft, reloadKey]);

  const handleConfirm = () => {
    setReviewText(text);

    // 异步提取用户画像（不阻塞页面跳转）
    const chatHistory = draft.chatHistory ?? [];
    if (chatHistory.length > 0) {
      post('/profile/extract', {
        chat_history: chatHistory.map(m => ({ role: m.role, content: m.content })),
        input_text: draft.input,
        review_text: text,
      }).catch(() => {});
    }

    Taro.navigateTo({ url: '/pages/action/index' });
  };

  const handleRegenerate = () => {
    setReloadKey(k => k + 1);
  };

  if (!draft) {
    return null;
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
        <Text className='mirror-loading-text'>阿窝正在回顾你们的对话…</Text>
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
          <Text className='mirror-badge-text'>对话复盘</Text>
        </View>
        <Text className='mirror-heading'>回看这段对话</Text>

        {error ? (
          <View className='mirror-card'>
            <Text className='mirror-text' style={{ color: '#e07a5f' }}>
              {error}
            </Text>
          </View>
        ) : (
          <View className='mirror-card'>
            <Text className='mirror-text'>{text}</Text>
          </View>
        )}

        <View className='mirror-actions'>
          <View className='mirror-btn secondary' onClick={handleRegenerate}>
            <Text>换一种说法</Text>
          </View>
          <View className='mirror-btn primary' onClick={handleConfirm}>
            <Text>确认</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

/** 后备文案：API 不可用时使用本地生成 */
function buildFallbackCopy(input: string): string {
  const frag = input ? `「${input}」` : '你提到的那些事';
  return `回顾了这段对话，${frag}看起来对你来说并不轻松。能把这些说出来本身就是一种勇气。或许可以试着把这些感受记在心里，然后给自己一个温柔的收尾。`;
}
