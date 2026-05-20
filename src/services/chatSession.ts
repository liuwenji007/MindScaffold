/**
 * 聊天会话 = 服务端 emotion card；session_id 与 card id 相同。
 */
import {
  ensureServerCardId,
  getServerCard,
  mapServerChatHistory,
  type CreateServerCardPayload,
} from '@/services/cardApi';
import type { AwEmotionCard, ChatMessage } from '@/types/emotion';

export { mapServerChatHistory };

export async function ensureChatSession(opts: {
  cardId: string | null;
  initialHistory: ChatMessage[];
  draft?: { input?: string; intensity?: number; deconstruction?: Record<string, unknown> } | null;
  localCard?: AwEmotionCard;
}): Promise<string | null> {
  const create: CreateServerCardPayload | undefined =
    !opts.cardId && opts.draft
      ? {
          intensity: opts.draft.intensity ?? 5,
          inputText: opts.draft.input ?? '',
          deconstruction: opts.draft.deconstruction,
          chatHistory: opts.initialHistory,
        }
      : undefined;

  return ensureServerCardId({
    cardId: opts.cardId,
    create,
    localCard: opts.localCard,
  });
}

export async function syncChatMessagesFromServer(cardId: string): Promise<ChatMessage[]> {
  const card = await getServerCard(cardId);
  return mapServerChatHistory(card?.chat_history);
}
