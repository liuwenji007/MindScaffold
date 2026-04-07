import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { clearAllData } from '@/services/storage';
import TabBar from '@/components/TabBar';
import './index.scss';

export default function Profile() {
  const handleClearData = () => {
    Taro.showModal({
      title: '确认清空',
      content: '确定要清空所有情绪记录吗？此操作不可撤销。',
      confirmText: '确认清空',
      confirmColor: '#e07a5f',
      success: async (res) => {
        if (res.confirm) {
          await clearAllData();
          Taro.showToast({
            title: '已清空所有数据',
            icon: 'success'
          });
        }
      }
    });
  };

  const handleFeedback = () => {
    Taro.showModal({
      title: '反馈建议',
      content: '如有问题或建议，请联系：feedback@mindscaffold.app',
      showCancel: false
    });
  };

  return (
    <View className='profile-page'>
      {/* 头部 */}
      <View className='header'>
        <Text className='title'>MindScaffold</Text>
        <Text className='subtitle'>心智脚手架</Text>
      </View>

      {/* 功能列表 */}
      <View className='menu-list'>
        <View className='menu-item' onClick={handleFeedback}>
          <Text className='menu-text'>反馈建议</Text>
          <Text className='menu-arrow'>→</Text>
        </View>

        <View className='menu-item'>
          <Text className='menu-text'>版本</Text>
          <Text className='menu-value'>v1.0.0</Text>
        </View>
      </View>

      {/* 数据管理 */}
      <View className='section-title'>
        <Text className='section-title-text'>数据管理</Text>
      </View>
      <View className='menu-list'>
        <View className='menu-item-danger' onClick={handleClearData}>
          <Text className='menu-text'>清空所有记录</Text>
          <Text className='menu-arrow'>→</Text>
        </View>
      </View>

      {/* 声明 */}
      <View className='disclaimer-section'>
        <Text className='disclaimer-title'>重要声明</Text>
        <Text className='disclaimer-text'>
          本产品不替代专业心理咨询或治疗。如有严重情绪问题，请寻求专业帮助。
        </Text>
        <Text className='disclaimer-text'>
          您的所有数据仅存储在本地设备，我们不会收集或上传您的个人信息。
        </Text>
      </View>

      {/* 底部 */}
      <View className='footer'>
        <Text className='footer-text'>© 2026 MindScaffold</Text>
        <Text className='footer-text'>用心呵护每一份情绪</Text>
      </View>

      {/* 底部导航 */}
      <TabBar current='profile' />
    </View>
  );
}