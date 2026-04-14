import React, { useState, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { v4 as uuidv4 } from 'uuid';
import { useEmotionStore } from '@/store/emotionStore';
import { fetchActions } from '@/services/ai';
import { saveCard } from '@/services/storage';
import type { ActionCard, MicroAction } from '@/types/emotion';
import './index.scss';

export default function Action() {
  const currentEntry = useEmotionStore(s => s.currentEntry);
  const currentMirror = useEmotionStore(s => s.currentMirror);
  const addCard = useEmotionStore(s => s.addCard);
  const reset = useEmotionStore(s => s.reset);

  const [actions, setActions] = useState<MicroAction[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!currentMirror) {
      Taro.redirectTo({ url: '/pages/index/index' });
      return;
    }
    generateActions();
  }, [currentMirror]);

  const generateActions = async () => {
    if (!currentMirror) return;
    setIsLoading(true);
    try {
      const res = await fetchActions({ mirrorText: currentMirror.mirrorText });
      const microActions: MicroAction[] = res.actions.map((a, idx) => ({
        id: uuidv4(),
        text: a.text,
        estimatedTime: a.estimatedTime
      }));
      setActions(microActions);
    } catch {
      // AI 生成失败时提供默认行动
      setActions([
        { id: uuidv4(), text: '写下3个让你担心的事', estimatedTime: '5分钟' },
        { id: uuidv4(), text: '深呼吸10次，感受当下的平静', estimatedTime: '3分钟' },
        { id: uuidv4(), text: '给信任的人发一条消息', estimatedTime: '5分钟' }
      ]);
    }
    setIsLoading(false);
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const handleConfirm = async () => {
    if (!selectedId) {
      Taro.showToast({ title: '先选一个今晚要做的小动作', icon: 'none' });
      return;
    }

    const selectedAction = actions.find(a => a.id === selectedId);
    const card: ActionCard = {
      id: uuidv4(),
      entryId: currentEntry!.id,
      mirrorText: currentMirror!.mirrorText,
      actions,
      selectedActionId: selectedId,
      status: 'pending',
      createdAt: Date.now()
    };

    // 保存到 IndexedDB
    await saveCard(card);

    // 更新 store
    addCard(card);

    // 重置当前流程
    reset();

    // 提示用户
    Taro.showToast({
      title: `今晚就做：${selectedAction?.text}`,
      icon: 'none',
      duration: 3000
    });

    // 返回首页
    setTimeout(() => {
      Taro.redirectTo({ url: '/pages/index/index' });
    }, 3000);
  };

  const handleSkip = () => {
    reset();
    Taro.redirectTo({ url: '/pages/index/index' });
  };

  if (isLoading) {
    return (
      <View className='action-page-loading'>
        <Text>阿窝正在找一个今晚就能做的小动作...</Text>
      </View>
    );
  }

  return (
    <View className='action-page'>
      {/* 标题 */}
      <View className='header'>
        <Text className='title'>睡前最后一件事</Text>
        <Text className='subtitle'>不用解决全部，只做一个现在就能完成的小动作</Text>
      </View>

      {/* 行动选项 */}
      <View className='action-list'>
        {actions.map(action => (
          <View
            key={action.id}
            className={`action-card ${selectedId === action.id ? 'action-card-selected' : ''}`}
            onClick={() => handleSelect(action.id)}
          >
            <Text className='action-text'>{action.text}</Text>
            <Text className='action-time'>{action.estimatedTime}</Text>
          </View>
        ))}
      </View>

      {/* AI 标识 */}
      <Text className='ai-tag'>阿窝生成内容，仅供参考</Text>

      {/* 操作按钮 */}
      <View className='action-area'>
        <View className='skip-btn' onClick={handleSkip}>
          <Text>今晚先不做</Text>
        </View>
        <View className='confirm-btn' onClick={handleConfirm}>
          <Text>就做这个</Text>
        </View>
      </View>
    </View>
  );
}