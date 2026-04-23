import React from 'react';
import { View, Text } from '@tarojs/components';
import { useEmotionStore } from '@/store/emotionStore';
import './index.scss';

const SKINS = [
  { id: 'skin-1', name: '午夜星空', price: 100, desc: '深邃的星空主题' },
  { id: 'skin-2', name: '晨曦微光', price: 150, desc: '温暖的日出主题' },
  { id: 'skin-3', name: '森林秘境', price: 200, desc: '宁静的森林主题' }
];

export default function StorePage() {
  const points = useEmotionStore(s => s.emotionPoints);

  return (
    <View className='storePage'>
      <View className='storeHeader'>
        <Text className='storeTitle'>被窝商店</Text>
        <Text className='storePoints'>{points} 点</Text>
      </View>

      <View className='storeList'>
        {SKINS.map(item => (
          <View key={item.id} className='storeItem'>
            <View className='storeItemMain'>
              <Text className='storeItemName'>{item.name}</Text>
              <Text className='storeItemDesc'>{item.desc}</Text>
            </View>
            <View className={points >= item.price ? 'storePriceBtn' : 'storePriceBtn storePriceBtnDisabled'}>
              <Text className={points >= item.price ? 'storePriceBtnText' : 'storePriceBtnTextDisabled'}>
                {item.price} 点
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
