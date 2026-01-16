
export enum LacanRealm {
  REAL = 'REAL',
  SYMBOLIC = 'SYMBOLIC',
  IMAGINARY = 'IMAGINARY'
}

export enum StarCategory {
  MAIN = 'MAIN',
  LUCKY = 'LUCKY',
  MALEFIC = 'MALEFIC',
  MISC = 'MISC'
}

export interface StarMapping {
  id: string;
  name: string;
  pinyin: string;
  realm: LacanRealm;
  category: StarCategory;
  lacanConcept: string;
  description: string;
  traditionalMeaning: string;
  philosophicalInsight: string;
  color: string;
}

export interface AnalysisState {
  selectedStarId: string | null;
  selectedCategory: StarCategory | 'ALL';
  loading: boolean;
  aiInsight: string | null;
}
