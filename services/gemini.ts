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

  // 优先调用Google AI apiKey: process.env.API_KEY
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
      return "解析发生错误，请稍后重试……version 1.1809.36，"+glm["GLM_API_URL"];
    }
  }
}

/**
 * 调用GLM API生成解析内容（使用原生fetch替代axios）
 * @param prompt 提示词
 * @param targetLang 目标语言
 * @returns 解析文本
 */
async function callGLMApi(prompt: string, targetLang: string, glmEnv: GlmEnv | string): Promise<string> {
  // 1. 安全解析配置
  let glmConfigs: any;
  try {
    glmConfigs = typeof glmEnv === 'string' ? JSON.parse(glmEnv) : glmEnv;
  } catch (e) {
    throw new Error("GLM 配置解析失败");
  }
  console.log(glmConfigs)

  const glmApiKey = glmConfigs["GLM_API_KEY"];
  const glmApiUrl = glmConfigs["GLM_API_URL"] || "https://open.bigmodel.cn/api/paas/v4/chat/completions";

  if (!glmApiKey) {
    throw new Error("GLM API密钥未配置");
  }

  // 2. 使用 AbortController 处理超时
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时

  const requestData = {
    model: "glm-4.5-flash",
    messages: [{ role: "user", content: prompt }],
    top_p: 0.9,
    stream: false
  };

  try {
    const response = await fetch(glmApiUrl, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${glmApiKey}`
      },
      body: JSON.stringify(requestData),
      signal: controller.signal // 绑定中断信号
    });

    // 清除定时器
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    if (data?.choices?.[0]?.message?.content) {
      return data.choices[0].message.content;
    } else {
      throw new Error("GLM 返回数据格式非法");
    }
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error("GLM 请求超时（10秒）");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId); // 确保定时器最终被清理
  }
}