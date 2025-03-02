import { create } from 'zustand';
import { Quiz, Question, QuizAttempt } from '../types';

interface QuizState {
  quizzes: Quiz[];
  currentQuiz: Quiz | null;
  quizAttempts: QuizAttempt[];
  loading: boolean;
  error: string | null;
  
  fetchTeacherQuizzes: (teacherId: string) => Promise<void>;
  fetchStudentQuizzes: (studentId: string) => Promise<void>;
  fetchClassroomQuizzes: (classroomId: string) => Promise<void>;
  createQuiz: (quizData: Omit<Quiz, 'id'>) => Promise<Quiz>;
  getQuizById: (quizId: string) => Promise<Quiz | null>;
  submitQuiz: (quizAttempt: Omit<QuizAttempt, 'id' | 'submittedAt' | 'isCompleted'>) => Promise<QuizAttempt>;
  autoSubmitQuiz: (quizAttemptId: string) => Promise<void>;
}


const mockQuizAttempts: QuizAttempt[] = [];

const useQuizStore = create<QuizState>((set, get) => ({
  quizzes: [],
  currentQuiz: null,
  quizAttempts: [],
  loading: false,
  error: null,
  
  fetchTeacherQuizzes: async (teacherId: string) => {
    const accessToken = localStorage.getItem("accessToken"); // Get token
    if (!accessToken) throw new Error("Unauthorized");

    set({ loading: true, error: null });

    try {
        const response = await fetch(`http://localhost:3000/api/v1/quiz/teacher`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const quizzes = await response.json(); 
        set({ quizzes, loading: false });
    } catch (error) {
        console.error('Failed to fetch teacher quizzes:', error);
        set({ error: 'Failed to fetch quizzes', loading: false });
    }
}
,
  
fetchStudentQuizzes: async (studentId: string) => {
  const accessToken = localStorage.getItem("accessToken"); // Get token
  if (!accessToken) throw new Error("Unauthorized");

  set({ loading: true, error: null });

  try {
      const response = await fetch(`http://localhost:3000/api/v1/quiz/student`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
          }
      });

      if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
      }

      const quizzes = await response.json(); // Use real API data directly
      set({ quizzes, loading: false }); // Store the fetched quizzes

  } catch (error) {
      console.error('Failed to fetch student quizzes:', error);
      set({ error: 'Failed to fetch quizzes', loading: false });
  }
},
  
  fetchClassroomQuizzes: async (classCode: string) => {
    const accessToken = localStorage.getItem("accessToken"); // Get token
    if (!accessToken) throw new Error("Unauthorized");

    set({ loading: true, error: null });

    try {
        const response = await fetch(`http://localhost:3000/api/v1/quiz/classroom/${classCode}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) throw new Error("Failed to fetch quizzes");

        const result = await response.json();
        set({
          quizzes: Array.isArray(result.data) ? result.data : [],
          loading: false,
        });


    } catch (error) {
        console.error('Failed to fetch classroom quizzes:', error);
        set({ error: 'Failed to fetch quizzes', loading: false });
    }
},

  
  createQuiz: async (quizData: Omit<Quiz, 'id'>) => {
    const accessToken = localStorage.getItem("accessToken"); // Get token
    if (!accessToken) throw new Error("Unauthorized");

    set({ loading: true, error: null });

    try {
        const response = await fetch('http://localhost:3000/api/v1/quiz/create', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(quizData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            try {
                const errorData = JSON.parse(errorText);
                throw new Error(errorData.message || 'Failed to create quiz');
            } catch {
                throw new Error(`Unexpected response: ${errorText}`);
            }
        }

        const data = await response.json(); 
        console.log("API Response:", data, "Type:", typeof data);


        set(state => ({
          quizzes: Array.isArray(state.quizzes) ? [...state.quizzes, data] : [data], 
          loading: false
        }));

        return data;
    } catch (error) {
        console.error('Failed to create quiz:', error);
        set({ error: 'Failed to create quiz', loading: false });
        throw error;
    }
},

  
  getQuizById: async (quizId: string) => {
    set({ loading: true, error: null });
    try {
      // Mock API call - replace with actual API call
      const response = await fetch(`/api/quizzes/${quizId}`);
      const data = await response.json();
      
      // Find quiz in mock data
      // const quiz = mockQuizzes.find(q => q.id === quizId) || null;
      const quiz = data.find((q: Quiz) => q.id === quizId) || null;
      
      set({ currentQuiz: quiz, loading: false });
      return quiz;
    } catch (error) {
      console.error('Failed to fetch quiz:', error);
      set({ error: 'Failed to fetch quiz', loading: false });
      return null;
    }
  },
  
  submitQuiz: async (quizAttemptData: Omit<QuizAttempt, 'id' | 'submittedAt' | 'isCompleted'>) => {
    set({ loading: true, error: null });
    try {
      // Mock API call - replace with actual API call
      // const response = await fetch('/api/quiz-attempts', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(quizAttemptData),
      // });
      // const data = await response.json();
      
      // Create mock quiz attempt
      const newQuizAttempt: QuizAttempt = {
        ...quizAttemptData,
        id: Math.random().toString(36).substring(2, 9),
        submittedAt: new Date().toISOString(),
        isCompleted: true
      };
      
      set(state => ({ 
        quizAttempts: [...state.quizAttempts, newQuizAttempt],
        loading: false 
      }));
      
      return newQuizAttempt;
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      set({ error: 'Failed to submit quiz', loading: false });
      throw error;
    }
  },
  
  autoSubmitQuiz: async (quizAttemptId: string) => {
    set({ loading: true, error: null });
    try {
      // Mock API call - replace with actual API call
      // await fetch(`/api/quiz-attempts/${quizAttemptId}/auto-submit`, {
      //   method: 'POST',
      // });
      
      // Update mock quiz attempt
      set(state => {
        const updatedQuizAttempts = state.quizAttempts.map(attempt => {
          if (attempt.id === quizAttemptId) {
            return {
              ...attempt,
              submittedAt: new Date().toISOString(),
              isCompleted: true
            };
          }
          return attempt;
        });
        
        return { quizAttempts: updatedQuizAttempts, loading: false };
      });
    } catch (error) {
      console.error('Failed to auto-submit quiz:', error);
      set({ error: 'Failed to auto-submit quiz', loading: false });
    }
  }
}));

export default useQuizStore;