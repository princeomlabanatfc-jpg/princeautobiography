export type Stage = 'ENTRY' | 'PREPARATION' | 'THRESHOLD' | 'CONVERSATION' | 'AUTOBIOGRAPHY' | 'MOMENTS' | 'REFLECTION' | 'FAREWELL';

export type ActThemeMode = 'ground' | 'ascend' | 'dawn' | 'night';

export interface BeatQuote {
  text: string;
  author?: string;
}

export interface BeatImage {
  url: string;
  title: string;
  description?: string;
}

export interface BeatSubsection {
  category: string;
  questions: string[];
}

export interface BeatData {
  id: string; // e.g. 'act-1-beat-1'
  actId: string; // e.g. 'I', 'II', 'VIII', 'IX'
  numberLabel: string; // e.g. '01 — Ahmedabad'
  title: string; // e.g. 'I was born in Ahmedabad.'
  paragraphs: string[];
  emphasisParagraphs?: number[]; // indices of paragraphs to highlight
  quote?: BeatQuote;
  images?: BeatImage[];
  subsections?: BeatSubsection[];
  endingParagraphs?: string[];
}

export interface ActData {
  actId: string; // 'I', 'II', ..., 'IX'
  title: string;
  themeMode: ActThemeMode;
  kicker: string;
  beats: BeatData[];
  teaserText?: string;
  pivotText?: string;
}

export interface PreparationCondition {
  id: number;
  text: string;
  subtext: string;
}

export interface ObservationMoment {
  id: string;
  title: string;
  category: string;
  detail: string;
  note: string;
  reflectionPrompt?: string;
}

export interface UserState {
  isUnlocked: boolean;
  activeActId: string;
  activeBeatId: string;
  readingProgress: number; // 0 to 100
  fontSizePx: number; // 15, 16, 18, 20
  bookmarks: string[]; // beat ids
}

