import React, { useState, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useEmotionStore } from '@/store/emotionStore';
import { getAllAwCards, clearAllData, updateAwCard } from '@/services/storage';
import type { AwEmotionCard } from '@/types/emotion';
import TabBar from '@/components/TabBar';
import { HistoryFilter, type FilterKey } from './components/HistoryFilter';
import { HistoryCardItem } from './components/HistoryCardItem';
import { HistoryDetailPanel } from './components/HistoryDetailPanel';
import './index.scss';

export default function History() {
  const cards = useEmotionStore(s => s.cards);
  const loadCards = useEmotionStore(s => s.loadCards);
  const updateCard = useEmotionStore(s => s.updateCard);
  const setActiveTab = useEmotionStore(s => s.setActiveTab);
  const setHistoryChatCardId = useEmotionStore(s => s.setHistoryChatCardId);

  const [filter, setFilter] = useState<FilterKey>('all');
  const [selectedCard, setSelectedCard] = useState<AwEmotionCard | null>(null);
  const [showRitual, setShowRitual] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [feedback, setFeedback] = useState('');

  Taro.useDidShow(() => {
    setActiveTab('history');
  });

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
    if (selectedCard?.id === card.id) {
      setSelectedCard({ ...card, status: 'completed' });
    }
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

  const handleShareLeaf = async () => {
    if (!selectedCard) return;
    const nextCard: AwEmotionCard = {
      ...selectedCard,
      isLeaf: true,
      feedback,
      likes: selectedCard.likes ?? 0,
      expiryTime: Date.now() + 24 * 60 * 60 * 1000,
      story: `在${selectedCard.date}，有一颗种子在心中萌发。面对“${selectedCard.input || '难以言说的情绪'}”，TA选择了“${selectedCard.action}”。最终，这份情绪化作了一片轻盈的叶子。`
    };
    await updateAwCard(nextCard.id, nextCard);
    updateCard(nextCard.id, nextCard);
    setSelectedCard(nextCard);
    setShowShare(false);
    setFeedback('');
    Taro.showToast({ title: '已挂上生命之树', icon: 'success' });
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
        <HistoryFilter value={filter} onChange={setFilter} />
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
            <HistoryCardItem key={card.id} card={card} onOpen={setSelectedCard} onComplete={handleMarkDone} />
          ))}
        </View>
      )}

      {selectedCard ? (
        <HistoryDetailPanel
          card={selectedCard}
          feedback={feedback}
          sharing={showShare}
          onFeedbackChange={setFeedback}
          onClose={() => {
            setSelectedCard(null);
            setShowShare(false);
          }}
          onComplete={() => void handleMarkDone(selectedCard)}
          onLetGo={() => runLetGoRitual(selectedCard)}
          onShareLeaf={() => void handleShareLeaf()}
          onContinueChat={() => {
            setHistoryChatCardId(selectedCard.id);
            Taro.navigateTo({ url: '/pages/chat/index' });
          }}
          onOpenShare={() => setShowShare(true)}
          onCloseShare={() => setShowShare(false)}
        />
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
          {Array.from({ length: 10 }).map((_, idx) => (
            <View
              key={`particle-${idx}`}
              className='ritual-particle'
              style={{
                left: `${10 + idx * 8}%`,
                bottom: `${10 + (idx % 3) * 8}%`,
                animationDelay: `${idx * 0.12}s`
              }}
            />
          ))}
        </View>
      ) : null}

      {filteredCards.length > 0 ? (
        <View className='clear-area'>
          <View className='clear-btn' onClick={handleDeleteAll}>
            <Text className='clear-btn-text'>清空阿窝记录</Text>
          </View>
        </View>
      ) : null}

      <TabBar current='history' />
    </View>
  );
}
