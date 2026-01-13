
export type Language = 'en' | 'zh';

export interface BilingualField {
  en: string;
  zh: string;
}

export interface EventTemplate {
  label: BilingualField;
  text: BilingualField;
  icon: string;
}

export interface WorldConfig {
  worldDefinition: string;
  protagonistMale: string;
  protagonistFemale: string;
  supportingCharacters: string;
  storyOutline: string;
  narrativeStyle: string;
  artStyle: string;
  dynamicSlots: string[];
  eventTemplates: EventTemplate[];
}

export interface SimulationTurn {
  id: string;
  timestamp: number;
  dialogue: string;
  imagePrompt: string;
  imageUrl?: string;
  incident?: string;
  branchImpact?: string;
}

export interface SimulationResponse {
  dialogue: string;
  imagePrompt: string;
  branchImpact: string;
}
