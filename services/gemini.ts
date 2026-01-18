import { GoogleGenAI } from "@google/genai";
import { StarMapping, Language, AnalysisStyle, Palace, Transformation, GlmEnv } from "../types";

export async function getDetailedAnalysis(
  star: StarMapping, 
  palace: Palace | null,
  trans: Transformation | null,
  lang: Language = 'zh', 
  style: AnalysisStyle = 'Lacanian',
  glm: any // 这里接收配置对象
): Promise<string> {
  const targetLang = lang === 'zh' ? 'Chinese' : 'English';

  let styleDesc = "";
  if (style === 'Lacanian') styleDesc = "使用拉康精神分析视角，重点关注实在、想象与象征界的博弈。";
  if (style === 'Classic') styleDesc = "采用紫微斗数经典古籍风格，结合命理宿命论。";
  if (style === 'Semiotics') styleDesc = "使用结构主义符号学，拆解能指与所指。";
  if (style === 'Pictographic') styleDesc = "从汉字构件的象形演变与心理原型出发进行解读。";

  const prompt = `
    作为资深专家，请深度解析以下星曜组合：
    - 星曜：${star.name[lang]} (拉康概念: ${star.lacanConcept[lang]})
    - 宫位：${palace ? palace.name[lang] + " (" + palace.concept[lang] + ")" : "独立分析"}
    - 四化：${trans ? trans.name[lang] + " (" + trans.concept[lang] + ")" : "无"}
    - 风格：${styleDesc}

    要求：
    1. 生成约200字的深度分析报告。
    2. 解释该组合如何影响主体的欲望结构和心理地图。
    3. 给出一句深刻的哲学启示。
    请使用${targetLang}回答。
  `;

  // 1. 优先调用 Google Gemini (Google AI Studio)
  try {
    // 注意：Gemini 1.5 系列是目前主流，没有 3-pro
    const genAI = new GoogleGenAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY || ""); 
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (googleError) {
    console.error("Google AI 调用失败，尝试 GLM:", googleError);

    // 2. Google 失败，切换至 GLM
    try {
      return await callGLMApi(prompt, glm);
    } catch (glmError: any) {
      console.error("GLM 调用也失败：", glmError);
      return `解析服务暂不可用 (${glmError.message})`;
    }
  }
}

async function callGLMApi(prompt: string, glmEnv: any): Promise<string> {
  // --- 修正 1：域名必须用 .cn 避免 Redirect 导致的 CORS 报错 ---
  const GLM_API_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions";
  
  // --- 修正 2：从枚举或对象中获取正确的 Key ---
  // 注意：API Key 必须是 "id.secret" 完整格式
  const apiKey = {
      GLM_API_KEY : 'bc97425c17324342bb3a9b86af24d529',
      GLM_API_URL :  "https://open.bigmodel.ai/api/paas/v4/chat/completions",
      API_TIMEOUT_MS :  "3000000", 
      CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC : 1
    };//typeof glmEnv === 'object' ? glmEnv.GLM_API_KEY : glmEnv;


  const requestData = {
    model: "glm-4.5-flash", // 确认使用免费模型
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    stream: false
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000); 

  try {
    const response = await fetch(GLM_API_URL, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}` // 必须有 Bearer 前缀
      },
      body: JSON.stringify(requestData),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorDetail = await response.text();
      // 如果这里报 CORS，说明智谱明确禁止了从你的前端域名直接访问
      throw new Error(`HTTP ${response.status}: ${errorDetail}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "GLM 未返回有效内容";

  } catch (error: any) {
    if (error.name === 'AbortError') throw new Error("GLM 请求超时");
    throw error;
  }
}