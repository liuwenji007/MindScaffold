import React, { useState, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useEmotionStore } from '@/store/emotionStore';
import { getAllAwCards, clearAllData, updateAwCard } from '@/services/storage';
import type { AwEmotionCard } from '@/types/emotion';
import TabBar from '@/components/TabBar';
import './index.scss';

type FilterKey = 'all' | 'pending' | 'completed';

export default function History() {
  const cards = useEmotionStore(s => s.cards);
  const loadCards = useEmotionStore(s => s.loadCards);
  const updateCard = useEmotionStore(s => s.updateCard);

  const [filter, setFilter] = useState<FilterKey>('all');
  const [selectedCard, setSelectedCard] = useState<AwEmotionCard | null>(null);
  const [showRitual, setShowRitual] = useState(false);

  useEffect(() => {
    void refresh();
  }, []);

  const refresh = async () => {
    const stored = await getAllAwCards();
    loadCards(stored);
  };

  const handleMarkDone = async (card: AwEmotionCard) => {
    await updateAwCard(card.id, { status: 'completed' });
    updateCard(card.id, { status: 'completed' });
    await refresh();
    Taro.showToast({ title: '很好，今晚这一步你已经做到了。', icon: 'none' });
  };

  const runLetGoRitual = (card: AwEmotionCard) => {
    setShowRitual(true);
    setTimeout(async () => {
      await updateAwCard(card.id, { status: 'letgo' });
      updateCard(card.id, { status: 'letgo' });
      await refresh();
      setShowRitual(false);
      setSelectedCard(null);
    }, 3000);
  };

  const handleDeleteAll = () => {
    Taro.showModal({
      title: '确认清空',
      content: '确定要清空阿窝里的所有记录吗？此操作不可撤销。',
      success: async res => {
        if (res.confirm) {
          await clearAllData();
          await refresh();
          Taro.showToast({ title: '已清空', icon: 'none' });
        }
      }
    });
  };

  const filteredCards = cards.filter(c => {
    if (filter === 'all') return c.status !== 'letgo';
    return c.status === filter;
  });

  return (
    <View className='history-page'>
      <View className='history-header-row'>
        <Text className='history-title-inline'>情绪存档</Text>
        <View className='filter-wrap filter-wrap-inline'>
          <View className='filter-list'>
            {(['all', 'pending', 'completed'] as const).map(f => (
              <View
                key={f}
                className={`filter-item ${filter === f ? 'filter-item-active' : ''}`}
                onClick={() => setFilter(f)}
              >
                <Text className={`filter-text ${filter === f ? 'filter-text-active' : ''}`}>
                  {f === 'all' ? '全部' : f === 'pending' ? '待办' : '已成'}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <Text className='subtitle history-sub'>你放下过的每一步，都在这里安静留存</Text>

      {filteredCards.length === 0 ? (
        <View className='empty-area'>
          <Text className='empty-text'>这里空荡荡的</Text>
          <Text className='empty-hint'>去首页记录一下吧</Text>
        </View>
      ) : (
        <View className='card-list'>
          {filteredCards.map(card => (
            <View
              key={card.id}
              className={`history-card ${card.status === 'completed' ? 'history-card-done' : ''} ${card.status === 'letgo' ? 'history-card-letgo' : ''}`}
              onClick={() => setSelectedCard(card)}
            >
              <View className='card-header'>
                <View className='card-header-left'>
                  <Text className='card-date'>{card.date}</Text>
                  <View className='card-meta-row'>
                    <Text className='card-intensity'>情绪值 {card.intensity}</Text>
                    {card.status === 'completed' ? (
                      <Text className='card-pill-done'>已完成</Text>
                    ) : null}
                  </View>
                </View>
                {card.status === 'pending' ? (
                  <View
                    className='card-quick-done'
                    onClick={e => {
                      e.stopPropagation();
                      void handleMarkDone(card);
                    }}
                  >
                    <Text className='card-quick-done-text'>✓</Text>
                  </View>
                ) : null}
              </View>
              <Text className='card-mirror'>「{card.mirrorText}」</Text>
              <View className='card-action-row'>
                <Text className='card-action-label'>微行动：{card.action}</Text>
                <Text className='card-chevron'>›</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {selectedCard ? (
        <View className='detail-modal'>
          <View className='detail-modal-inner'>
            <View className='detail-back' onClick={() => setSelectedCard(null)}>
              <Text className='detail-back-text'>‹</Text>
            </View>

            <Text className='detail-date'>{selectedCard.date}</Text>
            <Text className='detail-h1'>情绪回顾</Text>

            <View className='detail-section'>
              <Text className='detail-k'>当时的心情</Text>
              <Text className='detail-body italic'>
                「{selectedCard.input || '没有留下文字描述'}」
              </Text>
            </View>

            <View className='detail-section'>
              <Text className='detail-k'>AI 镜像重述</Text>
              <View className='detail-quote-box'>
                <Text className='detail-body'>{selectedCard.mirrorText}</Text>
              </View>
            </View>

            <View className='detail-section'>
              <Text className='detail-k'>预定的微行动</Text>
              <View className='detail-action-box'>
                <Text className='detail-action-title'>{selectedCard.action}</Text>
                <Text className='detail-action-sub'>预计时长：{selectedCard.duration}</Text>
              </View>
            </View>

            <View className='detail-footer-btns'>
              {selectedCard.status === 'pending' ? (
                <View
                  className='modal-btn'
                  onClick={() => void handleMarkDone(selectedCard)}
                >
                  <Text>标记完成</Text>
                </View>
              ) : null}
              {selectedCard.status !== 'letgo' ? (
                <View
                  className='modal-btn modal-btn-tree'
                  onClick={() => runLetGoRitual(selectedCard)}
                >
                  <Text>放进树洞</Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>
      ) : null}

      {showRitual ? (
        <View className='ritual-overlay'>
          <View className='ritual-card-float'>
            <Text className='ritual-wind'>〰</Text>
            <Text className='ritual-sub'>正在随风远去…</Text>
          </View>
          <View className='ritual-copy'>
            <Text className='ritual-h3'>它已经放下了</Text>
            <Text className='ritual-p'>今晚，你可以安心睡个好觉了</Text>
          </View>
        </View>
      ) : null}

      {filteredCards.length > 0 ? (
        <View className='clear-area'>
          <View className='clear-btn' onClick={handleDeleteAll}>
            <Text>清空阿窝记录</Text>
          </View>
        </View>
      ) : null}

      <TabBar current='history' />
    </View>
  );
}
