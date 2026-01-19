
export enum LacanRealm {
  REAL = 'REAL',
  SYMBOLIC = 'SYMBOLIC',
  IMAGINARY = 'IMAGINARY'
}

export enum StarCategory {
  GRADE_A = 'GRADE_A', // 甲级
  GRADE_B = 'GRADE_B', // 乙级
  GRADE_C = 'GRADE_C', // 丙级
  GRADE_D = 'GRADE_D', // 丁级
  GRADE_E = 'GRADE_E'  // 戊级
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
