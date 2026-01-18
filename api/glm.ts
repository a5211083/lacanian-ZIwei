// api/glm.ts
export const config = {
  runtime: 'edge', 
};

export default async function handler(req: Request) {
  // === 1. 定义 CORS 头部 (解决跨域问题) ===
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // 允许所有域名访问，生产环境建议换成你的前端域名
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // === 2. 处理 OPTIONS 预检请求 ===
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // === 3. 仅允许 POST，其他方法报错 ===
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: '只允许 POST 请求' }), { 
      status: 405, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { prompt } = body;

    if (!prompt) {
      return new Response(JSON.stringify({ error: '缺少 prompt 参数' }), { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const apiKey = process.env.GLM_API_KEY; 
    if (!apiKey) {
      return new Response(JSON.stringify({ error: '服务器未配置 API Key' }), { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 发起请求到硅基流动
    const response = await fetch("https://api.siliconflow.cn/v1/chat/completions", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey.trim()}`
      },
      body: JSON.stringify({
        model: "THUDM/GLM-Z1-9B-0414", 
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1024,
        stream: true
      })
    });

    if (!response.ok) {
      const errorDetail = await response.text();
      console.error(`硅基流动 API 报错: ${response.status}`, errorDetail);
      return new Response(JSON.stringify({ 
        error: `硅基流动 AI 平台返回错误 (${response.status})`, 
        detail: errorDetail 
      }), { 
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // === 4. 返回流式响应 ===
    // 注意：这里必须带上 CORS 头部，否则前端收不到数据
    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no"
      },
    });

  } catch (err: any) {
    console.error("Vercel Edge 内部错误:", err);
    return new Response(JSON.stringify({ error: '服务器内部错误', message: err.message }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}