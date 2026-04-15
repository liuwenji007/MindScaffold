import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { AppIcon } from '@/components/AppIcon';
import './index.scss';

const ACCENT = '#ffb347';
const MUTED = '#94a3b8';

const TABS = [
  { key: 'index', title: '首页', icon: 'home' as const, path: '/pages/index/index' },
  { key: 'history', title: '历史', icon: 'history' as const, path: '/pages/history/index' },
  { key: 'profile', title: '我的', icon: 'user' as const, path: '/pages/profile/index' }
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
        const isActive = Boolean(currentPath?.includes(tab.key));
        const color = isActive ? ACCENT : MUTED;
        return (
          <View
            key={tab.key}
            className={`tab-item ${isActive ? 'tab-item-active' : ''}`}
            onClick={() => handleTabClick(tab.path)}
          >
            <View className={`tab-icon-wrap ${isActive ? 'tab-icon-wrap-active' : ''}`}>
              <AppIcon name={tab.icon} size={22} color={color} />
            </View>
            <Text className={`tab-title ${isActive ? 'tab-title-active' : ''}`}>{tab.title}</Text>
          </View>
        );
      })}
    </View>
  );
}
