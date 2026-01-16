
import { GoogleGenAI } from "@google/genai";
import { StarMapping } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getDetailedAnalysis(star: StarMapping): Promise<string> {
  const prompt = `
    作为一位世界顶级的拉康派精神分析学家和紫微斗数专家，请深入剖析“${star.name}（${star.pinyin}）”星。
    它被分类在拉康的“${star.realm}”中，对应的核心概念是“${star.lacanConcept}”。
    
    请结合以下内容进行150字左右的深度解读：
    1. 为什么它是这个拉康概念的体现？
    2. 它在主体构建欲望的过程中扮演什么角色？
    3. 给命宫有此星的人一个拉康式的哲学建议。
    
    语气要专业、神秘且富有哲学深度。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "无法生成深度分析。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "解析过程中星曜隐没，请稍后再试。";
  }
}
