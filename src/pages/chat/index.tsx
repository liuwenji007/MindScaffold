import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { View, Text, Textarea, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { AppIcon } from '@/components/AppIcon';
import IpHeadSprite from '@/components/IpHeadSprite';
import { useEmotionStore } from '@/store/emotionStore';
import { updateAwCard } from '@/services/storage';
import { ensureChatSession, syncChatMessagesFromServer } from '@/services/chatSession';
import { API } from '@/config/api';
import { getToken } from '@/services/auth';
import type { ChatMessage } from '@/types/emotion';
import './index.scss';

// —— SSE：解析单行 data 字段（兼容 Gin SSEvent、CRLF、上游 OpenAI JSON 行） ——
function parseSseDataPayload(raw: string): string {
  const t = raw.replace(/\r$/, '');
  if (t === '[DONE]' || t.trim() === '[DONE]') return '';
  const trimmed = t.trimStart();
  if (trimmed.startsWith('{')) {
    try {
      const o = JSON.parse(trimmed) as {
        choices?: Array<{ delta?: { content?: string } }>;
      };
      return o.choices?.[0]?.delta?.content ?? '';
    } catch {
      /* 非 JSON 则按纯文本处理 */
    }
  }
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    try {
      const s = JSON.parse(trimmed);
      return typeof s === 'string' ? s : '';
    } catch {
      /* fallthrough */
    }
  }
  return t.replace(/^"|"$/g, '');
}

function consumeSseLine(line: string, onPiece: (piece: string) => void): void {
  const s = line.replace(/\r$/, '');
  const m = s.match(/^\s*data:\s*(.*)$/);
  if (!m) return;
  const payload = m[1];
  if (payload === '[DONE]' || payload.trim() === '[DONE]') return;
  const piece = parseSseDataPayload(payload);
  if (piece) onPiece(piece);
}

