import React from 'react';
import { View, Text } from '@tarojs/components';
import type { AwEmotionCard } from '@/types/emotion';
import { AppIcon } from '@/components/AppIcon';

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
            <AppIcon name='check' size={20} color='var(--color-accent-warm)' />
          </View>
        ) : null}
      </View>
      <Text className='historyCardMirror'>"{card.mirrorText}"</Text>
      <View className='historyCardFooter'>
        <View className='historyCardActionRow'>
          <AppIcon name='sparkles' size={14} color='var(--color-accent-warm)' />
          <Text className='historyCardAction'>微行动：{card.action}</Text>
        </View>
        <AppIcon name='arrowRight' size={16} color='rgba(148,163,184,0.4)' />
      </View>
    </View>
  );
}
