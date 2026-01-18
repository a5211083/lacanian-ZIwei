// api/analyze.ts
import { GoogleGenAI } from "@google/genai";

export const config = {
  runtime: 'edge', // 使用 Edge Runtime 响应更快
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const { prompt, lang } = await req.json();

    // 1. 尝试调用 Google Gemini
    try {
      const googleKey = process.env.GOOGLE_API_KEY; // 在 Vercel 后台设置
      if (googleKey) {
        const genAI = new GoogleGenAI(googleKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // 修正模型名称
        const result = await model.generateContent(prompt);
        return new Response(JSON.stringify({ content: result.response.text() }));
      }
    } catch (googleError) {
      console.error("Google AI Failed:", googleError);
    }

    // 2. 备选方案：调用智谱 GLM
    const glmKey = process.env.GLM_API_KEY; // 在 Vercel 后台设置 (必须是 id.secret 格式)
    const response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${glmKey}`
      },
      body: JSON.stringify({
        model: "glm-4.5-flash",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    });

    const data = await response.json();
    return new Response(JSON.stringify({ 
      content: data.choices?.[0]?.message?.content || "解析失败" 
    }));

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}