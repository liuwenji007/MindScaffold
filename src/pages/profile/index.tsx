import React, { useEffect, useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { getAllAwCards } from '@/services/storage';
import { useEmotionStore } from '@/store/emotionStore';
import { isLoggedIn, getUserInfo, clearAuth, UserInfo } from '@/services/auth';
import { get as apiGet } from '@/services/api';
import TabBar from '@/components/TabBar';
import { AppIcon } from '@/components/AppIcon';
import './index.scss';

export default function Profile() {
  const loadCards = useEmotionStore(s => s.loadCards);
  const cards = useEmotionStore(s => s.cards);
  const emotionPoints = useEmotionStore(s => s.emotionPoints);
  const setActiveTab = useEmotionStore(s => s.setActiveTab);
  const setEmotionPoints = useEmotionStore(s => s.setEmotionPoints);

  const [nightCount, setNightCount] = useState(cards.length);
  const [user, setUser] = useState<UserInfo | null>(getUserInfo());

  Taro.useDidShow(() => {
    setActiveTab('me');
  });

  useEffect(() => {
    void (async () => {
      const list = await getAllAwCards();
      loadCards(list);
      setNightCount(list.length);
    })();

    // 从后端同步情绪点
    void (async () => {
      const res = await apiGet<{ balance: number }>('/points');
      if (res.data && typeof res.data.balance === 'number') {
        setEmotionPoints(res.data.balance);
      }
    })();
  }, [loadCards, setEmotionPoints]);

  const leafCount = cards.filter(card => card.isLeaf).length;
  const bookmarkCount = cards.filter(card => card.isLeaf && (card.expiryTime ?? 0) <= Date.now()).length;

  const handleLogin = () => {
    Taro.navigateTo({ url: '/pages/login/index' });
  };

  const handleLogout = () => {
    Taro.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？本地数据不会丢失。',
      success: res => {
        if (res.confirm) {
          clearAuth();
          setUser(null);
          Taro.showToast({ title: '已退出登录', icon: 'success' });
        }
      }
    });
  };

  return (
    <View className='profile-page'>
      <View className='profile-header'>
        <View className='profile-settings-btn' onClick={() => Taro.navigateTo({ url: '/pages/settings/index' })}>
          <AppIcon name='settings' size={20} color='#94a3b8' />
        </View>
        <View className='profile-avatar-wrap'>
          <AppIcon name='user' size={56} color='#94a3b8' />
        </View>
        <Text className='profile-me-title'>
          {user ? user.nickname : '阿窝的旅伴'}
        </Text>
        <Text className='profile-me-sub'>已陪伴你度过 {nightCount} 个夜晚</Text>

        {isLoggedIn() ? (
          <View className='profile-login-btn' onClick={handleLogout}>
            <Text className='profile-login-btn-text'>退出登录</Text>
          </View>
        ) : (
          <View className='profile-login-btn' onClick={handleLogin}>
            <Text className='profile-login-btn-text'>登录 / 注册</Text>
          </View>
        )}
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
