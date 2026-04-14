import { get, set, del, keys } from 'idb-keyval';
import type { ActionCard } from '@/types/emotion';

const CARDS_STORE_KEY = 'awoshuile_cards';
const LEGACY_CARDS_STORE_KEY = 'mindscaffold_cards';
const SETTING_PREFIX = 'awo_';
const LEGACY_SETTING_PREFIX = 'ms_';

function getCardStorageKey(prefix: string, id: string): string {
  return `${prefix}_${id}`;
}

async function migrateLegacyCardById(id: string): Promise<void> {
  const legacyKey = getCardStorageKey(LEGACY_CARDS_STORE_KEY, id);
  const nextKey = getCardStorageKey(CARDS_STORE_KEY, id);
  const card = await get<ActionCard>(legacyKey);
  if (!card) {
    return;
  }
  await set(nextKey, card);
  await del(legacyKey);
}

async function getCardKeysFromAllStorage(): Promise<string[]> {
  const allKeys = await keys();
  return allKeys
    .map(String)
    .filter(
      key =>
        key.startsWith(`${CARDS_STORE_KEY}_`) ||
        key.startsWith(`${LEGACY_CARDS_STORE_KEY}_`)
    );
}

function getLegacySettingKey(key: string): string {
  return `${LEGACY_SETTING_PREFIX}${key}`;
}

function getSettingKey(key: string): string {
  return `${SETTING_PREFIX}${key}`;
}

export async function migrateBrandStorageKeys(): Promise<void> {
  const cardKeys = await getCardKeysFromAllStorage();
  const legacyCardIds = cardKeys
    .filter(key => key.startsWith(`${LEGACY_CARDS_STORE_KEY}_`))
    .map(key => key.replace(`${LEGACY_CARDS_STORE_KEY}_`, ''));
  await Promise.all(legacyCardIds.map(id => migrateLegacyCardById(id)));
}

// 保存单个卡片
export async function saveCard(card: ActionCard): Promise<void> {
  await set(getCardStorageKey(CARDS_STORE_KEY, card.id), card);
  await del(getCardStorageKey(LEGACY_CARDS_STORE_KEY, card.id));
}

// 获取单个卡片
export async function getCard(id: string): Promise<ActionCard | undefined> {
  const nextKey = getCardStorageKey(CARDS_STORE_KEY, id);
  const nextCard = await get<ActionCard>(nextKey);
  if (nextCard) {
    return nextCard;
  }

  const legacyCard = await get<ActionCard>(
    getCardStorageKey(LEGACY_CARDS_STORE_KEY, id)
  );
  if (!legacyCard) {
    return undefined;
  }

  await set(nextKey, legacyCard);
  await del(getCardStorageKey(LEGACY_CARDS_STORE_KEY, id));
  return legacyCard;
}

// 获取所有卡片
export async function getAllCards(): Promise<ActionCard[]> {
  const cardKeys = await getCardKeysFromAllStorage();
  const cards = await Promise.all(
    cardKeys.map(k => get<ActionCard>(k))
  );
  const validCards = cards.filter(Boolean) as ActionCard[];
  const deduped = new Map<string, ActionCard>();
  validCards.forEach(card => {
    deduped.set(card.id, card);
  });
  const result = Array.from(deduped.values()).sort((a, b) => b.createdAt - a.createdAt);
  await migrateBrandStorageKeys();
  return result;
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
  await del(getCardStorageKey(CARDS_STORE_KEY, id));
  await del(getCardStorageKey(LEGACY_CARDS_STORE_KEY, id));
}

// 清空所有数据
export async function clearAllData(): Promise<void> {
  const cardKeys = await getCardKeysFromAllStorage();
  await Promise.all(cardKeys.map(k => del(k)));
}

// LocalStorage 操作（用于设置项）
export function saveSetting(key: string, value: string): void {
  try {
    localStorage.setItem(getSettingKey(key), value);
    localStorage.removeItem(getLegacySettingKey(key));
  } catch (e) {
    console.error('Failed to save setting:', e);
  }
}

export function getSetting(key: string): string | null {
  try {
    const nextValue = localStorage.getItem(getSettingKey(key));
    if (nextValue !== null) {
      return nextValue;
    }

    const legacyKey = getLegacySettingKey(key);
    const legacyValue = localStorage.getItem(legacyKey);
    if (legacyValue !== null) {
      localStorage.setItem(getSettingKey(key), legacyValue);
      localStorage.removeItem(legacyKey);
    }
    return legacyValue;
  } catch (e) {
    console.error('Failed to get setting:', e);
    return null;
  }
}

export function removeSetting(key: string): void {
  try {
    localStorage.removeItem(getSettingKey(key));
    localStorage.removeItem(getLegacySettingKey(key));
  } catch (e) {
    console.error('Failed to remove setting:', e);
  }
}