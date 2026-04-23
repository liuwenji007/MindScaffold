import React, { useEffect, useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { getAllAwCards } from '@/services/storage';
import { useEmotionStore } from '@/store/emotionStore';
import TabBar from '@/components/TabBar';
import { AppIcon } from '@/components/AppIcon';
import './index.scss';

export default function Profile() {
  const loadCards = useEmotionStore(s => s.loadCards);
  const cards = useEmotionStore(s => s.cards);
  const emotionPoints = useEmotionStore(s => s.emotionPoints);
  const setActiveTab = useEmotionStore(s => s.setActiveTab);

  const [nightCount, setNightCount] = useState(cards.length);

  Taro.useDidShow(() => {
    setActiveTab('me');
  });

  useEffect(() => {
    void (async () => {
      const list = await getAllAwCards();
      loadCards(list);
      setNightCount(list.length);
    })();
  }, [loadCards]);

  const leafCount = cards.filter(card => card.isLeaf).length;
  const bookmarkCount = cards.filter(card => card.isLeaf && (card.expiryTime ?? 0) <= Date.now()).length;

  return (
    <View className='profile-page'>
      <View className='profile-header'>
        <View className='profile-settings-btn' onClick={() => Taro.navigateTo({ url: '/pages/settings/index' })}>
          <AppIcon name='settings' size={18} color='#94a3b8' />
        </View>
        <View className='profile-avatar-wrap'>
          <AppIcon name='user' size={52} color='#94a3b8' />
        </View>
        <Text className='profile-me-title'>阿窝的旅伴</Text>
        <Text className='profile-me-sub'>已陪伴你度过 {nightCount} 个夜晚</Text>
      </View>

      <View className='profile-stats-grid'>
        <View className='profile-stat-card'>
          <Text className='profile-stat-value profile-stat-value-accent'>{leafCount}</Text>
          <Text className='profile-stat-label'>分享叶片</Text>
        </View>
        <View className='profile-stat-card'>
          <Text className='profile-stat-value'>{bookmarkCount}</Text>
          <Text className='profile-stat-label'>书签归档</Text>
        </View>
        <View className='profile-stat-card'>
          <Text className='profile-stat-value profile-stat-value-warm'>{emotionPoints}</Text>
          <Text className='profile-stat-label'>情绪点</Text>
        </View>
      </View>

      <View className='menu-list'>
        <View className='menu-item-shop' onClick={() => Taro.navigateTo({ url: '/pages/store/index' })}>
          <View className='menu-item-icon'>
            <AppIcon name='shop' size={20} color='#151921' />
          </View>
          <View className='menu-item-copy'>
            <Text className='menu-item-title'>被窝商店</Text>
            <Text className='menu-item-subtitle'>用情绪点兑换皮肤与装扮</Text>
          </View>
          <Text className='menu-arrow'>›</Text>
        </View>
      </View>

      <TabBar current='profile' />
    </View>
  );
}
