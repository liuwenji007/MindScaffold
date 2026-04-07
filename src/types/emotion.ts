// MindScaffold 类型定义

// 情绪入口记录
export interface EmotionEntry {
  id: string;
  emotion: EmotionType;
  userNote?: string;
  timestamp: number;
}

// 情绪类型枚举
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

// 情绪色块配置
export interface EmotionBlock {
  type: EmotionType;
  color: string;
  description: string;
}

// 问题拆解记录
export interface Breakdown {
  entryId: string;
  causes: CauseCard[];
  priority: string[];
}

// 原因卡片
export interface CauseCard {
  id: string;
  text: string;
  source: 'ai' | 'user';
}

// 镜像重述结果
export interface MirrorResult {
  entryId: string;
  mirrorText: string;
  confirmed: boolean;
}

// 微行动卡片
export interface ActionCard {
  id: string;
  entryId: string;
  mirrorText: string;
  actions: MicroAction[];
  selectedActionId?: string;
  status: ActionStatus;
  createdAt: number;
}

// 微行动项
export interface MicroAction {
  id: string;
  text: string;
  estimatedTime: string;
}

// 行动状态
export type ActionStatus = 'pending' | 'done' | 'abandoned' | 'archived';

// 用户反馈
export interface UserFeedback {
  cardId: string;
  type: 'accurate' | 'inaccurate' | 'helpful' | 'unhelpful';
  comment?: string;
  timestamp: number;
}