// —— SSE 流式读取（结束时必须处理 buffer 残留行，否则最后一帧常丢失） ——
async function streamChat(
  sessionId: string,
  content: string,
  onDelta?: (accumulated: string) => void
): Promise<string> {
  const token = getToken();

  const response = await fetch(`${API.V1}/chat/stream`, {
    method: 'POST',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      session_id: sessionId,
      content,
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

  const append = (piece: string) => {
    fullText += piece;
    onDelta?.(fullText);
  };

  while (true) {
    const { done, value } = await reader.read();
    if (value?.length) {
      buffer += decoder.decode(value, { stream: !done });
    }

    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';
    for (const line of lines) {
      consumeSseLine(line, append);
    }

    if (done) {
      buffer += decoder.decode();
      for (const line of buffer.split('\n')) {
        consumeSseLine(line, append);
      }
      break;
    }
  }

  return fullText;
}

// —— 后备文案 ——
const FALLBACK_RESPONSE = '我在这里听着。这种感觉确实不容易，但你已经做得很好了，愿意把它表达出来。';

function createDefaultMessages(seedText: string): ChatMessage[] {
  return [
    { role: 'ai', content: seedText },
  ];
}

export default function ChatPage() {
  const cards = useEmotionStore(s => s.cards);
  const draft = useEmotionStore(s => s.draft);
  const historyChatCardId = useEmotionStore(s => s.historyChatCardId);
  const setHistoryChatCardId = useEmotionStore(s => s.setHistoryChatCardId);
  const setDraftChatHistory = useEmotionStore(s => s.setDraftChatHistory);
  const setDraftCardId = useEmotionStore(s => s.setDraftCardId);
  const updateCard = useEmotionStore(s => s.updateCard);
  const replaceCardId = useEmotionStore(s => s.replaceCardId);

  const initialMessages = useMemo(() => {
    if (historyChatCardId) {
      const target = cards.find(card => card.id === historyChatCardId);
      if (target?.chatHistory && target.chatHistory.length > 0) {
        return target.chatHistory;
      }
      return createDefaultMessages(target?.mirrorText ?? '我在这里，愿意听你继续说。');
    }
    return createDefaultMessages('我在这里，愿意听你继续说。');
  }, [cards, historyChatCardId]);

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  /** 阿窝正在输出（含流式），用于左上角 ip-head 说话动画 */
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [scrollIntoViewId, setScrollIntoViewId] = useState('');
  const [scrollTop, setScrollTop] = useState(0);
  const streamRef = useRef(false);
  const sessionIdRef = useRef<string | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  /** 仅进入页面时拉一次服务端历史，避免发送后因 store 更新重复 sync 覆盖乐观 UI */
  const sessionBootstrapKeyRef = useRef<string | null>(null);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;
  /** 首页带入的首句只自动发送一次 */
  const initialHomeInputSentRef = useRef(false);

  const scrollToBottom = useCallback(() => {
    Taro.nextTick(() => {
      setTimeout(() => {
        const query = Taro.createSelectorQuery();
        query.select('#chat-list').boundingClientRect();
        query.exec(res => {
          const height = res?.[0]?.height;
          if (typeof height === 'number' && height > 0) {
            setScrollTop(prev => (prev === height ? height + 1 : height));
          }
        });
        setScrollIntoViewId('');
        Taro.nextTick(() => setScrollIntoViewId('chat-anchor-bottom'));
      }, 32);
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing, scrollToBottom]);

  useEffect(() => {
    const bootstrapKey = historyChatCardId ?? '__draft__';
    if (sessionBootstrapKeyRef.current === bootstrapKey) {
      return;
    }
    sessionBootstrapKeyRef.current = bootstrapKey;
    sessionIdRef.current = null;
    setSessionReady(false);

    let cancelled = false;
    (async () => {
      const state = useEmotionStore.getState();
      const currentDraft = state.draft;
      const currentCards = state.cards;
      const seedMessages = historyChatCardId
        ? (() => {
            const target = currentCards.find(c => c.id === historyChatCardId);
            if (target?.chatHistory?.length) return target.chatHistory;
            return createDefaultMessages(
              target?.mirrorText ?? '我在这里，愿意听你继续说。'
            );
          })()
        : createDefaultMessages('我在这里，愿意听你继续说。');

      const candidateId = historyChatCardId ?? currentDraft?.cardId ?? null;
      const localCard = historyChatCardId
        ? currentCards.find(c => c.id === historyChatCardId)
        : undefined;

      const id = await ensureChatSession({
        cardId: candidateId,
        initialHistory: seedMessages,
        draft: currentDraft
          ? {
              input: currentDraft.input,
              intensity: currentDraft.intensity,
              deconstruction: currentDraft.deconstructionAnswers,
            }
          : null,
        localCard,
      });

      if (cancelled || !id) {
        if (!cancelled) setSessionReady(false);
        return;
      }

      sessionIdRef.current = id;

      if (historyChatCardId && id !== historyChatCardId && localCard) {
        replaceCardId(historyChatCardId, id, localCard);
        setHistoryChatCardId(id);
      } else if (!historyChatCardId && currentDraft && id !== currentDraft.cardId) {
        setDraftCardId(id);
      }

      const serverMsgs = await syncChatMessagesFromServer(id);
      if (!cancelled && !streamRef.current) {
        setMessages(serverMsgs.length > 0 ? serverMsgs : seedMessages);
        setSessionReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [historyChatCardId, replaceCardId, setDraftCardId, setHistoryChatCardId]);

  const persistMessages = useCallback(async (next: ChatMessage[]) => {
    const state = useEmotionStore.getState();
    if (!state.historyChatCardId) {
      setDraftChatHistory(next);
    }
    const cacheId =
      state.historyChatCardId ?? state.draft?.cardId ?? sessionIdRef.current;
    if (cacheId) {
      updateCard(cacheId, { chatHistory: next });
      await updateAwCard(cacheId, { chatHistory: next });
    }
  }, [setDraftChatHistory, updateCard]);

  const sendMessage = useCallback(
    async (rawContent: string) => {
      const content = rawContent.trim();
      if (!content || typing) return;

      const state = useEmotionStore.getState();

      if (!sessionIdRef.current) {
        const id = await ensureChatSession({
          cardId: state.historyChatCardId ?? state.draft?.cardId ?? null,
          initialHistory: messagesRef.current,
          draft: state.draft
            ? {
                input: state.draft.input,
                intensity: state.draft.intensity,
                deconstruction: state.draft.deconstructionAnswers,
              }
            : null,
          localCard: state.historyChatCardId
            ? state.cards.find(c => c.id === state.historyChatCardId)
            : undefined,
        });
        if (!id) {
          Taro.showToast({ title: '会话初始化失败，请稍后重试', icon: 'none' });
          return;
        }
        sessionIdRef.current = id;
        if (!state.historyChatCardId && state.draft) {
          setDraftCardId(id);
        }
        setSessionReady(true);
      }

      const base = messagesRef.current;
      const userMessage: ChatMessage = { role: 'user', content };
      const nextMessages = [...base, userMessage];
      setMessages(nextMessages);
      setInput('');
      setTyping(true);
      setAiSpeaking(true);
      streamRef.current = true;
      await persistMessages(nextMessages);

      try {
        const onDelta = (acc: string) => {
          if (!streamRef.current) return;
          if (acc.length > 0) setTyping(false);
          setMessages(prev => {
            const head =
              prev.length >= nextMessages.length &&
              prev[prev.length - 1]?.role === 'user' &&
              prev[prev.length - 1]?.content === content
                ? prev
                : nextMessages;
            const withoutPartialAi =
              head.length > 0 && head[head.length - 1]?.role === 'ai'
                ? head.slice(0, -1)
                : head;
            return [...withoutPartialAi, { role: 'ai', content: acc }];
          });
        };

        const aiContent = await streamChat(sessionIdRef.current!, content, onDelta);
        if (!streamRef.current) return;

        const text = aiContent.trim() ? aiContent : FALLBACK_RESPONSE;
        const aiMessage: ChatMessage = { role: 'ai', content: text };
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
        setAiSpeaking(false);
      }
    },
    [typing, persistMessages, setDraftCardId]
  );

  /** 首页「和阿窝聊聊」填写的可选内容，进入对话后作为首条用户消息发出 */
  useEffect(() => {
    if (!sessionReady || historyChatCardId || initialHomeInputSentRef.current) {
      return;
    }
    const homeInput = draft?.input?.trim();
    if (!homeInput) return;
    if (messages.some(m => m.role === 'user')) {
      initialHomeInputSentRef.current = true;
      return;
    }
    initialHomeInputSentRef.current = true;
    void sendMessage(homeInput);
  }, [sessionReady, historyChatCardId, draft?.input, messages, sendMessage]);

  const handleSend = () => {
    void sendMessage(input);
  };

  const handleFinish = () => {
    streamRef.current = false;
    setAiSpeaking(false);
    setTyping(false);
    if (historyChatCardId) {
      setHistoryChatCardId(null);
      Taro.navigateBack();
      return;
    }
    Taro.navigateTo({ url: '/pages/mirror/index' });
  };

  return (
    <View className='chat-page'>
      <View className='chat-header'>
        <View className='chat-header-left'>
          <IpHeadSprite speaking={aiSpeaking} size={72} className='chat-header-ip' />
          <Text className='chat-header-title'>阿窝对话中</Text>
        </View>
        <View className='chat-finish-btn' onClick={handleFinish}>
          <Text className='chat-finish-btn-text'>{historyChatCardId ? '返回' : '结束对话'}</Text>
        </View>
      </View>

      <ScrollView
        id='chat-scroll'
        className='chat-scroll'
        scrollY
        scrollWithAnimation
        scrollIntoView={scrollIntoViewId}
        scrollTop={scrollTop}
      >
        <View id='chat-list' className='chat-list'>
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
                <View className='chat-typing-dots' aria-hidden>
                  <View className='chat-typing-dot' />
                  <View className='chat-typing-dot' />
                  <View className='chat-typing-dot' />
                </View>
              </View>
            </View>
          ) : null}
          <View id='chat-anchor-bottom' />
        </View>
      </ScrollView>

      <View className='chat-input-wrap'>
        <View className='chat-textarea-shell'>
          <Textarea
            className='chat-textarea'
            value={input}
            maxlength={300}
            showConfirmBar={false}
            placeholder='再说点什么...'
            placeholderClass='chat-textarea-placeholder'
            onInput={event => setInput(event.detail.value)}
          />
        </View>
        <View
          className={`chat-send-btn ${!input.trim() || !sessionReady ? 'chat-send-btn-disabled' : ''}`}
          onClick={handleSend}
        >
          <AppIcon name='arrowRight' size={22} color='#151921' />
        </View>
      </View>
    </View>
  );
}
