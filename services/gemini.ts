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
    请你以学者的身份，对以下【概念/现象/文本】进行深度解析。请撰写一份结构严谨、术语准确、具有哲学张力的分析报告。
    **报告要求**：
    ### 一、理论定位：在拉康三元结构中的位置
    - 将分析对象置于象征界、想象界、实在界的框架中定位。
    - 阐明其作为“能指”“裂隙”“入侵”或“对象a”等结构功能。
    - 使用**加粗关键术语**，如：**能指链**、**阉割**、**大他者**、**实在界的创伤**等。
    ### 二、心理机制：对主体欲望与认同的影响
    - 分析该对象如何影响主体的欲望结构、自我认同与心理地图。
    - 探讨其与**匮乏**、**他者欲望**、**防御机制**（如预演丧失、升华等）的关系。
    - 可结合具体心理过程展开，如欲望的非定域化、能指链断裂后的主体状态等。
    ### 三、哲学启示：从裂隙到真实
    - 提炼该对象的哲学意涵，揭示其与“真实”“异化”“自由”等命题的关联。
    - 结尾应具有**启示性与修辞张力**，例如指出该对象如何“撕开象征界的幻象”“直面实在界的荒漠”等。
    **语言风格**：
    - 学术严谨，避免通俗化解释。
    - 结构清晰，使用小标题与分段。
    - 关键概念加粗，逻辑推进紧密。
    - 在分析中体现拉康理论的纯粹性与深度。
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
    console.warn("Google AI 调用失败，尝试通过 Vercel 路由调用 GLM...");

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