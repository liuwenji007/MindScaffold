import React from 'react';
import { View, Text } from '@tarojs/components';
import type { AwEmotionCard } from '@/types/emotion';

interface HistoryCardItemProps {
  card: AwEmotionCard;
  onOpen: (card: AwEmotionCard) => void;
  onComplete: (card: AwEmotionCard) => void;
}

export function HistoryCardItem({ card, onOpen, onComplete }: HistoryCardItemProps) {
  return (
    <View className='historyCard' onClick={() => onOpen(card)}>
      <View className='historyCardHeader'>
        <View className='historyCardMeta'>
          <Text className='historyCardDate'>{card.date}</Text>
          <View className='historyCardMetaRow'>
            <Text className='historyCardIntensity'>强度 {card.intensity}</Text>
            {card.status === 'completed' ? <Text className='historyCardDoneTag'>已完成</Text> : null}
          </View>
        </View>
        {card.status === 'pending' ? (
          <View
            className='historyQuickDone'
            onClick={event => {
              event.stopPropagation();
              onComplete(card);
            }}
          >
            <Text className='historyQuickDoneText'>✓</Text>
          </View>
        ) : null}
      </View>
      <Text className='historyCardMirror'>「{card.mirrorText}」</Text>
      <View className='historyCardFooter'>
        <Text className='historyCardAction'>微行动：{card.action}</Text>
        <Text className='historyCardArrow'>›</Text>
      </View>
    </View>
  );
}
