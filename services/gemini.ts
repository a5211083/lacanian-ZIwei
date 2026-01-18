import { GoogleGenAI } from "@google/genai";
import { StarMapping, Language, AnalysisStyle, Palace, Transformation } from "../types";
import * as Iztro from 'iztro';

export async function getDetailedAnalysis(
  star: StarMapping, 
  palace: Palace | null,
  trans: Transformation | null,
  lang: Language = 'zh', 
  style: AnalysisStyle = 'Lacanian'
): Promise<string> {
  // 保留你原来的 Google 配置
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
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
    2. 解释该组合如何影响主体的欲望结构和心理地图,给出不少于两个学术概念（包括概念英文名称）。学术严谨，避免通俗化解释，结构清晰。
    3. 给出一句深刻的哲学启示。
    请使用${targetLang}回答。
  `;

  // 1. 优先调用 Google AI (保持你的原样)
  try {
    const response = await (ai as any).models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    return response.text || "无法生成解析。";
  } catch (error) {
    console.warn("Google AI 调用失败，尝试通过 Vercel 路由调用备用AI...");

    // 2. Google 失败时，请求我们自己的 Vercel API 路由
    // 前端 fetch 部分修改建议
    try {
      const glmResponse = await fetch('/api/glm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      const result = await glmResponse.json();

      if (!glmResponse.ok) {
        // 这样你会看到具体的错误原因，比如 "API Key 格式不对" 之类的
        const errorMsg = `GLM 失败: ${result.error || '未知错误'}. ${result.detail || ''}`;
        console.error(errorMsg);
        return errorMsg; 
      }

      return result.choices[0].message.content;
    } catch (e: any) {
      return "网络连接失败或后端接口崩溃: " + e.message;
    }
  }
}