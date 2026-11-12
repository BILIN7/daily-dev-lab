export type Category = 
  | 'Utility'
  | 'Algorithm Visualizer'
  | 'Security & Auth'
  | 'CSS & UI Studio'
  | 'Web API & Parsers'
  | 'Mini Game'
  | 'Data Structure';

export interface ProjectDay {
  day: number;
  id: string;
  title: string;
  tagline: string;
  category: Category;
  date: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  complexity?: {
    time: string;
    space: string;
  };
  keyTakeaway: string;
  description: string;
  component: React.ComponentType;
  codeSnippet: string;
}

export interface DayIdea {
  day: number;
  title: string;
  category: Category;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  suggestedTags: string[];
}
