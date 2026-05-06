module.exports = async function handler(req, res) {
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
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'API 오류');
    }

    const result = data.content?.[0]?.text || '결과를 가져올 수 없습니다.';
    return res.status(200).json({ result });

  } catch (err) {
    console.error('API error:', err.message);
    return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};
