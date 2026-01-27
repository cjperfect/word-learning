export interface VocabEntry {
  id: string;
  content: string;
  pos?: string | null;
  translation?: string | null;
  aiAnalysis?: AIAnalysis | null;
  createdAt: string;
  dateGroup: string;
}

export interface AIAnalysis {
  pos: string;
  cn: string;
  etymology: string;
  sentences: string[];
  tips: string;
}

export interface VocabGrouped {
  [dateGroup: string]: VocabEntry[];
}
