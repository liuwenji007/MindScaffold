import React, { useMemo, useState, useRef } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { AppIcon } from '@/components/AppIcon';
import { useEmotionStore } from '@/store/emotionStore';
import { updateAwCard } from '@/services/storage';
import { API } from '@/config/api';
import { getToken } from '@/services/auth';
import type { ChatMessage } from '@/types/emotion';
import './index.scss';

// —— SSE 流式读取 ——
async function streamChat(
  cardId: string | null,
  messages: ChatMessage[]
): Promise<string> {
  const token = getToken();

  const response = await fetch(`${API.V1}/chat/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      card_id: cardId,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || '对话请求失败');
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('不支持流式读取');
  }

  const decoder = new TextDecoder();
  let fullText = '';
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') continue;
        try {
          // SSE format: event: message\ndata: "chunk text"\n\n
          // Gin SSEvent writes: "event: message\ndata: chunk\n\n"
          // Try to parse as JSON string or use directly
          const cleaned = data.replace(/^"|"$/g, '');
          fullText += cleaned;
        } catch {
          fullText += data;
        }
      }
    }
  }

  return fullText || '阿窝正在思考…';
}

// —— 后备文案 ——
const FALLBACK_RESPONSE = '我在这里听着。这种感觉确实不容易，但你已经做得很好了，愿意把它表达出来。';

function createDefaultMessages(seedText: string): ChatMessage[] {
  return [
    { role: 'ai', content: seedText },
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
  const streamRef = useRef(false);

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
    streamRef.current = true;
    await persistMessages(nextMessages);

    try {
      const aiContent = await streamChat(historyChatCardId, [userMessage]);
      if (!streamRef.current) return; // 用户已离开

      const aiMessage: ChatMessage = { role: 'ai', content: aiContent };
      const merged = [...nextMessages, aiMessage];
      setMessages(merged);
      await persistMessages(merged);
    } catch {
      if (!streamRef.current) return;
      const aiMessage: ChatMessage = { role: 'ai', content: FALLBACK_RESPONSE };
      const merged = [...nextMessages, aiMessage];
      setMessages(merged);
      await persistMessages(merged);
    } finally {
      setTyping(false);
      setScrollAnchor('chat-anchor-bottom');
    }
  };

  const handleFinish = () => {
    streamRef.current = false;
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
