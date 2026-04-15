import React, { useState, useEffect } from 'react';
import { View, Text, Slider, Progress } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useEmotionStore } from '@/store/emotionStore';
import { DESIGN_QUESTIONS } from '@/config/designFlow';
import './index.scss';

export default function Breakdown() {
  const draft = useEmotionStore(s => s.draft);
  const cancelFlow = useEmotionStore(s => s.cancelFlow);
  const setDeconstructionAnswers = useEmotionStore(s => s.setDeconstructionAnswers);

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});

  useEffect(() => {
    if (!draft) {
      Taro.redirectTo({ url: '/pages/index/index' });
    }
  }, [draft]);

  useEffect(() => {
    if (draft?.deconstructionAnswers && Object.keys(draft.deconstructionAnswers).length > 0) {
      setAnswers(draft.deconstructionAnswers);
    }
  }, [draft?.deconstructionAnswers]);

  if (!draft) {
    return (
      <View className='breakdown-page-loading'>
        <Text>正在回到首页…</Text>
      </View>
    );
  }

  const currentQ = DESIGN_QUESTIONS[step];
  const progress = ((step + 1) / DESIGN_QUESTIONS.length) * 100;

  const handleCancel = () => {
    cancelFlow();
    Taro.navigateBack();
  };

  const handleNext = () => {
    if (step < DESIGN_QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setDeconstructionAnswers(answers);
      Taro.navigateTo({ url: '/pages/mirror/index' });
    }
  };

  const setAnswer = (patch: Record<string, unknown>) => {
    setAnswers(prev => ({ ...prev, ...patch }));
  };

  const renderBody = () => {
    if (currentQ.type === 'slider') {
      const v = Number(answers[currentQ.id] ?? 5);
      return (
        <View className='decon-slider-block'>
          <Slider
            min={currentQ.min}
            max={currentQ.max}
            step={1}
            value={v}
            activeColor='#ffb347'
            backgroundColor='rgba(255,255,255,0.1)'
            blockSize={20}
            onChange={e => setAnswer({ [currentQ.id]: String(e.detail.value) })}
          />
          <View className='decon-slider-meta'>
            <Text className='decon-meta'>{currentQ.labels[0]}</Text>
            <Text className='decon-meta'>{currentQ.labels[1]}</Text>
          </View>
        </View>
      );
    }

    if (currentQ.type === 'radio') {
      return (
        <View className='decon-grid'>
          {(currentQ.options ?? []).map(opt => (
            <View
              key={opt}
              className={`decon-option ${answers[currentQ.id] === opt ? 'decon-option-on' : ''}`}
              onClick={() => setAnswer({ [currentQ.id]: opt })}
            >
              <Text className='decon-option-text'>{opt}</Text>
            </View>
          ))}
        </View>
      );
    }

    if (currentQ.type === 'checkbox') {
      const cur = (answers[currentQ.id] as string[] | undefined) ?? [];
      return (
        <View className='decon-stack'>
          {(currentQ.options ?? []).map(opt => {
            const on = cur.includes(opt);
            return (
              <View
                key={opt}
                className={`decon-row ${on ? 'decon-row-on' : ''}`}
                onClick={() => {
                  const next = on ? cur.filter(x => x !== opt) : [...cur, opt];
                  setAnswer({ [currentQ.id]: next });
                }}
              >
                <Text className='decon-row-text'>{opt}</Text>
                {on ? <Text className='decon-check'>✓</Text> : null}
              </View>
            );
          })}
        </View>
      );
    }

    if (currentQ.type === 'sort') {
      const order = (answers[currentQ.id] as string[] | undefined) ?? [];
      return (
        <View className='decon-stack'>
          {(currentQ.options ?? []).map((opt, i) => {
            const idx = order.indexOf(opt);
            return (
              <View
                key={opt}
                className={`decon-row decon-sort-row ${idx !== -1 ? 'decon-row-on' : ''}`}
                onClick={() => {
                  const has = order.includes(opt);
                  const next = has ? order.filter(x => x !== opt) : [...order, opt];
                  setAnswer({ [currentQ.id]: next });
                }}
              >
                <View className='decon-sort-badge'>
                  <Text className='decon-sort-num'>{idx !== -1 ? idx + 1 : i + 1}</Text>
                </View>
                <Text className='decon-row-text'>{opt}</Text>
              </View>
            );
          })}
        </View>
      );
    }

    return null;
  };

  return (
    <View className='breakdown-page'>
      <View className='decon-top'>
        <View className='decon-back' onClick={handleCancel}>
          <Text className='decon-back-text'>‹</Text>
        </View>
        <View className='decon-progress-track'>
          <Progress
            percent={progress}
            strokeWidth={4}
            activeColor='#ffb347'
            backgroundColor='rgba(255,255,255,0.1)'
          />
        </View>
        <Text className='decon-step-count'>{step + 1}/{DESIGN_QUESTIONS.length}</Text>
      </View>

      <View className='question-section decon-question'>
        <Text className='decon-q-title'>{currentQ.question}</Text>
        {renderBody()}
      </View>

      <View className='nav-buttons'>
        <View className='nav-btn-next nav-btn-next-full' onClick={handleNext}>
          <Text>{step === DESIGN_QUESTIONS.length - 1 ? '完成拆解' : '下一步'}</Text>
        </View>
      </View>
    </View>
  );
}
