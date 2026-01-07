export interface Todo {
  id: string;
  task: string;
  date: string;
  duration: number;
  completed: boolean;
}

export interface WeeklyStats {
  total: number;
  completed: number;
  notCompleted: number;
  totalDuration: number;
  weekStart: string;
  weekEnd: string;
}

export interface Track {
  id: string;
  name: string;
  order: number;
  createdAt: string;
  totalTopics: number;
  completedTopics: number;
}

export interface TopicNote {
  id: string;
  topicId: string;
  keyIdea?: string;
  example?: string;
  recallQuestion?: string;
  updatedAt: string;
}

export interface Topic {
  id: string;
  title: string;
  targetMinutes: number;
  scheduledDate?: string;
  completed: boolean;
  lastStudiedAt?: string;
  sourceUrl?: string;
  userId: string;
  trackId: string;
  createdAt: string;
  updatedAt: string;
  note?: TopicNote;
  track?: {
    name: string;
  };
}

export interface LearningWeeklyStats {
  total: number;
  completed: number;
  remaining: number;
  timeMinutes: number;
}

