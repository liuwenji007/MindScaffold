import React, { useState, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { deleteCard, updateCardStatus, getAllCards } from '@/services/storage';
import { useEmotionStore } from '@/store/emotionStore';
import './index.scss';

export default function Treehole() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const cardId = Taro.getCurrentInstance().router?.params?.id;

  useEffect(() => {
    if (!cardId) {
      Taro.redirectTo({ url: '/pages/history/index' });
    }
  }, [cardId]);

  const handleThrow = async () => {
    setIsAnimating(true);

    // 动画持续 1.5 秒
    setTimeout(async () => {
      if (cardId) {
        // 标记为已归档（或直接删除）
        await updateCardStatus(cardId, 'archived');
        // 或者直接删除
        // await deleteCard(cardId);

        // 更新 store
        const cards = await getAllCards();
        useEmotionStore.getState().loadCards(cards);
      }

      setIsAnimating(false);
      setIsComplete(true);
    }, 1500);
  };

  const handleClose = () => {
    Taro.redirectTo({ url: '/pages/history/index' });
  };

  if (isComplete) {
    return (
      <View className='treehole-page-complete'>
        <View className='complete-content'>
          <Text className='complete-text'>让它去吧</Text>
          <Text className='complete-hint'>你已经放下了</Text>
          <View className='close-btn' onClick={handleClose}>
            <Text>返回</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className='treehole-page'>
      {/* 标题 */}
      <View className='header'>
        <Text className='title'>树洞</Text>
        <Text className='subtitle'>把不想要的，轻轻放下</Text>
      </View>

      {/* 卡片动画 */}
      <View className={`card-area ${isAnimating ? 'card-area-animating' : ''}`}>
        <View className='floating-card'>
          <Text className='card-text'>这张卡片</Text>
        </View>
      </View>

      {/* 操作按钮 */}
      {!isAnimating && (
        <View className='action-area'>
          <View className='throw-btn' onClick={handleThrow}>
            <Text>扔进树洞</Text>
          </View>
          <View className='cancel-btn' onClick={handleClose}>
            <Text>取消</Text>
          </View>
        </View>
      )}
    </View>
  );
}