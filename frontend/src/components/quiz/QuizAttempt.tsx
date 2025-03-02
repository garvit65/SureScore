import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, AlertTriangle } from 'lucide-react';
import Button from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { Quiz, QuizAttempt as QuizAttemptType } from '../../types';
import useQuizStore from '../../store/quizStore';
import useAuthStore from '../../store/authStore';
import { formatTime } from '../../lib/utils';

interface QuizAttemptProps {
  quiz: Quiz;
}

const QuizAttempt: React.FC<QuizAttemptProps> = ({ quiz }) => {
  const { user } = useAuthStore();
  const { submitQuiz, autoSubmitQuiz } = useQuizStore();
  const navigate = useNavigate();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string; selectedAnswer: number | null; confidenceLevel: number | null }[]>(
    quiz.questions.map(q => ({ questionId: q.id, selectedAnswer: null, confidenceLevel: null }))
  );
  const [timeRemaining, setTimeRemaining] = useState(quiz.duration * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tabSwitchWarning, setTabSwitchWarning] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  
  // Handle timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Handle tab switching detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount(prev => prev + 1);
        setTabSwitchWarning(true);
        
        if (tabSwitchCount >= 2) {
          handleAutoSubmit();
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [tabSwitchCount]);
  
  const handleAnswerSelect = (answerIndex: number) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex].selectedAnswer = answerIndex;
    setAnswers(updatedAnswers);
  };
  
  const handleConfidenceSelect = (level: number) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex].confidenceLevel = level;
    setAnswers(updatedAnswers);
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };
  
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  const handleSubmit = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      // Filter out any unanswered questions
      const validAnswers = answers.filter(
        answer => answer.selectedAnswer !== null && answer.confidenceLevel !== null
      );
      
      // Create quiz attempt
      const quizAttempt: Omit<QuizAttemptType, 'id' | 'submittedAt' | 'isCompleted'> = {
        quizId: quiz.id,
        studentId: user.id,
        answers: validAnswers.map(a => ({
          questionId: a.questionId,
          selectedAnswer: a.selectedAnswer as number,
          confidenceLevel: a.confidenceLevel as number
        })),
        startedAt: new Date().toISOString(),
      };
      
      await submitQuiz(quizAttempt);
      navigate(`/quizzes/${quiz.id}/results`);
    } catch (error) {
      console.error('Failed to submit quiz:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleAutoSubmit = async () => {
    if (!user) return;
    
    try {
      // Create a temporary ID for the quiz attempt
      const tempAttemptId = `temp-${Date.now()}`;
      
      // Filter out any unanswered questions
      const validAnswers = answers.filter(
        answer => answer.selectedAnswer !== null && answer.confidenceLevel !== null
      );
      
      // Create quiz attempt
      const quizAttempt: Omit<QuizAttemptType, 'id' | 'submittedAt' | 'isCompleted'> = {
        quizId: quiz.id,
        studentId: user.id,
        answers: validAnswers.map(a => ({
          questionId: a.questionId,
          selectedAnswer: a.selectedAnswer as number,
          confidenceLevel: a.confidenceLevel as number
        })),
        startedAt: new Date().toISOString(),
      };
      
      await submitQuiz(quizAttempt);
      navigate(`/quizzes/${quiz.id}/results`);
    } catch (error) {
      console.error('Failed to auto-submit quiz:', error);
    }
  };
  
  const isQuestionAnswered = (index: number) => {
    return answers[index].selectedAnswer !== null && answers[index].confidenceLevel !== null;
  };
  
  const allQuestionsAnswered = answers.every(
    answer => answer.selectedAnswer !== null && answer.confidenceLevel !== null
  );
  
  return (
    <div className="space-y-6">
      {/* Header with timer and progress */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <span className="font-medium">Question {currentQuestionIndex + 1} of {totalQuestions}</span>
        </div>
        <div className="flex items-center text-red-600 font-medium">
          <Clock className="h-5 w-5 mr-2" />
          <span>{formatTime(timeRemaining)}</span>
        </div>
      </div>
      
      {/* Tab switch warning */}
      {tabSwitchWarning && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-400 mr-3 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-800">Warning: Tab switching detected!</p>
            <p className="text-yellow-700">
              Switching tabs during the quiz is not allowed. Your quiz will be automatically submitted after 3 tab switches.
              Current count: {tabSwitchCount}/3
            </p>
          </div>
        </div>
      )}
      
      {/* Question card */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">{currentQuestion.text}</h3>
          
          <div className="space-y-4">
            {/* Answer options */}
            <div className="space-y-2">
              <p className="font-medium">Select your answer:</p>
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="radio"
                    id={`option-${index}`}
                    name="answer"
                    checked={answers[currentQuestionIndex].selectedAnswer === index}
                    onChange={() => handleAnswerSelect(index)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor={`option-${index}`} className="ml-2 block">
                    {option}
                  </label>
                </div>
              ))}
            </div>
            
            {/* Confidence level */}
            <div className="pt-4 border-t border-gray-200">
              <p className="font-medium mb-2">How confident are you in your answer?</p>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => handleConfidenceSelect(level)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      answers[currentQuestionIndex].confidenceLevel === level
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                1 = Not confident at all, 5 = Very confident
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Navigation buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>
        
        <div className="flex space-x-2">
          {currentQuestionIndex === totalQuestions - 1 ? (
            <Button
              onClick={handleSubmit}
              isLoading={isSubmitting}
              disabled={!isQuestionAnswered(currentQuestionIndex)}
            >
              Submit Quiz
            </Button>
          ) : (
            <Button
              onClick={handleNextQuestion}
              disabled={!isQuestionAnswered(currentQuestionIndex)}
            >
              Next
            </Button>
          )}
        </div>
      </div>
      
      {/* Question navigation */}
      <div className="pt-4 border-t border-gray-200">
        <p className="text-sm font-medium mb-2">Question Navigation:</p>
        <div className="flex flex-wrap gap-2">
          {quiz.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                currentQuestionIndex === index
                  ? 'bg-blue-600 text-white'
                  : isQuestionAnswered(index)
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      
      {/* Submit button for all questions */}
      {allQuestionsAnswered && (
        <div className="pt-4 border-t border-gray-200">
          <Button
            onClick={handleSubmit}
            isLoading={isSubmitting}
            fullWidth
            variant="primary"
          >
            Submit All Answers
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuizAttempt;