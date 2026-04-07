import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.scss';

const TABS = [
  { key: 'index', title: '首页', icon: '🏠', path: '/pages/index/index' },
  { key: 'history', title: '历史', icon: '📜', path: '/pages/history/index' },
  { key: 'profile', title: '我的', icon: '👤', path: '/pages/profile/index' }
];

interface TabBarProps {
  current?: string;
}

export default function TabBar({ current }: TabBarProps) {
  const currentPath = current || Taro.getCurrentInstance().router?.path;

  const handleTabClick = (path: string) => {
    Taro.switchTab({ url: path });
  };

  return (
    <View className='tab-bar'>
      {TABS.map(tab => {
        const isActive = currentPath?.includes(tab.key);
        return (
          <View
            key={tab.key}
            className={`tab-item ${isActive ? 'tab-item-active' : ''}`}
            onClick={() => handleTabClick(tab.path)}
          >
            <Text className={`tab-icon ${isActive ? 'tab-icon-active' : ''}`}>{tab.icon}</Text>
            <Text className={`tab-title ${isActive ? 'tab-title-active' : ''}`}>{tab.title}</Text>
          </View>
        );
      })}
    </View>
  );
}