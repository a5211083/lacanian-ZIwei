
import { GoogleGenAI } from "@google/genai";
import { StarMapping, Language, AnalysisStyle } from "../types";

export async function getDetailedAnalysis(
  star: StarMapping, 
  lang: Language = 'zh', 
  style: AnalysisStyle = 'Semiotics'
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const contentName = star.name[lang];
  const contentRealm = star.realm;
  const contentConcept = star.lacanConcept[lang];
  const targetLang = lang === 'zh' ? 'Chinese' : 'English';

  let styleInstruction = "";
  switch (style) {
    case 'Pictographic':
      styleInstruction = lang === 'zh' 
        ? "着重于汉字的象形本源、甲骨文/金文演变及其与心理结构的原始关联。" 
        : "Focus on the pictographic origins of the Chinese characters, their evolution from Oracle Bone script, and their primal connection to psychological structures.";
      break;
    case 'Semiotics':
      styleInstruction = lang === 'zh' 
        ? "使用索绪尔符号学（能指与所指）与结构主义的角度进行拆解。" 
        : "Use the perspective of Saussurean semiotics (signifier and signified) and structuralism.";
      break;
    case 'Classic':
      styleInstruction = lang === 'zh' 
        ? "引用《紫微斗数全书》原文精髓，结合古籍风格进行命理与心性的交织解析。" 
        : "Quote the essence of 'Zi Wei Dou Shu Quan Shu' original texts, combining classical style with numerological and mental analysis.";
      break;
    case 'Lacanian':
      styleInstruction = lang === 'zh' 
        ? "深钻拉康精神分析的核心：不仅限于镜像阶段，更要触及实在界之恐怖、欲望之辩证法、能指的大它者地位等硬核概念。" 
        : "Deep dive into the core of Lacanian psychoanalysis: beyond the mirror stage, touching on hard concepts like the horror of the Real, the dialectic of desire, and the position of the Big Other.";
      break;
  }

  const systemInstruction = `
    You are a world-class Lacanian psychoanalyst and Zi Wei Dou Shu expert.
    Current Analysis Style: ${styleInstruction}
    Respond exclusively in ${targetLang}.
  `;

  const prompt = `
    Analyze the star "${contentName}" (${star.pinyin}).
    Lacanian Realm: "${contentRealm}".
    Lacanian Concept: "${contentConcept}".
    
    Structure your response (around 150 words):
    1. A deep synthesis of the star based on the chosen style (${style}).
    2. Its role in the subject's desire and psychic structure.
    3. A philosophical advice reflecting this specific interpretation.
    
    Maintain a profound, scholarly, and insightful tone.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      }
    });
    return response.text || (lang === 'zh' ? "无法生成深度分析。" : "Unable to generate analysis.");
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return lang === 'zh' ? "解析过程中出现波动，请重试。" : "Analysis fluctuated. Please try again.";
  }
}
