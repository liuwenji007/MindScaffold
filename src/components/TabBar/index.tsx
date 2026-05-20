import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { resolveTabIcon, TAB_ICON_META } from './tabIcons';
import './index.scss';

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
      {TAB_ICON_META.map(tab => {
        const isActive = Boolean(currentPath?.includes(tab.key));
        return (
          <View
            key={tab.key}
            className={`tab-item ${isActive ? 'tab-item-active' : ''}`}
            onClick={() => handleTabClick(tab.path)}
          >
            <View className={`tab-icon-wrap ${isActive ? 'tab-icon-wrap-active' : ''}`}>
              <Image
                className={`tab-icon ${isActive ? 'tab-icon-active' : ''}`}
                src={resolveTabIcon(tab.key)}
                mode='aspectFit'
              />
            </View>
            <Text className={`tab-title ${isActive ? 'tab-title-active' : ''}`}>{tab.title}</Text>
          </View>
        );
      })}
    </View>
  );
}
