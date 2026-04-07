import type { EmotionBlock } from '@/types/emotion';

// 情绪色块配置 - 温暖疗愈的配色
export const EMOTION_BLOCKS: EmotionBlock[] = [
  {
    type: '焦虑',
    color: '#E8B4B8', // 柔粉
    description: '对未来不确定、难以专注'
  },
  {
    type: '疲惫',
    color: '#C9D6DF', // 灰蓝
    description: '精力不足、心力交瘁'
  },
  {
    type: '迷茫',
    color: '#F0E6D3', // 米白
    description: '找不到方向、不知道想要什么'
  },
  {
    type: '愤怒',
    color: '#E07A5F', // 暖橙
    description: '想做的事受阻、内心冲突'
  },
  {
    type: '希望',
    color: '#81B29A', // 青绿
    description: '期待改变、相信会更好'
  },
  {
    type: '悲伤',
    color: '#B8C5D6', // 浅蓝灰
    description: '失去、告别、孤独感'
  },
  {
    type: '空虚',
    color: '#D4D4D4', // 中灰
    description: '内心空洞、找不到意义感'
  },
  {
    type: '自责',
    color: '#D9A5B3', // 淡紫粉
    description: '对自己不满意、比较心态'
  },
  {
    type: '恐惧',
    color: '#A3C4BC', // 青灰
    description: '害怕做错选择、不敢行动'
  }
];

// 获取情绪色块
export function getEmotionBlock(type: string): EmotionBlock | undefined {
  return EMOTION_BLOCKS.find(b => b.type === type);
}