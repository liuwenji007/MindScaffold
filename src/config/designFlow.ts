/** 与设计稿项目 `阿窝睡了/src/App.tsx` 一致的固定题目与微行动 */

export const DESIGN_QUESTIONS = [
  {
    id: 1,
    type: 'slider' as const,
    question: '这件事对你的影响程度有多大？',
    min: 1,
    max: 10,
    labels: ['微弱', '强烈']
  },
  {
    id: 2,
    type: 'radio' as const,
    question: '这种感觉更接近哪一种？',
    options: ['焦虑', '委屈', '愤怒', '迷茫']
  },
  {
    id: 3,
    type: 'checkbox' as const,
    question: '身体哪里有感觉？',
    options: ['胸口闷', '呼吸浅', '手心汗', '肌肉紧']
  },
  {
    id: 4,
    type: 'sort' as const,
    question: '给这些压力源排个序（点击选择）',
    options: ['工作压力', '人际关系', '自我怀疑', '环境嘈杂']
  }
];

export const DESIGN_ACTIONS = [
  { text: '深呼吸3次，感受空气进入肺部', duration: '1分钟' },
  { text: '写下明天最重要的三件事', duration: '3分钟' },
  { text: '喝一杯温水，感受温度', duration: '2分钟' }
];

export type DesignQuestion = (typeof DESIGN_QUESTIONS)[number];
