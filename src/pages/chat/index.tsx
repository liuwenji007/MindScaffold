import React, { useMemo, useState } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { AppIcon } from '@/components/AppIcon';
import { useEmotionStore } from '@/store/emotionStore';
import { updateAwCard } from '@/services/storage';
import type { ChatMessage } from '@/types/emotion';
import './index.scss';

const TYPING_DELAY_MS = 900;

function createDefaultMessages(seedText: string): ChatMessage[] {
  return [
    { role: 'ai', content: seedText },
    { role: 'ai', content: '如果你愿意，可以再多跟我聊聊这件事，或者我们直接开始寻找今晚的微小行动？' }
  ];
}

export default function ChatPage() {
  const draft = useEmotionStore(s => s.draft);
  const cards = useEmotionStore(s => s.cards);
  const historyChatCardId = useEmotionStore(s => s.historyChatCardId);
  const setHistoryChatCardId = useEmotionStore(s => s.setHistoryChatCardId);
  const setDraftChatHistory = useEmotionStore(s => s.setDraftChatHistory);
  const updateCard = useEmotionStore(s => s.updateCard);

  const initialMessages = useMemo(() => {
    if (historyChatCardId) {
      const target = cards.find(card => card.id === historyChatCardId);
      if (target?.chatHistory && target.chatHistory.length > 0) {
        return target.chatHistory;
      }
      return createDefaultMessages(target?.mirrorText ?? '我在这里，愿意听你继续说。');
    }
    if (draft?.mirrorText) {
      return createDefaultMessages(draft.mirrorText);
    }
    return createDefaultMessages('我在这里，愿意听你继续说。');
  }, [cards, draft?.mirrorText, historyChatCardId]);

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [scrollAnchor, setScrollAnchor] = useState('chat-anchor-top');

  const persistMessages = async (next: ChatMessage[]) => {
    if (historyChatCardId) {
      updateCard(historyChatCardId, { chatHistory: next });
      await updateAwCard(historyChatCardId, { chatHistory: next });
      return;
    }
    setDraftChatHistory(next);
  };

  const handleSend = async () => {
    const content = input.trim();
    if (!content || typing) return;
    const userMessage: ChatMessage = { role: 'user', content };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setScrollAnchor('chat-anchor-bottom');
    setInput('');
    setTyping(true);
    await persistMessages(nextMessages);

    setTimeout(async () => {
      const aiMessage: ChatMessage = {
        role: 'ai',
        content: '我在这里听着。这种感觉确实不容易，但你已经做得很好了，愿意把它表达出来。'
      };
      const merged = [...nextMessages, aiMessage];
      setMessages(merged);
      setTyping(false);
      setScrollAnchor('chat-anchor-bottom');
      await persistMessages(merged);
    }, TYPING_DELAY_MS);
  };

  const handleFinish = () => {
    if (historyChatCardId) {
      setHistoryChatCardId(null);
      Taro.navigateBack();
      return;
    }
    Taro.navigateTo({ url: '/pages/action/index' });
  };

  return (
    <View className='chat-page'>
      <View className='chat-header'>
        <View className='chat-header-left'>
          <View className='chat-header-icon-wrap'>
            <AppIcon name='wind' size={18} color='#ffb347' />
          </View>
          <Text className='chat-header-title'>阿窝对话中</Text>
        </View>
        <View className='chat-finish-btn' onClick={handleFinish}>
          <Text className='chat-finish-btn-text'>{historyChatCardId ? '返回' : '结束对话'}</Text>
        </View>
      </View>

      <ScrollView className='chat-scroll' scrollY scrollWithAnimation scrollIntoView={scrollAnchor}>
        <View className='chat-list'>
          <View id='chat-anchor-top' />
          {messages.map((item, index) => (
            <View
              key={`${item.role}-${index}`}
              className={item.role === 'user' ? 'chat-row-user' : 'chat-row-ai'}
            >
              <View className={item.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
                <Text className={item.role === 'user' ? 'chat-bubble-user-text' : 'chat-bubble-ai-text'}>
                  {item.content}
                </Text>
              </View>
            </View>
          ))}
          {typing ? (
            <View className='chat-row-ai'>
              <View className='chat-bubble-ai chat-bubble-ai-typing'>
                <View className='chat-typing-dot chat-typing-dot-one' />
                <View className='chat-typing-dot chat-typing-dot-two' />
                <View className='chat-typing-dot chat-typing-dot-three' />
              </View>
            </View>
          ) : null}
          <View id='chat-anchor-bottom' />
        </View>
      </ScrollView>

      <View className='chat-input-wrap'>
        <Input
          className='chat-input'
          value={input}
          maxlength={300}
          placeholder='再说点什么...'
          placeholderClass='chat-input-placeholder'
          onInput={event => setInput(event.detail.value)}
          onConfirm={handleSend}
        />
        <View className={`chat-send-btn ${!input.trim() ? 'chat-send-btn-disabled' : ''}`} onClick={handleSend}>
          <AppIcon name='arrowRight' size={18} color='#151921' />
        </View>
      </View>
    </View>
  );
}
