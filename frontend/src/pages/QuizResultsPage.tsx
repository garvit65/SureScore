import React, { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { AlertTriangle, Download } from 'lucide-react';
import Button from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import QuizResults from '../components/quiz/QuizResults';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import useAuthStore from '../store/authStore';
import useQuizStore from '../store/quizStore';
import { Quiz, QuizAttempt } from '../types';

const QuizResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuthStore();
  const { quizzes, getQuizById, quizAttempts } = useQuizStore();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchQuizAndAttempts = async () => {
      if (!id) return;
      
      try {
        const fetchedQuiz = await getQuizById(id);
        setQuiz(fetchedQuiz);
        
        // Filter attempts for this quiz
        const quizAttemptsList = quizAttempts.filter(attempt => attempt.quizId === id);
        setAttempts(quizAttemptsList);
      } catch (err) {
        setError('Failed to load quiz results. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuizAndAttempts();
  }, [id, quizAttempts]);
  
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
            <p className="mt-4 text-gray-600">Loading quiz results...</p>
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
  
  // For students, show their own results
  if (user?.userType === 'student') {
    const userAttempt = attempts.find(attempt => attempt.studentId === user.id);
    
    if (!userAttempt) {
      return (
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">{quiz.title} - Results</h1>
                <p className="text-gray-600">{quiz.description}</p>
              </div>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-yellow-400 mr-3" />
                  <div>
                    <p className="font-medium text-yellow-800">No results found</p>
                    <p className="text-yellow-700">
                      You haven't attempted this quiz yet.
                    </p>
                  </div>
                </div>
              </div>
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
              <h1 className="text-2xl font-bold text-gray-900">{quiz.title} - Your Results</h1>
              <p className="text-gray-600">{quiz.description}</p>
            </div>
            
            <QuizResults quizAttempt={userAttempt} />
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // For teachers, show all student results
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">{quiz.title} - Results</h1>
            <p className="text-gray-600">{quiz.description}</p>
          </div>
          
          {/* Summary card */}
          <Card className="mb-8">
            <CardHeader className="bg-gray-50">
              <CardTitle>Quiz Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">Total Students</p>
                  <p className="text-3xl font-bold text-blue-600">{attempts.length}</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-green-800">Average Score</p>
                  <p className="text-3xl font-bold text-green-600">
                    {attempts.length > 0 
                      ? `${Math.round(attempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0) / attempts.length)}%` 
                      : 'N/A'}
                  </p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-purple-800">Completion Rate</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {`${Math.round((attempts.length / (quiz.questions.length || 1)) * 100)}%`}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Results
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Student results */}
          <h2 className="text-xl font-semibold mb-4">Student Results</h2>
          
          {attempts.length > 0 ? (
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Confidence Accuracy
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted At
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {attempts.map((attempt) => (
                      <tr key={attempt.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">Student Name</div>
                          <div className="text-sm text-gray-500">{attempt.studentId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            (attempt.score || 0) >= 80 
                              ? 'bg-green-100 text-green-800' 
                              : (attempt.score || 0) >= 60 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {attempt.score || 0}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          85% {/* Mock data */}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {attempt.submittedAt 
                            ? new Date(attempt.submittedAt).toLocaleString() 
                            : 'Not submitted'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No results yet</h3>
              <p className="text-gray-600">
                No students have attempted this quiz yet.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default QuizResultsPage;