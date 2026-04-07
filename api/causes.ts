import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

interface CauseRequest {
  emotion: string;
}

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const body: CauseRequest = await req.json();
    const { emotion } = body;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 200,
      messages: [{
        role: 'user',
        content: `用户选择的情绪：${emotion}

请生成 3-5 个可能导致这种情绪的原因，帮助用户拆解模糊感受。
要求：
1. 每个原因简洁明了，不超过 15 字
2. 原因要具体、贴近日常生活（如"工作压力大"而非"外部压力"）
3. 语气中性，不带评判
4. 每个原因用一行表示`
      }]
    });

    const responseText = message.content[0].type === 'text'
      ? message.content[0].text
      : '';

    // 解析原因列表
    const causes = responseText.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && line.length <= 15);

    return Response.json({ causes });
  } catch (error) {
    console.error('Causes API error:', error);
    return Response.json(
      { error: 'Failed to generate causes' },
      { status: 500 }
    );
  }
}