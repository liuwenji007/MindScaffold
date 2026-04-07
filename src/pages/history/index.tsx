import React, { useState, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useEmotionStore } from '@/store/emotionStore';
import { getAllCards, updateCardStatus, deleteCard } from '@/services/storage';
import type { ActionCard } from '@/types/emotion';
import TabBar from '@/components/TabBar';
import './index.scss';

export default function History() {
  const cards = useEmotionStore(s => s.cards);
  const loadCards = useEmotionStore(s => s.loadCards);
  const removeCard = useEmotionStore(s => s.removeCard);
  const [selectedCard, setSelectedCard] = useState<ActionCard | null>(null);

  useEffect(() => {
    loadCardsFromStorage();
  }, []);

  const loadCardsFromStorage = async () => {
    const storedCards = await getAllCards();
    loadCards(storedCards);
  };

  const handleCardClick = (card: ActionCard) => {
    setSelectedCard(card);
  };

  const handleMarkDone = async (card: ActionCard) => {
    await updateCardStatus(card.id, 'done');
    await loadCardsFromStorage();
    Taro.showToast({ title: '太棒了，你做到了！', icon: 'none' });
  };

  const handleThrowToTreehole = async (card: ActionCard) => {
    Taro.navigateTo({
      url: `/pages/treehole/index?id=${card.id}`
    });
  };

  const handleDeleteAll = async () => {
    Taro.showModal({
      title: '确认清空',
      content: '确定要清空所有历史记录吗？此操作不可撤销。',
      success: async (res) => {
        if (res.confirm) {
          // 删除所有卡片
          for (const card of cards) {
            await deleteCard(card.id);
          }
          await loadCardsFromStorage();
          Taro.showToast({ title: '已清空', icon: 'none' });
        }
      }
    });
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <View className='history-page'>
      {/* 标题 */}
      <View className='header'>
        <Text className='title'>你的痕迹</Text>
        <Text className='subtitle'>每一次梳理，都是对自己的看见</Text>
      </View>

      {/* 卡片列表 */}
      {cards.length === 0 ? (
        <View className='empty-area'>
          <Text className='empty-text'>还没有记录</Text>
          <Text className='empty-hint'>开始你的第一次情绪梳理吧</Text>
        </View>
      ) : (
        <View className='card-list'>
          {cards.map(card => (
            <View
              key={card.id}
              className={`history-card ${card.status === 'done' ? 'history-card-done' : card.status === 'archived' ? 'history-card-archived' : ''}`}
              onClick={() => handleCardClick(card)}
            >
              <View className='card-header'>
                <Text className='card-date'>{formatDate(card.createdAt)}</Text>
                <Text className={`card-status ${card.status === 'done' ? 'card-status-done' : card.status === 'archived' ? 'card-status-archived' : ''}`}>
                  {card.status === 'pending' ? '待完成' :
                   card.status === 'done' ? '已完成' : '已放下'}
                </Text>
              </View>
              <Text className='card-mirror'>{card.mirrorText}</Text>
              {card.selectedActionId && (
                <View className='card-action'>
                  <Text className='action-label'>下一步：</Text>
                  <Text className='action-text'>
                    {card.actions.find(a => a.id === card.selectedActionId)?.text}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* 详情弹窗 */}
      {selectedCard && (
        <View className='detail-modal'>
          <View className='modal-content'>
            <Text className='modal-title'>详情</Text>
            <Text className='modal-mirror'>{selectedCard.mirrorText}</Text>
            <View className='modal-actions'>
              <View className='modal-btn' onClick={() => handleMarkDone(selectedCard)}>
                <Text>标记完成</Text>
              </View>
              <View className='modal-btn-treehole' onClick={() => handleThrowToTreehole(selectedCard)}>
                <Text>扔进树洞</Text>
              </View>
            </View>
            <View className='modal-close' onClick={() => setSelectedCard(null)}>
              <Text>关闭</Text>
            </View>
          </View>
        </View>
      )}

      {/* 清空按钮 */}
      {cards.length > 0 && (
        <View className='clear-area'>
          <View className='clear-btn' onClick={handleDeleteAll}>
            <Text>清空所有记录</Text>
          </View>
        </View>
      )}

      {/* 底部导航 */}
      <TabBar current='history' />
    </View>
  );
}