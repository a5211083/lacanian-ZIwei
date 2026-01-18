// api/glm.ts
export const config = {
  runtime: 'edge', 
};

export default async function handler(req: Request) {
  // 1. 仅允许 POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: '只允许 POST 请求' }), { status: 405 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { prompt } = body;

    if (!prompt) {
      return new Response(JSON.stringify({ error: '缺少 prompt 参数' }), { status: 400 });
    }

    // 2. 检查环境变量 (建议在 Vercel 后台改名为 SILICON_FLOW_KEY，或者沿用旧名) 这里的变量值请填写你在 siliconflow.cn 申请的 API Key
    const apiKey = process.env.GLM_API_KEY; 
    if (!apiKey) {
      return new Response(JSON.stringify({ error: '服务器未配置 API Key' }), { status: 500 });
    }

    // 3. 发起请求 (切换到硅基流动 API)
    // 免费模型推荐：deepseek-ai/DeepSeek-V3 或 Qwen/Qwen2.5-72B-Instruct
    const response = await fetch("https://api.siliconflow.cn/v1/chat/completions", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey.trim()}`
      },
      body: JSON.stringify({
        model: "Qwen/Qwen2-7B-Instruct", // 这里是目前免费最强的模型 Qwen/Qwen2-7B-Instruct  THUDM/GLM-Z1-9B-0414  deepseek-ai/DeepSeek-R1-Distill-Qwen-7B
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1024,
        stream: true
      })
    });

    // 4. 捕获错误反馈
    if (!response.ok) {
      const errorDetail = await response.text();
      console.error(`硅基流动 API 报错: ${response.status}`, errorDetail);
      return new Response(JSON.stringify({ 
        error: `硅基流动 AI 平台返回错误 (${response.status})`, 
        detail: errorDetail 
      }), { status: response.status });
    }

    // const data = await response.json();
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no" // 禁止 Vercel/Nginx 缓冲数据
      },
    });
    
    // 5. 统一输出格式 (兼容你原来的前端逻辑)
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err: any) {
    console.error("Vercel Edge 内部错误:", err);
    return new Response(JSON.stringify({ error: '服务器内部错误', message: err.message }), { status: 500 });
  }
}