import Taro from '@tarojs/taro';

// Mock 数据（开发环境使用）
const MOCK_MODE = true; // 设置为 false 并部署 API 后禁用

const mockMirror = (emotion: string, contextPrompt?: string): string => {
  // 如果有上下文提示词，生成更个性化的镜像
  if (contextPrompt) {
    const contextParts = contextPrompt.split('。').filter(p => p.trim());
    const mainSource = contextParts.find(p => p.includes('主要来源'));
    const intensity = contextParts.find(p => p.includes('情绪强度'));
    const detail = contextParts.find(p => p.includes('具体感受'));

    return `你感到${detail ? detail.replace('具体感受：', '') : emotion}。${mainSource ? mainSource.replace('主要来源：', '这种感觉主要来自') + '。' : ''}你的情绪${intensity ? intensity.match(/\d+/)?.[0] && parseInt(intensity.match(/\d+/)[0]) > 60 ? '比较强烈' : '存在但并不严重' : '是被允许的'}。你不需要独自面对，每一个感受都有它的意义。`;
  }

  const templates: Record<string, string> = {
    '焦虑': '你感到焦虑，这种不安来自对未来的不确定。你的担心是被允许的，不需要立刻找到答案。',
    '疲惫': '你感到疲惫，身体和心灵都在告诉你需要休息。这种感觉是真实的，你值得被温柔对待。',
    '迷茫': '你感到迷茫，好像找不到前进的方向。这种不确定感是正常的，你不需要立刻看清所有路。',
    '愤怒': '你感到愤怒，有些事情触碰了你的边界。这种情绪在提醒你，有些东西需要被看见。',
    '希望': '你感到希望，内心有一束光在闪烁。保持这份期待，它会指引你向前。',
    '悲伤': '你感到悲伤，心里有失去和告别。让眼泪流出来吧，悲伤也是一种力量。',
    '空虚': '你感到空虚，好像内心缺少什么。这种感觉在邀请你，去寻找真正重要的事。',
    '自责': '你感到自责，对自己有不满和评判。请记住，你已经在努力了，这足够了。',
    '恐惧': '你感到恐惧，害怕做出错误的选择。这种谨慎保护着你，但也不要被它困住。'
  };
  return templates[emotion] || `你感到${emotion}，这种情绪是被允许的。`;
};

const mockActions = (): Array<{ text: string; estimatedTime: string }> => [
  { text: '写下3个让你担心的事', estimatedTime: '5分钟' },
  { text: '深呼吸10次，感受当下的平静', estimatedTime: '3分钟' },
  { text: '给信任的人发一条消息', estimatedTime: '5分钟' }
];

const mockCauses = (emotion: string): string[] => {
  const causesMap: Record<string, string[]> = {
    '焦虑': ['工作压力', '经济状况', '人际关系', '健康担忧', '未来不确定'],
    '疲惫': ['睡眠不足', '工作过度', '情绪消耗', '缺乏运动', '饮食不规律'],
    '迷茫': ['目标不清', '选择太多', '价值冲突', '环境变化', '缺乏反馈'],
    '愤怒': ['被误解', '边界被侵犯', '期望落空', '不公平对待', '沟通不畅'],
    '希望': ['新的机会', '改变的可能', '他人支持', '自我成长', '目标明确'],
    '悲伤': ['失去重要的人', '告别过去', '孤独感', '被拒绝', '期望落空'],
    '空虚': ['缺乏目标', '意义缺失', '社交隔离', '日常重复', '价值感低'],
    '自责': ['比较心理', '期望过高', '过去的错误', '他人评价', '完美主义'],
    '恐惧': ['失败的可能', '未知的结果', '他人的眼光', '失去控制', '改变的风险']
  };
  return causesMap[emotion] || ['生活压力', '人际关系', '工作问题', '内心冲突'];
};

interface MirrorRequest {
  emotion: string;
  causes: string[];
  contextPrompt?: string;
}

interface MirrorResponse {
  mirrorText: string;
}

interface ActionRequest {
  mirrorText: string;
}

interface ActionResponse {
  actions: Array<{
    text: string;
    estimatedTime: string;
  }>;
}

interface CauseRequest {
  emotion: string;
}

interface CauseResponse {
  causes: string[];
}

// 镜像重述 API
export async function fetchMirror(data: MirrorRequest): Promise<MirrorResponse> {
  if (MOCK_MODE) {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    return { mirrorText: mockMirror(data.emotion, data.contextPrompt) };
  }

  const res = await Taro.request({
    url: `/api/mirror`,
    method: 'POST',
    data,
    header: {
      'Content-Type': 'application/json'
    }
  });

  if (res.statusCode !== 200) {
    throw new Error('镜像重述请求失败');
  }

  return res.data as MirrorResponse;
}

// 微行动生成 API
export async function fetchActions(data: ActionRequest): Promise<ActionResponse> {
  if (MOCK_MODE) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { actions: mockActions() };
  }

  const res = await Taro.request({
    url: `/api/action`,
    method: 'POST',
    data,
    header: {
      'Content-Type': 'application/json'
    }
  });

  if (res.statusCode !== 200) {
    throw new Error('微行动请求失败');
  }

  return res.data as ActionResponse;
}

// 原因拆解 API
export async function fetchCauses(data: CauseRequest): Promise<CauseResponse> {
  if (MOCK_MODE) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { causes: mockCauses(data.emotion) };
  }

  const res = await Taro.request({
    url: `/api/causes`,
    method: 'POST',
    data,
    header: {
      'Content-Type': 'application/json'
    }
  });

  if (res.statusCode !== 200) {
    throw new Error('原因拆解请求失败');
  }

  return res.data as CauseResponse;
}