
import { GoogleGenAI } from "@google/genai";
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
  onStream?: (text: string) => void // 流式输出回调
): Promise<string> {
  // Always use a new instance with the direct process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const targetLang = lang === 'zh' ? 'Chinese' : 'English';

  let styleDesc = "", styleGn = "";
  if (style === 'Lacanian') {
    styleGn = "拉康概念：" + star.lacanConcept[lang];
    styleDesc = "使用拉康精神分析视角，重点关注实在、想象与象征界的博弈。解释该组合如何影响主体的欲望结构和心理地图。";
  } else if (style === 'Classic') {
    styleGn = "斗数概念";
    styleDesc = "采用紫微斗数经典古籍风格，结合命理宿命论。";
  } else if (style === 'Semiotics') {
    styleGn = "结构主义概念";
    styleDesc = "使用结构主义符号学，拆解能指与所指。";
  } else if (style === 'Pictographic') {
    styleGn = "象形概念";
    styleDesc = "从汉字构件的象形演变与心理原型出发进行解读。";
  }

  const prompt = `
    作为资深专家，请深度解析以下星曜组合：
    - 星曜：${star.name[lang]} (${styleGn})
    - 宫位：${palace ? palace.name[lang] + " (" + palace.concept[lang] + ")" : "独立分析"}
    - 四化：${trans ? trans.name[lang] + " (" + trans.concept[lang] + ")" : "无"}
    要求：
    1. 不受历史对话记录影响，生成约200字的深度分析报告，不要有分点，并保持语言流畅。
    2. 学术严谨，结构清晰。${styleDesc}没有明确宫位和四化的情况下不要谈论该内容。
    3. 给出一句深刻的哲学启示，末尾不要加备注
  `;

  // 1. 优先调用 Google AI
  try {
    if (onStream) {
      // Use generateContentStream when a callback is provided
      const streamResponse = await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      let fullText = "";
      for await (const chunk of streamResponse) {
        // Use .text property directly
        const text = chunk.text;
        if (text) {
          fullText += text;
          onStream(fullText);
        }
      }
      return fullText;
    } else {
      // Use generateContent for a single response
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      // Use .text property directly
      return response.text || "无法生成解析。";
    }
  } catch (error) {
    console.warn("Google AI 调用失败，尝试通过 Vercel 路由调用备用流式 AI...", error);

    // 2. Fallback: 调用 Vercel /api/glm (流式解析)
    try {
      const response = await fetch('https://lacanian-ziwei-api.zeabur.app/api/glm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        const errorMsg = `API 失败: ${response.status}`;
        console.error(errorMsg);
        return errorMsg;
      }

      // 处理 ReadableStream
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      if (!reader) throw new Error("无法读取响应流");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        // SSE 格式通常以 "data: " 开头
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
