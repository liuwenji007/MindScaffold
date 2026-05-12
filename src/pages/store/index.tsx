import React, { useEffect, useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useEmotionStore } from '@/store/emotionStore';
import { get as apiGet, post as apiPost } from '@/services/api';
import './index.scss';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  item_type: string;
  asset_url?: string;
}

export default function StorePage() {
  const points = useEmotionStore(s => s.emotionPoints);
  const setEmotionPoints = useEmotionStore(s => s.setEmotionPoints);
  const [items, setItems] = useState<ShopItem[]>([]);

  useEffect(() => {
    void (async () => {
      const res = await apiGet<{ items: ShopItem[] }>('/store/items');
      if (res.data?.items) {
        setItems(res.data.items);
      }
    })();
  }, []);

  const handlePurchase = async (item: ShopItem) => {
    if (points < item.price) {
      Taro.showToast({ title: '情绪点不足', icon: 'none' });
      return;
    }

    const res = await apiPost('/store/purchase', { item_id: item.id });
    if (res.error) {
      Taro.showToast({ title: res.error, icon: 'none' });
      return;
    }

    setEmotionPoints(points - item.price);
    Taro.showToast({ title: `已兑换「${item.name}」`, icon: 'success' });
  };

  return (
    <View className='storePage'>
      <View className='storeHeader'>
        <Text className='storeTitle'>被窝商店</Text>
        <Text className='storePoints'>{points} 点</Text>
      </View>

      <View className='storeList'>
        {items.map(item => (
          <View key={item.id} className='storeItem'>
            <View className='storeItemMain'>
              <Text className='storeItemName'>{item.name}</Text>
              <Text className='storeItemDesc'>{item.description}</Text>
            </View>
            <View
              className={points >= item.price ? 'storePriceBtn' : 'storePriceBtn storePriceBtnDisabled'}
              onClick={() => handlePurchase(item)}
            >
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
