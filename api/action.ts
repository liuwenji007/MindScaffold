import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

interface ActionRequest {
  mirrorText: string;
}

interface MicroAction {
  text: string;
  estimatedTime: string;
}

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const body: ActionRequest = await req.json();
    const { mirrorText } = body;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: `用户情绪镜像：${mirrorText}

请生成 1-3 个微小可执行的行动建议。
要求：
1. 每个行动不超过 15 分钟可完成
2. 具体而非抽象（如"写下3个担心的事"而非"整理思绪"）
3. 不评判、不催促，给用户选择权
4. 语气温柔，像朋友在轻轻建议
5. 每个行动用一行表示，格式：行动内容（预计时间）`
      }]
    });

    const responseText = message.content[0].type === 'text'
      ? message.content[0].text
      : '';

    // 解析行动列表
    const actionLines = responseText.split('\n').filter(line => line.trim());
    const actions: MicroAction[] = actionLines.map(line => {
      // 尝试解析格式：行动内容（预计时间）
      const match = line.match(/(.+?)（(.+?)）/);
      if (match) {
        return {
          text: match[1].trim(),
          estimatedTime: match[2].trim()
        };
      }
      // 如果格式不匹配，使用默认时间
      return {
        text: line.trim(),
        estimatedTime: '5分钟'
      };
    });

    return Response.json({ actions });
  } catch (error) {
    console.error('Action API error:', error);
    return Response.json(
      { error: 'Failed to generate actions' },
      { status: 500 }
    );
  }
}