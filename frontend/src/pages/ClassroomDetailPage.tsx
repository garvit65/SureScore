import React, { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { PlusCircle, Users, BookOpen, UserMinus } from 'lucide-react';
import Button from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import QuizCard from '../components/quiz/QuizCard';
import CreateQuizForm from '../components/quiz/CreateQuizForm';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import useAuthStore from '../store/authStore';
import useClassroomStore from '../store/classroomStore';
import useQuizStore from '../store/quizStore';
import { Classroom } from '../types';

const ClassroomDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuthStore();
  const { classrooms, removeStudent } = useClassroomStore();
  const { quizzes, fetchClassroomQuizzes } = useQuizStore();
  
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [isCreatingQuiz, setIsCreatingQuiz] = useState(false);
  
  useEffect(() => {
    if (id) {
      // Find classroom in store
      const foundClassroom = classrooms.find(c => c.classCode === id) || null;
      setClassroom(foundClassroom);
      
      // Fetch quizzes for this classroom
      fetchClassroomQuizzes(id);
    }
  }, [id, classrooms]);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!classroom) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Classroom not found</h2>
            <p className="mt-2 text-gray-600">The classroom you're looking for doesn't exist or you don't have access to it.</p>
            <Link to="/classrooms" className="mt-4 inline-block">
              <Button>Back to Classrooms</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const isTeacher = user?.userType === "teacher";
  
  const handleRemoveStudent = async (email: string) => {
    if (window.confirm('Are you sure you want to remove this student from the classroom?')) {
      await removeStudent(classroom.classCode, email);
    }
  }; 
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Classroom header */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8 text-white">
              <h1 className="text-2xl font-bold">{classroom.name}</h1>
              <p className="mt-2">{classroom.description}</p>
            </div>
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div className="flex items-center mb-4 sm:mb-0">
                  <Users className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-gray-700">{classroom.students.length} Students</span>
                  <span className="mx-2 text-gray-300">•</span>
                  <BookOpen className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-gray-700">{quizzes.length} Quizzes</span>
                </div>
                
                {isTeacher && (
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => setIsCreatingQuiz(!isCreatingQuiz)}
                      variant={isCreatingQuiz ? 'outline' : 'primary'}
                    >
                      <PlusCircle className="h-5 w-5 mr-2" />
                      {isCreatingQuiz ? 'Cancel' : 'Create Quiz'}
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            {isTeacher && (
              <div className="px-6 py-4 bg-blue-50">
                <div className="flex items-center">
                  <div className="mr-4">
                    <p className="text-sm font-medium text-blue-800">Class Code:</p>
                    <p className="text-lg font-mono bg-white px-3 py-1 rounded border border-blue-200 mt-1">
                      {classroom.classCode}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-700">
                      Share this code with your students so they can join this classroom.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Create quiz form */}
          {isCreatingQuiz && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Create a New Quiz</h2>
              <CreateQuizForm 
                classCode={classroom.classCode}
                onSuccess={() => {
                  setIsCreatingQuiz(false);
                  fetchClassroomQuizzes(classroom.classCode);
                }}
              />
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quizzes section */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-xl font-semibold">Quizzes</h2>
              
              {quizzes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {quizzes.map(quiz => (
                    <QuizCard 
                      // key={quiz.id} 
                      quiz={quiz} 
                      isTeacher={isTeacher}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No quizzes yet</h3>
                  <p className="text-gray-600 mb-4">
                    {isTeacher 
                      ? 'Create your first quiz to get started' 
                      : 'No quizzes have been created for this classroom yet'}
                  </p>
                  {isTeacher && (
                    <Button onClick={() => setIsCreatingQuiz(true)}>
                      <PlusCircle className="h-5 w-5 mr-2" />
                      Create Quiz
                    </Button>
                  )}
                </div>
              )}
            </div>
            
            { isTeacher &&
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Students</h2>
              
              <Card>
                <CardHeader className="bg-gray-50">
                  <CardTitle className="text-lg">Class Members</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {classroom.students.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {isTeacher && classroom.students.map(student => (
                        <li key={student.id} className="p-4 flex justify-between items-center">
                          <div>
                            <p className="font-medium">{student.fullname}</p>
                            <p className="text-sm text-gray-500">{student.email}</p>
                          </div>
                          {isTeacher && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleRemoveStudent(student.email)}
                            >
                              <UserMinus className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </li>
                      ))}
                      {/* {!isTeacher && classroom.students.map(student => (
                        <li key={student.id} className="p-4 flex justify-between items-center">
                          <div>
                            <p className="font-medium">{student.fullname}</p>
                            <p className="text-sm text-gray-500">{student.email}</p>
                          </div>
                        </li>
                      ))} */}
                    </ul>
                  ) : (
                    <div className="p-6 text-center">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No students yet</h3>
                      <p className="text-gray-600">
                        {isTeacher 
                          ? 'Share your class code with students to join' 
                          : 'No students have joined this classroom yet'}
                      </p>
                    </div>
                  )}
                </CardContent>
                {isTeacher && classroom.students.length > 0 && (
                  <CardFooter className="bg-gray-50 px-4 py-3">
                    <p className="text-sm text-gray-600">
                      {classroom.students.length} student{classroom.students.length !== 1 ? 's' : ''} enrolled
                    </p>
                  </CardFooter>
                )}
              </Card>
            </div>
}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ClassroomDetailPage;