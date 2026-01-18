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
  onStream?: (text: string) => void // 新增：流式输出回调
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  const targetLang = lang === 'zh' ? 'Chinese' : 'English';

  let styleDesc = "";
  if (style === 'Lacanian') styleDesc = "使用拉康精神分析视角，重点关注实在、想象与象征界的博弈。解释该组合如何影响主体的欲望结构和心理地图。";
  if (style === 'Classic') styleDesc = "采用紫微斗数经典古籍风格，结合命理宿命论。";
  if (style === 'Semiotics') styleDesc = "使用结构主义符号学，拆解能指与所指。";
  if (style === 'Pictographic') styleDesc = "从汉字构件的象形演变与心理原型出发进行解读。";

  const prompt = `
    作为资深专家，请深度解析以下星曜组合：
    - 星曜：${star.name[lang]} (拉康概念: ${star.lacanConcept[lang]})
    - 宫位：${palace ? palace.name[lang] + " (" + palace.concept[lang] + ")" : "独立分析"}
    - 四化：${trans ? trans.name[lang] + " (" + trans.concept[lang] + ")" : "无"}
    要求：
    1. 生成约200字的深度分析报告，不要有分点，并保持语言流畅。
    2. 学术严谨，结构清晰。${styleDesc}没有明确宫位和四化的情况下不要谈论该内容。
    3. 给出一句深刻的哲学启示，末尾不要加备注
    请使用${targetLang}回答。
  `;

  // 1. 优先调用 Google AI (保持原样)
  try {
    const response = await (ai as any).models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    const text = response.text || "无法生成解析。";
    if (onStream) onStream(text); // 如果 Google 成功，直接一次性回调
    return text;
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
              // 兼容 SiliconFlow/OpenAI 的流式格式: choices[0].delta.content
              const content = json.choices[0]?.delta?.content || "";
              
              // 如果你需要看到 DeepSeek R1 的思考过程，可以加上这行：
              // const reasoning = json.choices[0]?.delta?.reasoning_content || "";
              
              fullText += content;
              if (onStream) onStream(fullText); // 实时触发回调，UI 会即时更新
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