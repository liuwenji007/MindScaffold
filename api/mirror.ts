import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

interface MirrorRequest {
  emotion: string;
  causes: string[];
}

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const body: MirrorRequest = await req.json();
    const { emotion, causes } = body;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 200,
      messages: [{
        role: 'user',
        content: `用户当前情绪：${emotion}
拆解原因：${causes.join('、')}

请用温和、非评判的语气，以第三人称视角重述用户的情绪状态。
要求：
1. 不超过 100 字
2. 使用"你感到..."句式
3. 帮助用户命名模糊感受，让情绪被看见
4. 不要给出建议，只做镜像，陪伴用户
5. 语气温柔，像朋友在倾听`
      }]
    });

    const mirrorText = message.content[0].type === 'text'
      ? message.content[0].text
      : '';

    return Response.json({ mirrorText });
  } catch (error) {
    console.error('Mirror API error:', error);
    return Response.json(
      { error: 'Failed to generate mirror text' },
      { status: 500 }
    );
  }
}