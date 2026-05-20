/**
 * 情绪卡片 API：新卡一律在服务端创建，本地 id 与服务端 card id 一致。
 */
import { get, patch, post } from '@/services/api';
import type { AwEmotionCard, ChatMessage } from '@/types/emotion';
import { deleteAwCard, getAwCard, saveAwCard } from '@/services/storage';

export interface ServerEmotionCard {
  id: string;
  intensity: number;
  input_text: string;
  mirror_text: string;
  emotion?: string;
  action_text: string;
  action_duration: number;
  status: string;
  deconstruction?: unknown;
  chat_history?: ChatMessage[] | string;
}

export interface CreateServerCardPayload {
  intensity: number;
  inputText: string;
  mirrorText?: string;
  emotion?: string;
  actionText?: string;
  actionDuration?: number;
  deconstruction?: Record<string, unknown>;
  chatHistory?: ChatMessage[];
}

function chatHistoryToJson(messages: ChatMessage[] | undefined): string {
  const rows = (messages ?? [])
    .filter(m => (m.role === 'user' || m.role === 'ai') && m.content.trim())
    .map(m => ({
      role: m.role === 'assistant' ? 'ai' : m.role,
      content: m.content,
    }));
  return JSON.stringify(rows);
}

export function parseDurationMinutes(duration: string): number {
  const m = duration.match(/(\d+)/);
  return m ? Number(m[1]) : 0;
}

export function mapServerChatHistory(raw: ServerEmotionCard['chat_history']): ChatMessage[] {
  if (!raw) return [];
  const list = typeof raw === 'string' ? (JSON.parse(raw) as ChatMessage[]) : raw;
  if (!Array.isArray(list)) return [];
  return list.map(m => ({
    role: m.role === 'assistant' ? 'ai' : m.role,
    content: m.content,
  }));
}

function buildCreateBody(payload: CreateServerCardPayload): Record<string, unknown> {
  return {
    intensity: payload.intensity,
    input_text: payload.inputText,
    mirror_text: payload.mirrorText ?? '',
    emotion: payload.emotion ?? '',
    action_text: payload.actionText ?? '',
    action_duration: payload.actionDuration ?? 0,
    deconstruction: JSON.stringify(payload.deconstruction ?? {}),
    chat_history: chatHistoryToJson(payload.chatHistory),
  };
}

export async function createServerCard(
  payload: CreateServerCardPayload
): Promise<string | null> {
  const res = await post<ServerEmotionCard>('/cards', buildCreateBody(payload), {
    skipErrorToast: true,
  });
  if (res.code !== 0 || !res.data?.id) {
    return null;
  }
  return res.data.id;
}

export async function patchServerCard(
  cardId: string,
  updates: Partial<{
    mirrorText: string;
    actionText: string;
    actionDuration: number;
    chatHistory: ChatMessage[];
    deconstruction: Record<string, unknown>;
    status: string;
  }>
): Promise<boolean> {
  const body: Record<string, unknown> = {};
  if (updates.mirrorText !== undefined) body.mirror_text = updates.mirrorText;
  if (updates.actionText !== undefined) body.action_text = updates.actionText;
  if (updates.actionDuration !== undefined) body.action_duration = updates.actionDuration;
  if (updates.chatHistory !== undefined) body.chat_history = chatHistoryToJson(updates.chatHistory);
  if (updates.deconstruction !== undefined) {
    body.deconstruction = JSON.stringify(updates.deconstruction);
  }
  if (updates.status !== undefined) body.status = updates.status;

  const res = await patch<ServerEmotionCard>(`/cards/${cardId}`, body, { skipErrorToast: true });
  return res.code === 0;
}

export async function getServerCard(cardId: string): Promise<ServerEmotionCard | null> {
  const res = await get<ServerEmotionCard>(`/cards/${cardId}`, undefined, { skipErrorToast: true });
  if (res.code !== 0 || !res.data?.id) {
    return null;
  }
  return res.data;
}

/** 将本地仅 idb 存在的旧卡迁移到服务端，并替换本地 id。 */
export async function migrateLocalCardToServer(local: AwEmotionCard): Promise<string | null> {
  const serverId = await createServerCard({
    intensity: local.intensity,
    inputText: local.input,
    mirrorText: local.mirrorText,
    emotion: local.emotion ?? '',
    actionText: local.action,
    actionDuration: parseDurationMinutes(local.duration),
    deconstruction: local.deconstructionAnswers,
    chatHistory: local.chatHistory,
  });
  if (!serverId || serverId === local.id) {
    return serverId;
  }

  const migrated: AwEmotionCard = { ...local, id: serverId };
  await saveAwCard(migrated);
  if (local.id !== serverId) {
    await deleteAwCard(local.id);
  }
  return serverId;
}

/**
 * 确保存在服务端卡片 id：已有则 GET；本地旧卡则迁移；否则创建。
 */
export async function ensureServerCardId(opts: {
  cardId: string | null;
  create?: CreateServerCardPayload;
  localCard?: AwEmotionCard;
}): Promise<string | null> {
  const { cardId, create, localCard } = opts;

  if (cardId) {
    const existing = await getServerCard(cardId);
    if (existing?.id) {
      return existing.id;
    }
    const local = localCard ?? (await getAwCard(cardId));
    if (local) {
      return migrateLocalCardToServer(local);
    }
    return null;
  }

  if (create) {
    return createServerCard(create);
  }

  return null;
}
