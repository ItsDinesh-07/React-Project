export type UserRole = 
  | 'Main Admin' 
  | 'Admin' 
  | 'Vendor' 
  | 'Direct College' 
  | 'Direct Client' 
  | 'Student / Candidate';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  selectedRole?: string; // e.g. "Java Developer", "Frontend Developer"
  joinedDate: string;
  institution?: string; // High-school or college name
}

export type QuestionCategory = 'Technical' | 'HR' | 'Aptitude' | 'Communication' | 'Mixed';

export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface PracticeSession {
  id: string;
  category: QuestionCategory;
  role: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questions: Question[];
  currentIdx: number;
  answers: { [idx: number]: string };
  score: number;
  completed: boolean;
  timestamp: string;
}

export interface ResumeReport {
  id: string;
  fileName: string;
  atsScore: number;
  formattingScore: number;
  keywordsScore: number;
  experienceScore: number;
  missingSkills: string[];
  feedback: string[];
  timestamp: string;
}

export interface StudyPlanTask {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  duration: string;
  completed: boolean;
}

export interface UserProgress {
  totalAttempted: number;
  correctAnswers: number;
  wrongAnswers: number;
  streak: number;
  completedTasks: string[]; // Task IDs
  categoryProgress: { [category: string]: number }; // percentage 0-100
  roleProgress: { [role: string]: number }; // percentage 0-100
}
