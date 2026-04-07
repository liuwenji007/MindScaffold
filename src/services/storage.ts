import { get, set, del, keys } from 'idb-keyval';
import type { ActionCard } from '@/types/emotion';

const CARDS_STORE_KEY = 'mindscaffold_cards';

// 保存单个卡片
export async function saveCard(card: ActionCard): Promise<void> {
  await set(`${CARDS_STORE_KEY}_${card.id}`, card);
}

// 获取单个卡片
export async function getCard(id: string): Promise<ActionCard | undefined> {
  return await get(`${CARDS_STORE_KEY}_${id}`);
}

// 获取所有卡片
export async function getAllCards(): Promise<ActionCard[]> {
  const allKeys = await keys();
  const cardKeys = allKeys.filter(k =>
    String(k).startsWith(CARDS_STORE_KEY)
  );
  const cards = await Promise.all(
    cardKeys.map(k => get<ActionCard>(k))
  );
  return cards
    .filter(Boolean)
    .sort((a, b) => b!.createdAt - a!.createdAt);
}

// 更新卡片状态
export async function updateCardStatus(
  id: string,
  status: ActionCard['status']
): Promise<void> {
  const card = await getCard(id);
  if (card) {
    await saveCard({ ...card, status });
  }
}

// 删除卡片（扔进树洞）
export async function deleteCard(id: string): Promise<void> {
  await del(`${CARDS_STORE_KEY}_${id}`);
}

// 清空所有数据
export async function clearAllData(): Promise<void> {
  const allKeys = await keys();
  const cardKeys = allKeys.filter(k =>
    String(k).startsWith(CARDS_STORE_KEY)
  );
  await Promise.all(cardKeys.map(k => del(k)));
}

// LocalStorage 操作（用于设置项）
export function saveSetting(key: string, value: string): void {
  try {
    localStorage.setItem(`ms_${key}`, value);
  } catch (e) {
    console.error('Failed to save setting:', e);
  }
}

export function getSetting(key: string): string | null {
  try {
    return localStorage.getItem(`ms_${key}`);
  } catch (e) {
    console.error('Failed to get setting:', e);
    return null;
  }
}

export function removeSetting(key: string): void {
  try {
    localStorage.removeItem(`ms_${key}`);
  } catch (e) {
    console.error('Failed to remove setting:', e);
  }
}