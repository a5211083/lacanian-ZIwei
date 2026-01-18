import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { StarMapping, Language, AnalysisStyle, Palace, Transformation } from "../types";

/**
 * 获取深度解析报告
 * @param onStream 可选回调，用于实现打字机流式效果
 */
export async function getDetailedAnalysis(
  star: StarMapping, 
  palace: Palace | null,
  trans: Transformation | null,
  lang: Language = 'zh', 
  style: AnalysisStyle = 'Lacanian',
  onStream?: (text: string) => void
): Promise<string> {
  // Fix: Initialize GoogleGenAI instance according to SDK guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
    1. 生成约200字的深度分析报告，不要生成带格式的文本（不要Markdown加粗），并保持语言流畅。
    2. 解释该组合如何影响主体的欲望结构和心理地图。学术严谨，避免通俗化解释，结构清晰。
    3. 给出一句深刻的哲学启示。
    请使用${targetLang}回答。
  `;

  let fullText = "";

  // 1. 优先调用 Google AI (使用流式接口)
  try {
    // Fix: Using gemini-3-flash-preview for text generation tasks
    const result = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    for await (const chunk of result) {
      // Fix: chunk.text is a property, not a method
      const text = chunk.text;
      if (text) {
        fullText += text;
        if (onStream) onStream(fullText);
      }
    }
    return fullText;
  } catch (error) {
    console.warn("Google AI 调用失败，尝试通过 Vercel 路由调用备用流式 AI...");

    // 2. Fallback: 调用 Vercel /api/glm (流式解析)
    try {
      const response = await fetch('/api/glm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        throw new Error(`API 失败: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("无法读取响应流");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");
        
        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine || trimmedLine === "data: [DONE]") continue;
          
          if (trimmedLine.startsWith("data: ")) {
            try {
              const json = JSON.parse(trimmedLine.slice(6));
              const content = json.choices[0]?.delta?.content || "";
              fullText += content;
              if (onStream) onStream(fullText);
            } catch (e) {
              // 忽略不完整的 JSON 块
            }
          }
        }
      }

      return fullText;
    } catch (e: any) {
      return "网络连接失败或后端接口崩溃: " + e.message;
    }
  }
}