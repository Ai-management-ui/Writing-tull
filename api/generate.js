// api/generate.js
// Vercel Serverless Function - Claude API 호출
// API 키는 절대 이 파일에 직접 쓰지 마세요!

export default async function handler(req, res) {
  // POST 요청만 허용
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string' || prompt.length > 3000) {
    return res.status(400).json({ error: '잘못된 요청입니다.' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY, // 환경변수에서만 읽음
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001', // 빠르고 저렴한 모델
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'API 오류');
    }

    const result = data.content?.[0]?.text || '결과를 가져올 수 없습니다.';

    // 입력/출력 로그 저장 안 함 - 개인정보 보호
    return res.status(200).json({ result });

  } catch (err) {
    console.error('API error:', err.message);
    return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}
