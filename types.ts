
export enum LacanRealm {
  REAL = 'REAL',
  SYMBOLIC = 'SYMBOLIC',
  IMAGINARY = 'IMAGINARY'
}

export enum StarCategory {
  MAIN = 'MAIN',
  ASSISTANT = 'ASSISTANT', // 六吉六煞
  MISC = 'MISC',           // 杂曜
  PALACE = 'PALACE',
  TRANSFORMATION = 'TRANSFORMATION'
}

export type Language = 'zh' | 'en';
export type AnalysisStyle = 'Lacanian' | 'Classic' | 'Semiotics' | 'Pictographic';

export interface LocalizedString {
  zh: string;
  en: string;
}

export interface StarMapping {
  id: string;
  name: LocalizedString;
  pinyin: string;
  realm: LacanRealm;
  category: StarCategory;
  lacanConcept: LocalizedString;
  description: LocalizedString;
  traditionalMeaning: LocalizedString;
  color: string;
  canTransform?: {
    lu?: boolean;
    quan?: boolean;
    ke?: boolean;
    ji?: boolean;
  };
}

export interface Palace {
  id: string;
  name: LocalizedString;
  concept: LocalizedString;
}

export interface Transformation {
  id: string;
  name: LocalizedString;
  color: string;
  concept: LocalizedString;
}

export interface ChartPalace {
  id: string;
  palaceName: LocalizedString;
  branch: string;
  stars: StarMapping[];
}

export interface AnalysisState {
  selectedStar: StarMapping | null;
  selectedPalace: Palace | null;
  selectedTrans: Transformation | null;
  style: AnalysisStyle;
  loading: boolean;
  aiInsight: string | null;
  language: Language;
}
