export type UserType = 'teacher' | 'student';

export interface User {
  id: string;
  fullname: string;
  email: string;
  userType: UserType;
}

export interface Classroom {
  id: string;
  name: string;
  description: string;
  classCode: string;
  teacher: string;
  students: User[];
  quizzes: Quiz[];
}

export type QuestionType = 'mcq' | 'true-false';

export interface Question {
  // id: string;
  questionText: string;
  questionType: QuestionType;
  options: string[];
  correctOption: string | number;
  // topic: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  classCode: string;
  questions: Question[];
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  createdBy: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  studentId: string;
  answers: {
    questionId: string;
    selectedAnswer: string | number;
    confidenceLevel: number;
  }[];
  startedAt: string;
  submittedAt: string | null;
  isCompleted: boolean;
  score?: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullname: string, email: string, password: string, userType: UserType) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}