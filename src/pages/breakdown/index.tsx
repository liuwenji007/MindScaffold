import React, { useState, useEffect } from 'react';
import { View, Text, Button, Progress } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useEmotionStore } from '@/store/emotionStore';
import { getQuestionSteps, formatAnswersAsPrompt } from '@/config/questions';
import type { QuestionStep } from '@/config/questions';
import QuestionSlider from '@/components/QuestionSlider';
import QuestionSelect from '@/components/QuestionSelect';
import QuestionSort from '@/components/QuestionSort';
import './index.scss';

export default function Breakdown() {
  const currentEntry = useEmotionStore(s => s.currentEntry);
  const setBreakdown = useEmotionStore(s => s.setBreakdown);

  const [currentStep, setCurrentStep] = useState(0);
  const [questions, setQuestions] = useState<QuestionStep[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!currentEntry) {
      Taro.redirectTo({ url: '/pages/index/index' });
      return;
    }
    // 根据情绪类型加载问题
    const steps = getQuestionSteps(currentEntry.emotion);
    setQuestions(steps);
  }, [currentEntry]);

  const handleAnswer = (value: any) => {
    if (!questions[currentStep]) return;
    const questionId = questions[currentStep].id;
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const getCurrentAnswer = () => {
    if (!questions[currentStep]) return undefined;
    return answers[questions[currentStep].id];
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    if (!currentEntry) return;

    // 将回答整理成提示词
    const contextPrompt = formatAnswersAsPrompt(answers, currentEntry.emotion);

    // 构建拆解结果
    const breakdown = {
      entryId: currentEntry.id,
      causes: Object.entries(answers)
        .filter(([key]) => key === 'attribution')
        .flatMap(([, value]) => Array.isArray(value) ? value.map(v => ({
          id: `cause_${v}`,
          text: v,
          source: 'user' as const
        })) : []),
      priority: answers.impact_sort || [],
      contextPrompt // 添加到提示词
    };

    setBreakdown(breakdown);

    // 跳转到镜像重述页，携带提示词
    Taro.navigateTo({
      url: `/pages/mirror/index?context=${encodeURIComponent(contextPrompt)}`
    });
  };

  const renderQuestion = () => {
    if (questions.length === 0) return null;

    const question = questions[currentStep];
    const currentAnswer = getCurrentAnswer();

    switch (question.type) {
      case 'slider':
        return (
          <QuestionSlider
            question={question.question}
            min={question.min}
            max={question.max}
            label={question.label}
            value={currentAnswer as number}
            onChange={handleAnswer}
          />
        );

      case 'single':
        return (
          <QuestionSelect
            question={question.question}
            options={question.options || []}
            type='single'
            value={currentAnswer as string}
            onChange={handleAnswer}
          />
        );

      case 'multi':
        return (
          <QuestionSelect
            question={question.question}
            options={question.options || []}
            type='multi'
            value={currentAnswer as string[]}
            onChange={handleAnswer}
          />
        );

      case 'sort':
        return (
          <QuestionSort
            question={question.question}
            options={question.options || []}
            value={currentAnswer as string[]}
            onChange={handleAnswer}
          />
        );

      default:
        return null;
    }
  };

  const progress = questions.length > 0 ? ((currentStep + 1) / questions.length) * 100 : 0;
  const isLastStep = currentStep === questions.length - 1;

  if (questions.length === 0) {
    return (
      <View className='breakdown-page-loading'>
        <Text>阿窝正在整理今晚的小问题...</Text>
      </View>
    );
  }

  return (
    <View className='breakdown-page'>
      {/* 进度条 */}
      <View className='progress-section'>
        <Progress
          percent={progress}
          strokeWidth={4}
          activeColor='#81b29a'
          backgroundColor='#e0e0e0'
        />
        <Text className='progress-text'>
          阿窝帮你理一理：第 {currentStep + 1} / {questions.length} 步
        </Text>
      </View>

      {/* 情绪标签 */}
      <View className='emotion-tag-section'>
        <Text className='emotion-tag'>今晚的感受：{currentEntry?.emotion}</Text>
      </View>

      {/* 问题区域 */}
      <View className='question-section'>
        {renderQuestion()}
      </View>

      {/* 导航按钮 */}
      <View className='nav-buttons'>
        {currentStep > 0 && (
          <View className='nav-btn-prev' onClick={handlePrev}>
            <Text>退回上一小步</Text>
          </View>
        )}
        <View className={`nav-btn-next ${currentStep === 0 ? 'nav-btn-next-full' : ''}`} onClick={handleNext}>
          <Text>{isLastStep ? '收好这份整理' : '继续下一小步'}</Text>
        </View>
      </View>

      {/* 跳过提示 */}
      <View className='skip-section'>
        <Text className='skip-text' onClick={() => handleComplete()}>
          先跳过，直接去镜像重述
        </Text>
      </View>
    </View>
  );
}