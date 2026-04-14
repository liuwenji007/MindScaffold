import React from 'react';
import { View, Text } from '@tarojs/components';
import './index.scss';

interface QuestionSelectProps {
  question: string;
  options: string[];
  type: 'single' | 'multi';
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
}

export default function QuestionSelect({
  question,
  options,
  type,
  value,
  onChange
}: QuestionSelectProps) {
  const selectedValue = value || (type === 'multi' ? [] : '');

  const isSelected = (option: string): boolean => {
    if (type === 'multi') {
      return Array.isArray(selectedValue) && selectedValue.includes(option);
    }
    return selectedValue === option;
  };

  const handleSelect = (option: string) => {
    if (type === 'single') {
      onChange?.(option);
    } else {
      const current = Array.isArray(selectedValue) ? [...selectedValue] : [];
      const index = current.indexOf(option);
      if (index > -1) {
        current.splice(index, 1);
      } else {
        current.push(option);
      }
      onChange?.(current);
    }
  };

  return (
    <View className='question-select'>
      <Text className='question-text'>{question}</Text>
      {type === 'multi' && (
        <Text className='hint'>（可以多选，先选最贴近的几项；已选 {Array.isArray(selectedValue) ? selectedValue.length : 0} 项）</Text>
      )}

      <View className='options-grid'>
        {options.map(option => (
          <View
            key={option}
            className={`option-item ${isSelected(option) ? 'option-item-selected' : ''}`}
            onClick={() => handleSelect(option)}
          >
            <Text className={`option-text ${isSelected(option) ? 'option-text-selected' : ''}`}>{option}</Text>
            {isSelected(option) && <Text className='check-mark'>✓</Text>}
          </View>
        ))}
      </View>
    </View>
  );
}