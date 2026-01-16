
export enum LacanRealm {
  REAL = 'REAL',
  SYMBOLIC = 'SYMBOLIC',
  IMAGINARY = 'IMAGINARY'
}

export interface StarMapping {
  id: string;
  name: string;
  pinyin: string;
  realm: LacanRealm;
  lacanConcept: string;
  description: string;
  traditionalMeaning: string;
  philosophicalInsight: string;
  color: string;
}

export interface AnalysisState {
  selectedStarId: string | null;
  loading: boolean;
  aiInsight: string | null;
}
