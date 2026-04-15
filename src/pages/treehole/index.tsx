import React, { useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.scss';

/**
 * 树洞仪式已合并到「历史」详情中的「放进树洞」。
 * 保留路由以便旧链接跳转，进入后自动回到历史页。
 */
export default function Treehole() {
  useEffect(() => {
    Taro.redirectTo({ url: '/pages/history/index' });
  }, []);

  return (
    <View className='treehole-page'>
      <Text className='treehole-redirect-hint'>正在前往情绪存档…</Text>
    </View>
  );
}
