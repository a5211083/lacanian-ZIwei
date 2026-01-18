// api/glm.ts
export const config = {
  runtime: 'edge', // 使用 Edge 运行时
};

export default async function handler(req: Request) {
  // 1. 仅允许 POST 请求
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: '只允许 POST 请求' }), { status: 405 });
  }

  try {
    // 2. 解析请求体，增加防呆保护
    const body = await req.json().catch(() => ({}));
    const { prompt } = body;

    if (!prompt) {
      return new Response(JSON.stringify({ error: '缺少 prompt 参数' }), { status: 400 });
    }

    // 3. 检查环境变量是否存在
    const apiKey = process.env.GLM_API_KEY;
    if (!apiKey) {
      console.error("Vercel 环境变量 GLM_API_KEY 未配置");
      return new Response(JSON.stringify({ error: '服务器未配置 API Key，请在 Vercel 后台设置 GLM_API_KEY' }), { status: 500 });
    }

    // 4. 发起对智谱的请求
    const response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey.trim()}` // 自动去空格
      },
      body: JSON.stringify({
        model: "glm-4.5-flash",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    });

    // 5. 捕获智谱返回的错误状态码
    if (!response.ok) {
      const errorDetail = await response.text();
      console.error(`智谱 API 报错: ${response.status}`, errorDetail);
      return new Response(JSON.stringify({ 
        error: `智谱 API 返回错误 (${response.status})`, 
        detail: errorDetail 
      }), { status: response.status });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err: any) {
    console.error("Vercel Edge Function 内部错误:", err);
    return new Response(JSON.stringify({ error: '服务器内部错误', message: err.message }), { status: 500 });
  }
}