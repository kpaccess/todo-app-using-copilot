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
