import React from 'react';
import { View, Text } from '@tarojs/components';
import type { AwEmotionCard } from '@/types/emotion';

interface LeafItemProps {
  card: AwEmotionCard;
  expired?: boolean;
  timeLabel?: string;
  onOpen: (card: AwEmotionCard) => void;
  onFertilize?: (card: AwEmotionCard) => void;
}

export function LeafItem({ card, expired, timeLabel, onOpen, onFertilize }: LeafItemProps) {
  return (
    <View className={expired ? 'treeLeafCard treeLeafCardExpired' : 'treeLeafCard'} onClick={() => onOpen(card)}>
      <View className='treeLeafCardTop'>
        <View className='treeLeafCardMeta'>
          <Text className='treeLeafCardDate'>{card.date}</Text>
          {expired ? (
            <Text className='treeLeafCardTime'>已归档</Text>
          ) : (
            <Text className='treeLeafCardTime'>{timeLabel || '--:--:--'}</Text>
          )}
        </View>
        {!expired ? (
          <View
            className='treeLeafSunBtn'
            onClick={event => {
              event.stopPropagation();
              onFertilize?.(card);
            }}
          >
            <Text className='treeLeafSunBtnText'>☀ {card.likes ?? 0}</Text>
          </View>
        ) : null}
      </View>
      <Text className='treeLeafStory'>「{card.story || card.mirrorText}」</Text>
    </View>
  );
}
