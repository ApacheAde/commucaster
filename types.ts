
export interface Article {
  id: string;
  title: string;
  content: string;
}

export type Topic = 'Technology' | 'Business' | 'Science' | 'Health' | 'Sports' | 'Politics' | 'Entertainment' | 'World';

export interface SummaryConfig {
  tone: 'professional' | 'casual' | 'enthusiastic' | 'concise';
  voice: 'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr';
  focus: string;
  topics: Topic[];
}

export interface AudioSummary {
  id: string;
  text: string;
  audioBuffer: AudioBuffer | null;
  timestamp: number;
  config: SummaryConfig;
}

export interface Playlist {
  id: string;
  name: string;
  summaryIds: string[];
}
