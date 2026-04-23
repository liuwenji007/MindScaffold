import React from 'react';
import { View, Text } from '@tarojs/components';
import type { AwEmotionCard } from '@/types/emotion';

interface LeafItemProps {
  card: AwEmotionCard;
  expired?: boolean;
  timeLabel?: string;
  align?: 'left' | 'right';
  onOpen: (card: AwEmotionCard) => void;
  onFertilize?: (card: AwEmotionCard) => void;
}

export function LeafItem({ card, expired, timeLabel, align = 'left', onOpen, onFertilize }: LeafItemProps) {
  const sideClass = align === 'right' ? 'treeLeafRow treeLeafRowRight' : 'treeLeafRow treeLeafRowLeft';
  const stemClass = align === 'right' ? 'treeLeafStem treeLeafStemLeft' : 'treeLeafStem treeLeafStemRight';
  const cardClass = expired
    ? 'treeLeafCard treeLeafCardExpired'
    : align === 'right'
      ? 'treeLeafCard treeLeafCardRight'
      : 'treeLeafCard treeLeafCardLeft';

  return (
    <View className={sideClass}>
      <View className={stemClass} />
      <View className={cardClass} onClick={() => onOpen(card)}>
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
        <View className='treeLeafBottom'>
          <Text className='treeLeafBottomHint'>{expired ? '查看书签详情' : '查看叶片详情'}</Text>
          <Text className='treeLeafBottomArrow'>›</Text>
        </View>
      </View>
    </View>
  );
}
