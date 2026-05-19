import { create } from 'zustand';
import { getSetting, saveSetting } from '@/services/storage';
import type { AwEmotionCard, AwMainTab, ChatMessage, FlowDraft } from '@/types/emotion';

const DEFAULT_POINTS = 0;
const POINTS_KEY = 'emotion_points';
const ACTIVE_TAB_KEY = 'active_tab';

function readPoints(): number {
  const raw = getSetting(POINTS_KEY);
  const parsed = Number(raw ?? DEFAULT_POINTS);
  return Number.isFinite(parsed) ? parsed : DEFAULT_POINTS;
}

function readTab(): AwMainTab {
  const raw = getSetting(ACTIVE_TAB_KEY);
  if (raw === 'home' || raw === 'history' || raw === 'tree' || raw === 'me') {
    return raw;
  }
  return 'home';
}

interface EmotionState {
  draft: FlowDraft | null;
  cards: AwEmotionCard[];
  activeTab: AwMainTab;
  emotionPoints: number;
  historyChatCardId: string | null;

  startFlow: (intensity: number, input: string) => void;
  cancelFlow: () => void;
  setDeconstructionAnswers: (answers: Record<string, unknown>) => void;
  setMirrorText: (text: string) => void;
  setReviewText: (text: string) => void;
  setDraftChatHistory: (messages: ChatMessage[]) => void;
  addCard: (card: AwEmotionCard) => void;
  updateCard: (id: string, updates: Partial<AwEmotionCard>) => void;
  loadCards: (cards: AwEmotionCard[]) => void;
  setActiveTab: (tab: AwMainTab) => void;
  setEmotionPoints: (points: number) => void;
  gainEmotionPoints: (delta: number) => void;
  setHistoryChatCardId: (id: string | null) => void;
  resetDraft: () => void;
}

export const useEmotionStore = create<EmotionState>((set) => ({
  draft: null,
  cards: [],
  activeTab: readTab(),
  emotionPoints: readPoints(),
  historyChatCardId: null,

  startFlow: (intensity, input) =>
    set({
      draft: {
        createdAt: Date.now(),
        date: new Date().toLocaleString('zh-CN', {
          month: 'numeric',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        intensity,
        input,
        deconstructionAnswers: {},
        reviewText: undefined
      },
      historyChatCardId: null
    }),

  cancelFlow: () => set({ draft: null }),

  setDeconstructionAnswers: (answers) =>
    set((s) =>
      s.draft
        ? { draft: { ...s.draft, deconstructionAnswers: answers } }
        : {}
    ),

  setMirrorText: (text) =>
    set((s) =>
      s.draft ? { draft: { ...s.draft, mirrorText: text } } : {}
    ),

  setReviewText: (text) =>
    set((s) =>
      s.draft ? { draft: { ...s.draft, reviewText: text } } : {}
    ),

  setDraftChatHistory: (messages) =>
    set((s) =>
      s.draft ? { draft: { ...s.draft, chatHistory: messages } } : {}
    ),

  addCard: (card) =>
    set((s) => ({
      cards: [card, ...s.cards.filter((c) => c.id !== card.id)]
    })),

  updateCard: (id, updates) =>
    set((s) => ({
      cards: s.cards.map((c) => (c.id === id ? { ...c, ...updates } : c))
    })),

  loadCards: (cards) => set({ cards }),

  setActiveTab: (tab) => {
    saveSetting(ACTIVE_TAB_KEY, tab);
    set({ activeTab: tab });
  },

  setEmotionPoints: (points) => {
    const safe = Number.isFinite(points) ? Math.max(0, Math.floor(points)) : 0;
    saveSetting(POINTS_KEY, String(safe));
    set({ emotionPoints: safe });
  },

  gainEmotionPoints: (delta) =>
    set((s) => {
      const next = Math.max(0, s.emotionPoints + delta);
      saveSetting(POINTS_KEY, String(next));
      return { emotionPoints: next };
    }),

  setHistoryChatCardId: (id) => set({ historyChatCardId: id }),

  resetDraft: () => set({ draft: null })
}));
