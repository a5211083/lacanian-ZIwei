import { GoogleGenAI } from "@google/genai";
import { StarMapping, Language, AnalysisStyle, Palace, Transformation, GlmEnv } from "../types";

// 移除axios依赖，使用原生fetch实现HTTP请求

export async function getDetailedAnalysis(
  star: StarMapping, 
  palace: Palace | null,
  trans: Transformation | null,
  lang: Language = 'zh', 
  style: AnalysisStyle = 'Lacanian',
  glm: GlmEnv
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

  // 优先调用Google AI
  try {
    const ai = new GoogleGenAI({ apiKey: glm.name[API_KEY] });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    return response.text || "无法生成解析。";
  } catch (googleError) {
    console.error("Google AI调用失败，切换至GLM：", googleError);
    // Google AI失败时，调用GLM
    try {
      return await callGLMApi(prompt, targetLang, glm);
    } catch (glmError) {
      console.error("GLM调用也失败：", glmError);
      return "解析发生错误，请稍后重试……";
    }
  }
}

/**
 * 调用GLM API生成解析内容（使用原生fetch替代axios）
 * @param prompt 提示词
 * @param targetLang 目标语言
 * @returns 解析文本
 */
async function callGLMApi(prompt: string, targetLang: string, glmstring: string): Promise<string> {
  // 替换为实际的GLM API地址和密钥
  const glm = JSON.parse(glmstring);

  const glmApiKey = glm.name["GLM_API_KEY"];
  const glmApiUrl = glm.name["ANTHROPIC_BASE_URL"] || "https://open.bigmodel.cn/api/paas/v4/chat/completions";

  if (!glmApiKey) {
    throw new Error("GLM API密钥未配置");
  }

  const requestData = {
    model: "glm-4", // 根据实际使用的GLM模型调整
    messages: [
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 500, // 确保能生成200字左右的内容
    top_p: 0.9,
    stream: false
  };

  try {
    // 使用原生fetch发送POST请求
    const response = await fetch(glmApiUrl, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${glmApiKey}`
      },
      body: JSON.stringify(requestData),
      timeout: 10000 // fetch本身不支持timeout，下面手动实现超时控制
    });

    // 手动实现超时控制
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("请求超时")), 10000);
    });

    // 竞赛机制：要么请求完成，要么超时
    const raceResponse = await Promise.race([response, timeoutPromise]) as Response;

    // 检查HTTP响应状态
    if (!raceResponse.ok) {
      throw new Error(`GLM API请求失败，状态码：${raceResponse.status}`);
    }

    // 解析JSON响应
    const data = await raceResponse.json();

    // 处理GLM返回结果
    if (data && data.choices && data.choices.length > 0) {
      return data.choices[0].message.content || "无法生成解析。";
    } else {
      throw new Error("GLM返回格式异常");
    }
  } catch (error) {
    // 统一捕获fetch相关错误
    if (error instanceof Error) {
      throw new Error(`GLM API调用失败：${error.message}`);
    } else {
      throw new Error("GLM API调用出现未知错误");
    }
  }
}