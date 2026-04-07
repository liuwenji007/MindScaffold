import { create } from 'zustand';
import type { EmotionEntry, ActionCard, Breakdown, MirrorResult } from '@/types/emotion';

interface EmotionState {
  // 当前流程状态
  currentStep: 'entry' | 'breakdown' | 'mirror' | 'action';

  // 当前情绪记录
  currentEntry: EmotionEntry | null;

  // 当前拆解结果
  currentBreakdown: Breakdown | null;

  // 当前镜像重述
  currentMirror: MirrorResult | null;

  // 所有卡片（用于历史记录）
  cards: ActionCard[];

  // Actions
  setStep: (step: 'entry' | 'breakdown' | 'mirror' | 'action') => void;
  setEntry: (entry: EmotionEntry) => void;
  setBreakdown: (breakdown: Breakdown) => void;
  setMirror: (mirror: MirrorResult) => void;
  addCard: (card: ActionCard) => void;
  updateCard: (id: string, updates: Partial<ActionCard>) => void;
  removeCard: (id: string) => void;
  loadCards: (cards: ActionCard[]) => void;
  reset: () => void;
}

export const useEmotionStore = create<EmotionState>((set) => ({
  currentStep: 'entry',
  currentEntry: null,
  currentBreakdown: null,
  currentMirror: null,
  cards: [],

  setStep: (step) => set({ currentStep: step }),

  setEntry: (entry) => set({
    currentEntry: entry,
    currentStep: 'breakdown'
  }),

  setBreakdown: (breakdown) => set({
    currentBreakdown: breakdown,
    currentStep: 'mirror'
  }),

  setMirror: (mirror) => set({
    currentMirror: mirror,
    currentStep: 'action'
  }),

  addCard: (card) => set((state) => ({
    cards: [...state.cards, card]
  })),

  updateCard: (id, updates) => set((state) => ({
    cards: state.cards.map(card =>
      card.id === id ? { ...card, ...updates } : card
    )
  })),

  removeCard: (id) => set((state) => ({
    cards: state.cards.filter(card => card.id !== id)
  })),

  loadCards: (cards) => set({ cards }),

  reset: () => set({
    currentStep: 'entry',
    currentEntry: null,
    currentBreakdown: null,
    currentMirror: null
  })
}));