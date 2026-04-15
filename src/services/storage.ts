import { get, set, del, keys } from 'idb-keyval';
import type { AwEmotionCard, AwCardStatus } from '@/types/emotion';

const V2_CARD_PREFIX = 'awoshuile_v2_cards';
const LEGACY_CARD_PREFIXES = ['awoshuile_cards', 'mindscaffold_cards'] as const;
const MIGRATION_FLAG_KEY = 'awoshuile_storage_v2_migrated';
const SETTING_PREFIX = 'awo_';
const LEGACY_SETTING_PREFIX = 'ms_';

/** 旧版 IndexedDB 卡片（仅迁移用） */
interface LegacyActionCard {
  id: string;
  entryId: string;
  mirrorText: string;
  actions: { id: string; text: string; estimatedTime: string }[];
  selectedActionId?: string;
  status: 'pending' | 'done' | 'abandoned' | 'archived';
  createdAt: number;
}

function v2CardKey(id: string): string {
  return `${V2_CARD_PREFIX}_${id}`;
}

function isV2CardKey(key: string): boolean {
  return key.startsWith(`${V2_CARD_PREFIX}_`);
}

function isLegacyCardKey(key: string): boolean {
  return LEGACY_CARD_PREFIXES.some(p => key.startsWith(`${p}_`));
}

function formatCardDate(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleString('zh-CN', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function mapLegacyToAw(card: LegacyActionCard): AwEmotionCard {
  const selected = card.actions.find(a => a.id === card.selectedActionId);
  let status: AwCardStatus = 'pending';
  if (card.status === 'done') status = 'completed';
  else if (card.status === 'archived' || card.status === 'abandoned') status = 'letgo';

  return {
    id: card.id,
    createdAt: card.createdAt,
    date: formatCardDate(card.createdAt),
    intensity: 5,
    input: '',
    mirrorText: card.mirrorText,
    action: selected?.text ?? '（未选行动）',
    duration: selected?.estimatedTime ?? '—',
    status
  };
}

async function getAllLegacyCardKeys(): Promise<string[]> {
  const allKeys = await keys();
  return allKeys.map(String).filter(k => isLegacyCardKey(k) && !isV2CardKey(k));
}

export async function migrateBrandStorageKeys(): Promise<void> {
  const legacyKeys = await getAllLegacyCardKeys();
  const mindIds = legacyKeys
    .filter(k => k.startsWith('mindscaffold_cards_'))
    .map(k => k.replace('mindscaffold_cards_', ''));
  await Promise.all(
    mindIds.map(async id => {
      const legacyKey = `mindscaffold_cards_${id}`;
      const nextKey = `awoshuile_cards_${id}`;
      const card = await get<LegacyActionCard>(legacyKey);
      if (!card) return;
      await set(nextKey, card);
      await del(legacyKey);
    })
  );
}

/** 将旧前缀卡片一次性迁入 v2（幂等） */
export async function migrateLegacyCardsToV2(): Promise<void> {
  const done = await get<boolean>(MIGRATION_FLAG_KEY);
  if (done) return;

  await migrateBrandStorageKeys();

  const legacyKeys = await getAllLegacyCardKeys();
  for (const key of legacyKeys) {
    const card = await get<LegacyActionCard>(key);
    if (!card?.id) continue;
    const aw = mapLegacyToAw(card);
    await set(v2CardKey(aw.id), aw);
    await del(key);
  }

  await set(MIGRATION_FLAG_KEY, true);
}

export async function saveAwCard(card: AwEmotionCard): Promise<void> {
  await set(v2CardKey(card.id), card);
}

export async function getAwCard(id: string): Promise<AwEmotionCard | undefined> {
  return get<AwEmotionCard>(v2CardKey(id));
}

export async function getAllAwCards(): Promise<AwEmotionCard[]> {
  await migrateLegacyCardsToV2();

  const allKeys = await keys();
  const v2Keys = allKeys.map(String).filter(isV2CardKey);
  const rows = await Promise.all(v2Keys.map(k => get<AwEmotionCard>(k)));
  const cards = rows.filter(Boolean) as AwEmotionCard[];
  const map = new Map<string, AwEmotionCard>();
  cards.forEach(c => map.set(c.id, c));
  return Array.from(map.values()).sort((a, b) => b.createdAt - a.createdAt);
}

export async function updateAwCard(
  id: string,
  updates: Partial<Pick<AwEmotionCard, 'status'>> & Partial<AwEmotionCard>
): Promise<void> {
  const card = await getAwCard(id);
  if (!card) return;
  await saveAwCard({ ...card, ...updates });
}

export async function deleteAwCard(id: string): Promise<void> {
  await del(v2CardKey(id));
}

export async function clearAllAwData(): Promise<void> {
  const allKeys = await keys();
  const toDel = allKeys
    .map(String)
    .filter(k => isV2CardKey(k) || isLegacyCardKey(k) || k === MIGRATION_FLAG_KEY);
  await Promise.all(toDel.map(k => del(k)));
}

// —— 兼容旧 API 名称（历史页等）——

/** @deprecated 使用 getAllAwCards */
export async function getAllCards(): Promise<AwEmotionCard[]> {
  return getAllAwCards();
}

/** @deprecated 使用 saveAwCard */
export async function saveCard(card: AwEmotionCard): Promise<void> {
  return saveAwCard(card);
}

export async function updateCardStatus(
  id: string,
  status: AwCardStatus
): Promise<void> {
  return updateAwCard(id, { status });
}

export async function deleteCard(id: string): Promise<void> {
  return deleteAwCard(id);
}

export async function clearAllData(): Promise<void> {
  return clearAllAwData();
}

export function saveSetting(key: string, value: string): void {
  try {
    localStorage.setItem(`${SETTING_PREFIX}${key}`, value);
    localStorage.removeItem(`${LEGACY_SETTING_PREFIX}${key}`);
  } catch (e) {
    console.error('Failed to save setting:', e);
  }
}

export function getSetting(key: string): string | null {
  try {
    const nextValue = localStorage.getItem(`${SETTING_PREFIX}${key}`);
    if (nextValue !== null) return nextValue;
    const legacyKey = `${LEGACY_SETTING_PREFIX}${key}`;
    const legacyValue = localStorage.getItem(legacyKey);
    if (legacyValue !== null) {
      localStorage.setItem(`${SETTING_PREFIX}${key}`, legacyValue);
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
    localStorage.removeItem(`${SETTING_PREFIX}${key}`);
    localStorage.removeItem(`${LEGACY_SETTING_PREFIX}${key}`);
  } catch (e) {
    console.error('Failed to remove setting:', e);
  }
}
