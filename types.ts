
export enum LacanRealm {
  REAL = 'REAL',
  SYMBOLIC = 'SYMBOLIC',
  IMAGINARY = 'IMAGINARY'
}

export enum StarCategory {
  MAIN = 'MAIN',
  ASSISTANT = 'ASSISTANT',
  MISC = 'MISC'
}

export type Language = 'zh' | 'en';
export type AnalysisStyle = 'Pictographic' | 'Semiotics' | 'Classic' | 'Lacanian';

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
  philosophicalInsight: LocalizedString;
  color: string;
}

export interface Palace {
  id: string;
  name: LocalizedString;
  lacanMapping: LocalizedString;
  description: LocalizedString;
}

export interface Transformation {
  id: string;
  name: LocalizedString;
  lacanMapping: LocalizedString;
  color: string;
}

export interface AnalysisState {
  selectedStarId: string | null;
  selectedCategory: StarCategory | 'ALL';
  loading: boolean;
  aiInsight: string | null;
  language: Language;
  style: AnalysisStyle;
  selectedPalaceId: string | null;
  selectedTransformationId: string | null;
}
