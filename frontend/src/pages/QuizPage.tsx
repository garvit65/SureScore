import React, { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Clock, AlertTriangle } from 'lucide-react';
import Button from '../components/ui/Button';
import QuizAttempt from '../components/quiz/QuizAttempt';
import QuizResults from '../components/quiz/QuizResults';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import useAuthStore from '../store/authStore';
import useQuizStore from '../store/quizStore';
import { Quiz, QuizAttempt as QuizAttemptType } from '../types';

const QuizPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuthStore();
  const { quizzes, getQuizById, quizAttempts } = useQuizStore();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [quizAttempt, setQuizAttempt] = useState<QuizAttemptType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchQuiz = async () => {
      if (!id) return;
      
      try {
        const fetchedQuiz = await getQuizById(id);
        setQuiz(fetchedQuiz);
        
        // Check if user has already attempted this quiz
        if (user) {
          const userAttempt = quizAttempts.find(
            attempt => attempt.quizId === id && attempt.studentId === user.id
          );
          setQuizAttempt(userAttempt || null);
        }
      } catch (err) {
        setError('Failed to load quiz. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuiz();
  }, [id, user, quizAttempts]);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading quiz...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (error || !quiz) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
            <h2 className="text-xl font-semibold mt-4">Quiz not found</h2>
            <p className="mt-2 text-gray-600">{error || "The quiz you're looking for doesn't exist or you don't have access to it."}</p>
            <Link to="/dashboard" className="mt-4 inline-block">
              <Button>Back to Dashboard</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Check if quiz is active
  const now = new Date();
  const startTime = new Date(quiz.startTime);
  const endTime = new Date(quiz.endTime);
  const isActive = startTime <= now && endTime >= now;
  const isUpcoming = startTime > now;
  const isCompleted = endTime < now;
  
  // If student has already completed the quiz, show results
  if (quizAttempt && quizAttempt.isCompleted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">{quiz.title} - Results</h1>
              <p className="text-gray-600">{quiz.description}</p>
            </div>
            
            <QuizResults quizAttempt={quizAttempt} />
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
            <p className="text-gray-600">{quiz.description}</p>
            
            <div className="mt-4 flex items-center text-gray-600">
              <Clock className="h-5 w-5 mr-2" />
              <span>Duration: {quiz.duration} minutes</span>
            </div>
          </div>
          
          {isUpcoming && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-yellow-400 mr-3" />
                <div>
                  <p className="font-medium text-yellow-800">This quiz is not yet available</p>
                  <p className="text-yellow-700">
                    The quiz will be available on {startTime.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {isCompleted && !quizAttempt && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-red-400 mr-3" />
                <div>
                  <p className="font-medium text-red-800">This quiz has ended</p>
                  <p className="text-red-700">
                    The quiz ended on {endTime.toLocaleString()} and you did not attempt it.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {isActive && user?.userType === 'student' && (
            <QuizAttempt quiz={quiz} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default QuizPage;