export interface Task {
    id: string;
    title: string;
    description: string;
    quadrant: 'important-urgent' | 'important-not-urgent' | 'not-important-urgent' | 'not-important-not-urgent';
    createdAt: string;
  }
  
  export interface Quadrant {
    id: 'important-urgent' | 'important-not-urgent' | 'not-important-urgent' | 'not-important-not-urgent';
    title: string;
    description: string;
    tasks: Task[];
  }