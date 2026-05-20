// 阿窝睡了 — 与设计稿一致的数据模型（结构化外化 + 微行动）

/** 旧版情绪色块（配置与可选组件用） */
export type EmotionType =
  | '焦虑'
  | '疲惫'
  | '迷茫'
  | '愤怒'
  | '希望'
  | '悲伤'
  | '空虚'
  | '自责'
  | '恐惧';

export interface EmotionBlock {
  type: EmotionType;
  color: string;
  description: string;
}

/** 历史卡片状态：与设计稿 EmotionCard.status 一致 */
export type AwCardStatus = 'pending' | 'completed' | 'letgo';

export type AwMainTab = 'home' | 'history' | 'tree' | 'me';

export interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

/** 设计稿中的情绪存档卡片 */
export interface AwEmotionCard {
  id: string;
  createdAt: number;
  /** 展示用日期，如「4/15 下午10:30」 */
  date: string;
  intensity: number;
  input: string;
  mirrorText: string;
  action: string;
  duration: string;
  status: AwCardStatus;
  emotion?: string;
  story?: string;
  feedback?: string;
  isLeaf?: boolean;
  expiryTime?: number;
  likes?: number;
  chatHistory?: ChatMessage[];
  /** 拆解步骤答案，可选持久化 */
  deconstructionAnswers?: Record<string, unknown>;
}

/** 当前一次梳理流程中的草稿（未落库） */
export interface FlowDraft {
  createdAt: number;
  date: string;
  intensity: number;
  input: string;
  deconstructionAnswers: Record<string, unknown>;
  /** 服务端 emotion card id，进入聊天时创建 */
  cardId?: string;
  reviewText?: string;
  chatHistory?: ChatMessage[];
}
