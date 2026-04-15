import { create } from 'zustand';
import type { AwEmotionCard } from '@/types/emotion';

interface EmotionState {
  draft: FlowDraft | null;
  cards: AwEmotionCard[];

  startFlow: (intensity: number, input: string) => void;
  cancelFlow: () => void;
  setDeconstructionAnswers: (answers: Record<string, unknown>) => void;
  setMirrorText: (text: string) => void;
  addCard: (card: AwEmotionCard) => void;
  updateCard: (id: string, updates: Partial<AwEmotionCard>) => void;
  loadCards: (cards: AwEmotionCard[]) => void;
  resetDraft: () => void;
}

export const useEmotionStore = create<EmotionState>((set) => ({
  draft: null,
  cards: [],

  startFlow: (intensity, input) =>
    set({
      draft: {
        intensity,
        input,
        deconstructionAnswers: {}
      }
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

  addCard: (card) =>
    set((s) => ({
      cards: [card, ...s.cards.filter((c) => c.id !== card.id)]
    })),

  updateCard: (id, updates) =>
    set((s) => ({
      cards: s.cards.map((c) => (c.id === id ? { ...c, ...updates } : c))
    })),

  loadCards: (cards) => set({ cards }),

  resetDraft: () => set({ draft: null })
}));
