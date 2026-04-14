import React, { useState } from 'react';
import { View, Text, Slider } from '@tarojs/components';
import './index.scss';

interface QuestionSliderProps {
  question: string;
  min?: number;
  max?: number;
  label?: { min: string; max: string };
  value?: number;
  onChange?: (value: number) => void;
}

export default function QuestionSlider({
  question,
  min = 0,
  max = 100,
  label,
  value = 50,
  onChange
}: QuestionSliderProps) {
  const [currentValue, setCurrentValue] = useState(value);

  const handleChange = (e) => {
    const val = e.detail.value;
    setCurrentValue(val);
    onChange?.(val);
  };

  return (
    <View className='question-slider'>
      <Text className='question-text'>{question}</Text>
      <Text className='question-hint'>拖动到你此刻最接近的位置就好。</Text>

      <View className='slider-container'>
        <View className='slider-labels'>
          <Text className='label-min'>{label?.min || min}</Text>
          <Text className='label-value'>{currentValue}%</Text>
          <Text className='label-max'>{label?.max || max}</Text>
        </View>
        <Slider
          className='slider'
          min={min}
          max={max}
          value={currentValue}
          onChange={handleChange}
          activeColor='#81b29a'
          backgroundColor='#e0e0e0'
          blockSize={20}
        />
      </View>
    </View>
  );
}