// AI 提示词模板

// 镜像重述提示词
export function getMirrorPrompt(emotion: string, causes: string[]): string {
  return `用户当前情绪：${emotion}
拆解原因：${causes.join('、')}

请用温和、非评判的语气，以第三人称视角重述用户的情绪状态。
要求：
1. 不超过 100 字
2. 使用"你感到..."句式
3. 帮助用户命名模糊感受，让情绪被看见
4. 不要给出建议，只做镜像，陪伴用户
5. 语气温柔，像朋友在倾听`;
}

// 微行动生成提示词
export function getActionPrompt(mirrorText: string): string {
  return `用户情绪镜像：${mirrorText}

请生成 1-3 个微小可执行的行动建议。
要求：
1. 每个行动不超过 15 分钟可完成
2. 具体而非抽象（如"写下3个担心的事"而非"整理思绪"）
3. 不评判、不催促，给用户选择权
4. 语气温柔，像朋友在轻轻建议
5. 每个行动用一行表示，格式：行动内容（预计时间）`;
}

// 原因拆解提示词（用于AI辅助生成可能原因）
export function getCausePrompt(emotion: string): string {
  return `用户选择的情绪：${emotion}

请生成 3-5 个可能导致这种情绪的原因，帮助用户拆解模糊感受。
要求：
1. 每个原因简洁明了，不超过 15 字
2. 原因要具体、贴近日常生活（如"工作压力大"而非"外部压力"）
3. 语气中性，不带评判
4. 每个原因用一行表示`;
}