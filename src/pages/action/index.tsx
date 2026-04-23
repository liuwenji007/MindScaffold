import React, { useState, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { v4 as uuidv4 } from 'uuid';
import { useEmotionStore } from '@/store/emotionStore';
import { saveAwCard } from '@/services/storage';
import { DESIGN_ACTIONS } from '@/config/designFlow';
import type { AwEmotionCard } from '@/types/emotion';
import './index.scss';

export default function Action() {
  const draft = useEmotionStore(s => s.draft);
  const addCard = useEmotionStore(s => s.addCard);
  const gainEmotionPoints = useEmotionStore(s => s.gainEmotionPoints);
  const setActiveTab = useEmotionStore(s => s.setActiveTab);
  const resetDraft = useEmotionStore(s => s.resetDraft);

  const [selected, setSelected] = useState(-1);

  useEffect(() => {
    if (!draft?.mirrorText) {
      Taro.redirectTo({ url: '/pages/index/index' });
    }
  }, [draft]);

  if (!draft?.mirrorText) {
    return (
      <View className='action-page-loading'>
        <Text>正在回到首页…</Text>
      </View>
    );
  }

  const handleConfirm = async () => {
    if (selected < 0) {
      Taro.showToast({ title: '先选一个今晚就能做的小事', icon: 'none' });
      return;
    }
    const pick = DESIGN_ACTIONS[selected];
    const now = Date.now();
    const card: AwEmotionCard = {
      id: uuidv4(),
      createdAt: draft.createdAt || now,
      date: draft.date || new Date(now).toLocaleString('zh-CN', {
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      intensity: draft.intensity,
      input: draft.input,
      mirrorText: draft.mirrorText || '',
      action: pick.text,
      duration: pick.duration,
      status: 'pending',
      deconstructionAnswers: draft.deconstructionAnswers,
      chatHistory: draft.chatHistory ?? []
    };

    await saveAwCard(card);
    addCard(card);
    gainEmotionPoints(10);
    setActiveTab('history');
    resetDraft();

    Taro.showToast({ title: '已收进历史', icon: 'success', duration: 1200 });
    setTimeout(() => {
      Taro.switchTab({ url: '/pages/history/index' });
    }, 800);
  };

  return (
    <View className='action-page'>
      <View className='header'>
        <Text className='title'>一个微小的行动</Text>
        <Text className='subtitle'>选择一个今晚就能完成的小事，给今天画个句号</Text>
      </View>

      <View className='action-list'>
        {DESIGN_ACTIONS.map((action, i) => (
          <View
            key={action.text}
            className={`action-card ${selected === i ? 'action-card-selected' : ''}`}
            onClick={() => setSelected(i)}
          >
            <View className={`action-radio ${selected === i ? 'action-radio-on' : ''}`}>
              {selected === i ? <Text className='action-radio-mark'>✓</Text> : null}
            </View>
            <View className='action-copy'>
              <Text className='action-text'>{action.text}</Text>
              <Text className='action-time'>⏱ {action.duration}</Text>
            </View>
          </View>
        ))}
      </View>

      <View className='action-area action-area-single'>
        <View
          className={`confirm-btn ${selected < 0 ? 'confirm-btn-disabled' : ''}`}
          onClick={handleConfirm}
        >
          <Text>确认并完成梳理</Text>
        </View>
      </View>
    </View>
  );
}
