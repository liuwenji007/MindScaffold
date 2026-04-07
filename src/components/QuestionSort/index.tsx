import React, { useState, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import './index.scss';

interface QuestionSortProps {
  question: string;
  options: string[];
  value?: string[];
  onChange?: (value: string[]) => void;
}

export default function QuestionSort({
  question,
  options,
  value,
  onChange
}: QuestionSortProps) {
  const [sortedOptions, setSortedOptions] = useState<string[]>(value || options);

  useEffect(() => {
    if (value) {
      setSortedOptions(value);
    }
  }, [value]);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...sortedOptions];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    setSortedOptions(newOrder);
    onChange?.(newOrder);
  };

  const moveDown = (index: number) => {
    if (index === sortedOptions.length - 1) return;
    const newOrder = [...sortedOptions];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    setSortedOptions(newOrder);
    onChange?.(newOrder);
  };

  return (
    <View className='question-sort'>
      <Text className='question-text'>{question}</Text>
      <Text className='hint'>（点击箭头调整顺序，第一项影响最大）</Text>

      <View className='sort-list'>
        {sortedOptions.map((option, index) => (
          <View key={option} className='sort-item'>
            <View className='rank-badge'>
              <Text className='rank-num'>{index + 1}</Text>
            </View>
            <View className='item-content'>
              <Text className='item-text'>{option}</Text>
            </View>
            <View className='item-actions'>
              <View
                className={`action-btn ${index === 0 ? 'action-btn-disabled' : ''}`}
                onClick={() => moveUp(index)}
              >
                <Text>↑</Text>
              </View>
              <View
                className={`action-btn ${index === sortedOptions.length - 1 ? 'action-btn-disabled' : ''}`}
                onClick={() => moveDown(index)}
              >
                <Text>↓</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}