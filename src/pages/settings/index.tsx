import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { clearAllData } from '@/services/storage';
import { useEmotionStore } from '@/store/emotionStore';
import './index.scss';

export default function SettingsPage() {
  const loadCards = useEmotionStore(s => s.loadCards);
  const setEmotionPoints = useEmotionStore(s => s.setEmotionPoints);

  const handleClear = () => {
    Taro.showModal({
      title: '确认清空',
      content: '确定要清空所有记录吗？此操作不可撤销。',
      confirmText: '确认清空',
      confirmColor: '#e07a5f',
      success: async res => {
        if (!res.confirm) return;
        await clearAllData();
        loadCards([]);
        setEmotionPoints(0);
        Taro.showToast({ title: '已清空所有数据', icon: 'success' });
        Taro.navigateBack();
      }
    });
  };

  const showAbout = () => {
    Taro.showModal({
      title: '关于阿窝睡了',
      content: '阿窝睡了帮助你把一天的情绪结构化外化，并选一个微小的睡前行动。数据仅保存在本机。',
      showCancel: false
    });
  };

  const showFeedback = () => {
    Taro.showModal({
      title: '反馈与建议',
      content: '如有问题或建议，请通过应用商店留言联系我们。',
      showCancel: false
    });
  };

  return (
    <View className='settingsPage'>
      <Text className='settingsTitle'>设置与管理</Text>
      <View className='settingsList'>
        <View className='settingsItem' onClick={showFeedback}>
          <Text className='settingsItemText'>反馈与建议</Text>
          <Text className='settingsItemArrow'>›</Text>
        </View>
        <View className='settingsItem' onClick={showAbout}>
          <Text className='settingsItemText'>关于阿窝睡了</Text>
          <Text className='settingsItemArrow'>›</Text>
        </View>
      </View>
      <Text className='settingsSection'>数据管理</Text>
      <View className='settingsList'>
        <View className='settingsItemDanger' onClick={handleClear}>
          <Text className='settingsItemDangerText'>清空所有数据</Text>
          <Text className='settingsItemArrow'>›</Text>
        </View>
      </View>
    </View>
  );
}
