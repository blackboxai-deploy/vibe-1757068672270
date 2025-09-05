// Core Types for EduAI Platform

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'student' | 'professor' | 'admin';

export interface Assessment {
  id: string;
  title: string;
  description: string;
  type: AssessmentType;
  createdBy: string;
  difficulty: DifficultyLevel;
  language: Language;
  duration?: number; // in minutes
  questions: Question[];
  settings: AssessmentSettings;
  createdAt: string;
  updatedAt: string;
}

export type AssessmentType = 'code-questions' | 'code-review' | 'ai-exam';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type Language = 'en' | 'fr';

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  content: string;
  options?: QuestionOption[];
  correctAnswer?: string | string[];
  explanation?: string;
  difficulty: DifficultyLevel;
  points: number;
  metadata?: QuestionMetadata;
}

export type QuestionType = 'multiple-choice' | 'code-completion' | 'free-text' | 'code-review';

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuestionMetadata {
  tags: string[];
  topic: string;
  estimatedTime: number; // in minutes
  skillLevel: string[];
}

export interface AssessmentSettings {
  randomizeQuestions: boolean;
  randomizeOptions: boolean;
  showResults: boolean;
  allowRetakes: boolean;
  timeLimit?: number; // in minutes
  passingScore?: number; // percentage
}

export interface Submission {
  id: string;
  assessmentId: string;
  userId: string;
  answers: SubmissionAnswer[];
  score: number;
  maxScore: number;
  percentage: number;
  status: SubmissionStatus;
  startedAt: string;
  completedAt?: string;
  timeSpent: number; // in seconds
}

export type SubmissionStatus = 'started' | 'completed' | 'graded' | 'abandoned';

export interface SubmissionAnswer {
  questionId: string;
  answer: string | string[];
  isCorrect: boolean;
  pointsEarned: number;
  feedback?: string;
}

export interface CodeReviewRequest {
  id: string;
  code: string;
  language: string;
  specifications?: string;
  standards?: string;
  userId: string;
  createdAt: string;
}

export interface CodeReviewResponse {
  id: string;
  requestId: string;
  analysis: CodeAnalysis;
  improvements: CodeImprovement[];
  helperQuestions: HelperQuestion[];
  overallScore: number;
  createdAt: string;
}

export interface CodeAnalysis {
  readability: number;
  performance: number;
  security: number;
  maintainability: number;
  bestPractices: number;
  comments: string[];
}

export interface CodeImprovement {
  line: number;
  type: 'error' | 'warning' | 'suggestion';
  message: string;
  suggestion: string;
  priority: 'high' | 'medium' | 'low';
}

export interface HelperQuestion {
  question: string;
  context: string;
  suggestedResponse: string;
}

export interface ExamGenerationRequest {
  latexContent: string;
  numberOfQuestions: number;
  difficulty: DifficultyLevel;
  language: Language;
  topic?: string;
}

export interface AIResponse {
  success: boolean;
  data?: any;
  error?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface DashboardStats {
  totalAssessments: number;
  completedAssessments: number;
  averageScore: number;
  totalStudents?: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'assessment_completed' | 'assessment_created' | 'code_reviewed';
  title: string;
  description: string;
  timestamp: string;
  userId: string;
  userName: string;
}

export interface ReportData {
  assessmentId: string;
  assessmentTitle: string;
  submissions: Submission[];
  analytics: {
    averageScore: number;
    completionRate: number;
    difficultyDistribution: Record<DifficultyLevel, number>;
    commonMistakes: string[];
    timeAnalysis: {
      averageTime: number;
      quickestCompletion: number;
      slowestCompletion: number;
    };
  };
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  role: UserRole;
}

export interface CreateAssessmentForm {
  title: string;
  description: string;
  type: AssessmentType;
  difficulty: DifficultyLevel;
  language: Language;
  duration?: number;
  settings: AssessmentSettings;
}