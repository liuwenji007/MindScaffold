import React from 'react';
import { View, Text } from '@tarojs/components';

export type FilterKey = 'all' | 'pending' | 'completed';

interface HistoryFilterProps {
  value: FilterKey;
  onChange: (key: FilterKey) => void;
}

const FILTERS: FilterKey[] = ['all', 'pending', 'completed'];

function labelOf(key: FilterKey): string {
  if (key === 'all') return '全部';
  if (key === 'pending') return '待办';
  return '已成';
}

export function HistoryFilter({ value, onChange }: HistoryFilterProps) {
  return (
    <View className='historyFilterWrap'>
      {FILTERS.map(item => (
        <View
          key={item}
          className={value === item ? 'historyFilterItem historyFilterItemOn' : 'historyFilterItem'}
          onClick={() => onChange(item)}
        >
          <Text className={value === item ? 'historyFilterText historyFilterTextOn' : 'historyFilterText'}>
            {labelOf(item)}
          </Text>
        </View>
      ))}
    </View>
  );
}
