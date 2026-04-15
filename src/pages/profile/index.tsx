import React, { useEffect, useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { clearAllData, getAllAwCards } from '@/services/storage';
import { useEmotionStore } from '@/store/emotionStore';
import TabBar from '@/components/TabBar';
import { AppIcon } from '@/components/AppIcon';
import './index.scss';

export default function Profile() {
  const loadCards = useEmotionStore(s => s.loadCards);
  const [nightCount, setNightCount] = useState(0);

  useEffect(() => {
    void (async () => {
      const list = await getAllAwCards();
      loadCards(list);
      setNightCount(list.length);
    })();
  }, [loadCards]);

  const handleClearData = () => {
    Taro.showModal({
      title: '确认清空',
      content: '确定要清空所有记录吗？此操作不可撤销。',
      confirmText: '确认清空',
      confirmColor: '#e07a5f',
      success: async res => {
        if (res.confirm) {
          await clearAllData();
          loadCards([]);
          setNightCount(0);
          Taro.showToast({ title: '已清空所有数据', icon: 'success' });
        }
      }
    });
  };

  const handleFeedback = () => {
    Taro.showModal({
      title: '反馈与建议',
      content: '如有问题或建议，请通过应用商店留言联系我们。',
      showCancel: false
    });
  };

  const handleAbout = () => {
    Taro.showModal({
      title: '关于阿窝睡了',
      content:
        '阿窝睡了帮助你把一天的情绪结构化外化，并选一个微小的睡前行动。数据仅保存在本机。',
      showCancel: false
    });
  };

  return (
    <View className='profile-page'>
      <View className='profile-avatar-wrap'>
        <AppIcon name='user' size={52} color='#94a3b8' />
      </View>
      <Text className='profile-me-title'>阿窝的旅伴</Text>
      <Text className='profile-me-sub'>已陪伴你度过 {nightCount} 个夜晚</Text>

      <View className='menu-list'>
        <View className='menu-item' onClick={handleFeedback}>
          <Text className='menu-text'>反馈与建议</Text>
          <Text className='menu-arrow'>→</Text>
        </View>
        <View className='menu-item' onClick={handleAbout}>
          <Text className='menu-text'>关于阿窝睡了</Text>
          <Text className='menu-arrow'>→</Text>
        </View>
        <View className='menu-item'>
          <Text className='menu-text'>版本</Text>
          <Text className='menu-value'>v1.0.0</Text>
        </View>
      </View>

      <View className='section-title'>
        <Text className='section-title-text'>数据管理</Text>
      </View>
      <View className='menu-list'>
        <View className='menu-item-danger' onClick={handleClearData}>
          <Text className='menu-text'>清空所有数据</Text>
          <Text className='menu-arrow'>→</Text>
        </View>
      </View>

      <View className='disclaimer-section'>
        <Text className='disclaimer-title'>重要声明</Text>
        <Text className='disclaimer-text'>
          本产品不替代专业心理咨询或治疗。如有严重情绪问题，请寻求专业帮助。
        </Text>
        <Text className='disclaimer-text'>
          您的所有数据仅存储在本地设备，我们不会收集或上传您的个人信息。
        </Text>
      </View>

      <View className='footer'>
        <Text className='footer-text'>© 2026 阿窝睡了</Text>
        <Text className='footer-text'>把乱糟糟的今天，交给阿窝</Text>
      </View>

      <TabBar current='profile' />
    </View>
  );
}
