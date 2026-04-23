import React, { useMemo, useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useEmotionStore } from '@/store/emotionStore';
import { updateAwCard } from '@/services/storage';
import type { AwEmotionCard } from '@/types/emotion';
import { AppIcon } from '@/components/AppIcon';
import TabBar from '@/components/TabBar';
import { isHarmonyHybrid, isRN } from '@/platform/runtime';
import { LeafItem } from './components/LeafItem';
import './index.scss';

function formatRemain(ms: number): string {
  if (ms <= 0) return '00:00:00';
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const mins = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((ms % (1000 * 60)) / 1000);
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export default function TreePage() {
  const cards = useEmotionStore(s => s.cards);
  const updateCard = useEmotionStore(s => s.updateCard);
  const setActiveTab = useEmotionStore(s => s.setActiveTab);
  const [selected, setSelected] = useState<AwEmotionCard | null>(null);
  const [now, setNow] = useState(Date.now());
  const isCompactMode = isRN() || isHarmonyHybrid();

  React.useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  Taro.useDidShow(() => {
    setActiveTab('tree');
  });

  const activeLeaves = useMemo(
    () => cards.filter(card => card.isLeaf && (card.expiryTime ?? 0) > now),
    [cards, now]
  );
  const bookmarks = useMemo(
    () => cards.filter(card => card.isLeaf && (card.expiryTime ?? 0) <= now),
    [cards, now]
  );

  const handleFertilize = async (card: AwEmotionCard) => {
    const next = {
      ...card,
      likes: (card.likes ?? 0) + 1,
      expiryTime: (card.expiryTime ?? now) + 15 * 60 * 1000
    };
    updateCard(card.id, next);
    await updateAwCard(card.id, next);
  };

  const handleFertilizeFromDetail = async () => {
    if (!selected || (selected.expiryTime ?? 0) <= now) return;
    const next = {
      ...selected,
      likes: (selected.likes ?? 0) + 1,
      expiryTime: (selected.expiryTime ?? now) + 15 * 60 * 1000
    };
    setSelected(next);
    updateCard(selected.id, next);
    await updateAwCard(selected.id, next);
  };

  return (
    <View className={isCompactMode ? 'treePage treePageCompact' : 'treePage'}>
      <View className='treeBackdrop' />
      <View className='treeHeader'>
        <Text className='treeTitle'>生命之树</Text>
        <Text className='treeSubTitle'>每一片叶子，都是一段被温柔对待的时光</Text>
      </View>

      <View className='treeStats'>
        <View className='treeStatItem'>
          <View className='treeStatTop'>
            <AppIcon name='leaf' size={28} color='#ffb347' />
            <Text className='treeStatValue treeStatValueAccent'>{activeLeaves.length}</Text>
          </View>
          <Text className='treeStatLabel'>枝头叶片</Text>
        </View>
        <View className='treeStatDivider' />
        <View className='treeStatItem'>
          <View className='treeStatTop'>
            <AppIcon name='history' size={28} color='#94a3b8' />
            <Text className='treeStatValue'>{bookmarks.length}</Text>
          </View>
          <Text className='treeStatLabel'>书签归档</Text>
        </View>
        <View className='treeStatDivider' />
        <View className='treeStatItem'>
          <View className='treeStatTop'>
            <AppIcon name='user' size={28} color='#7cc6ff' />
            <Text className='treeStatValue treeStatValueBlue'>{bookmarks.length * 12 + 42}</Text>
          </View>
          <Text className='treeStatLabel'>同路旅伴</Text>
        </View>
      </View>

      <View className='treeBody'>
        {activeLeaves.length === 0 && bookmarks.length === 0 ? (
          <View className='treeEmpty'>
            <AppIcon name='leaf' size={96} color='rgba(148,163,184,0.3)' />
            <Text className='treeEmptyMain'>大树还在等待第一片叶子</Text>
          </View>
        ) : null}

        {activeLeaves.length > 0 ? (
          <View className='treeSection'>
            <Text className='treeSectionTitle'>枝头叶片</Text>
            {activeLeaves.map((card, index) => (
              <LeafItem
                key={card.id}
                card={card}
                align={index % 2 === 0 ? 'left' : 'right'}
                timeLabel={formatRemain((card.expiryTime ?? 0) - now)}
                onOpen={setSelected}
                onFertilize={handleFertilize}
              />
            ))}
          </View>
        ) : null}

        {bookmarks.length > 0 ? (
          <View className='treeBookmarkSection'>
            <View className='treeBookmarkHeader'>
              <AppIcon name='history' size={32} color='rgba(148,163,184,0.8)' />
              <Text className='treeBookmarkHeaderText'>已归档的书签</Text>
            </View>
            {bookmarks.map(card => (
              <View key={card.id} className='treeBookmarkRow' onClick={() => setSelected(card)}>
                <View className='treeBookmarkLeft'>
                  <View className='treeBookmarkIcon'>
                    <AppIcon name='history' size={36} color='rgba(148,163,184,0.7)' />
                  </View>
                  <View className='treeBookmarkMeta'>
                    <Text className='treeBookmarkDate'>{card.date}</Text>
                    <Text className='treeBookmarkStory'>"{card.story || card.mirrorText}"</Text>
                  </View>
                </View>
                <View className='treeBookmarkRight'>
                  <View className='treeBookmarkSun'>
                    <AppIcon name='sun' size={24} color='rgba(255,179,71,0.7)' />
                    <Text className='treeBookmarkSunNum'>{card.likes ?? 0}</Text>
                  </View>
                  <AppIcon name='arrowRight' size={28} color='rgba(148,163,184,0.5)' />
                </View>
              </View>
            ))}
          </View>
        ) : null}
      </View>

      {selected ? (
        <View className='treeDetailMask' onClick={() => setSelected(null)}>
          <View
            className={selected.id.length % 2 === 0 ? 'treeDetailPanel treeDetailPanelEven' : 'treeDetailPanel treeDetailPanelOdd'}
            onClick={event => event.stopPropagation()}
          >
            <View className='treeDetailWatermark' />
            <View className='treeDetailTop'>
              <View className='treeDetailTopLeft'>
                <Text className='treeDetailDate'>{selected.date}</Text>
                <Text className='treeDetailTitle'>
                  {(selected.expiryTime ?? 0) > now ? '叶子的记忆' : '永恒的书签'}
                </Text>
              </View>
              <View className='treeDetailClose' onClick={() => setSelected(null)}>
                <AppIcon name='chevronLeft' size={40} color='#94a3b8' />
              </View>
            </View>
            <View className='treeDetailSection'>
              <View className='treeDetailLabelRow'>
                <AppIcon name='wind' size={24} color='#7a8aa4' />
                <Text className='treeDetailSectionLabel'>故事回顾</Text>
              </View>
              <Text className='treeDetailStory'>
                “{selected.story || selected.mirrorText}”
              </Text>
            </View>
            {selected.feedback ? (
              <View className='treeDetailFeedbackCard'>
                <View className='treeDetailLabelRow'>
                  <AppIcon name='sparkles' size={24} color='rgba(255, 184, 77, 0.75)' />
                  <Text className='treeDetailFeedbackLabel'>反馈与收获</Text>
                </View>
                <Text className='treeDetailFeedback'>{selected.feedback}</Text>
              </View>
            ) : null}
            <View className='treeDetailFoot'>
              <View className='treeDetailFootStats'>
                <View className='treeDetailStatSun'>
                  <AppIcon name='sun' size={32} color='#ffb84d' />
                  <Text className='treeDetailLikesNum'>{selected.likes ?? 0}</Text>
                </View>
                {(selected.expiryTime ?? 0) > now ? (
                  <View className='treeDetailStatClock'>
                    <AppIcon name='clock' size={32} color='#94a3b8' />
                    <Text className='treeDetailRemain'>{formatRemain((selected.expiryTime ?? 0) - now)}</Text>
                  </View>
                ) : null}
              </View>
              {(selected.expiryTime ?? 0) > now ? (
                <View className='treeDetailAction' onClick={() => void handleFertilizeFromDetail()}>
                  <Text className='treeDetailActionText'>照耀阳光</Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>
      ) : null}

      <TabBar current='tree' />
    </View>
  );
}
