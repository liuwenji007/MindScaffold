// 引导式问题配置

export interface QuestionStep {
  id: string;
  type: 'single' | 'slider' | 'sort' | 'multi';
  question: string;
  options?: string[];
  min?: number;
  max?: number;
  label?: {
    min: string;
    max: string;
  };
}

// 根据情绪类型返回定制问题
export function getQuestionSteps(emotion: string): QuestionStep[] {
  const baseQuestions: QuestionStep[] = [
    // 第1轮：归因
    {
      id: 'attribution',
      type: 'multi',
      question: '这种感觉主要来自哪里？（可多选）',
      options: getAttributionOptions(emotion)
    },
    // 第2轮：责任分配
    {
      id: 'responsibility',
      type: 'slider',
      question: '这件事，你觉得有多少是自己的责任？',
      min: 0,
      max: 100,
      label: { min: '完全不是我的错', max: '完全是我的错' }
    },
    // 第3轮：情绪强度
    {
      id: 'intensity',
      type: 'slider',
      question: '这种情绪有多强烈？',
      min: 0,
      max: 100,
      label: { min: '有点感觉', max: '非常强烈' }
    },
    // 第4轮：情绪词细化
    {
      id: 'emotion_detail',
      type: 'single',
      question: '更准确地说，这是一种什么样的感觉？',
      options: getEmotionDetailOptions(emotion)
    },
    // 第5轮：影响排序
    {
      id: 'impact_sort',
      type: 'sort',
      question: '按影响程度排序，哪个最困扰你？',
      options: getImpactOptions(emotion)
    }
  ];

  return baseQuestions;
}

function getAttributionOptions(emotion: string): string[] {
  const common = ['工作/学业', '人际关系', '家庭', '健康', '经济', '自我期望'];

  const emotionSpecific: Record<string, string[]> = {
    '焦虑': ['对未来的不确定', '担心做错选择', '时间不够用'],
    '疲惫': ['睡眠不足', '工作太忙', '情绪消耗', '缺乏休息'],
    '迷茫': ['不知道想要什么', '选择太多', '方向不明确', '失去动力'],
    '愤怒': ['被误解', '被不公正对待', '期望落空', '边界被侵犯'],
    '希望': ['新的机会', '想要改变', '看到可能性', '有人支持'],
    '悲伤': ['失去重要的人/事', '告别', '孤独', '被拒绝'],
    '空虚': ['找不到意义', '日常重复', '缺少连接', '目标缺失'],
    '自责': ['觉得自己不够好', '比较心理', '过去的错误', '他人评价'],
    '恐惧': ['害怕失败', '害怕失去', '害怕改变', '害怕被评判']
  };

  return [...common, ...(emotionSpecific[emotion] || [])];
}

function getEmotionDetailOptions(emotion: string): string[] {
  const details: Record<string, string[]> = {
    '焦虑': ['担心', '紧张', '不安', '慌乱', '压力'],
    '疲惫': ['困倦', '无力', '耗尽', '沉重', '麻木'],
    '迷茫': ['困惑', '迷失', '不确定', '彷徨', '无所适从'],
    '愤怒': ['生气', '委屈', '不满', '烦躁', '怨恨'],
    '希望': ['期待', '向往', '憧憬', '乐观', '信心'],
    '悲伤': ['难过', '心痛', '失落', '遗憾', '哀伤'],
    '空虚': ['无聊', '空洞', '没劲', '孤独', '漂浮'],
    '自责': ['愧疚', '后悔', '羞愧', '自责', '懊恼'],
    '恐惧': ['害怕', '担心', '惶恐', '不安', '焦虑']
  };

  return details[emotion] || ['说不清楚'];
}

function getImpactOptions(emotion: string): string[] {
  return ['睡眠质量', '工作效率', '人际关系', '身体状况', '心情状态'];
}

// 将用户回答整理成提示词
export function formatAnswersAsPrompt(answers: Record<string, any>, emotion: string): string {
  const parts: string[] = [];

  // 归因
  if (answers.attribution?.length > 0) {
    parts.push(`主要来源：${answers.attribution.join('、')}`);
  }

  // 责任分配
  if (answers.responsibility !== undefined) {
    const level = answers.responsibility;
    let desc = '';
    if (level <= 20) desc = '认为主要不是自己的责任';
    else if (level <= 40) desc = '认为小部分是自己的责任';
    else if (level <= 60) desc = '认为双方都有责任';
    else if (level <= 80) desc = '认为大部分是自己的责任';
    else desc = '认为主要自己的责任';
    parts.push(`责任归属：用户${desc}（${level}%）`);
  }

  // 情绪强度
  if (answers.intensity !== undefined) {
    const intensity = answers.intensity;
    let level = '';
    if (intensity <= 30) level = '轻微';
    else if (intensity <= 60) level = '中等';
    else if (intensity <= 80) level = '较强';
    else level = '非常强烈';
    parts.push(`情绪强度：${level}（${intensity}%）`);
  }

  // 情绪细化
  if (answers.emotion_detail) {
    parts.push(`具体感受：${answers.emotion_detail}`);
  }

  // 影响排序
  if (answers.impact_sort?.length > 0) {
    parts.push(`影响程度排序：${answers.impact_sort.slice(0, 3).join(' > ')}`);
  }

  return parts.join('。');
}