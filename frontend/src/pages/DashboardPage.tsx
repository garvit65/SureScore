import React, { useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { PlusCircle, BookOpen, Users, Clock } from 'lucide-react';
import Button from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import useAuthStore from '../store/authStore';
import useClassroomStore from '../store/classroomStore';
import useQuizStore from '../store/quizStore';

const DashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { classrooms, fetchUserClassrooms } = useClassroomStore();
  const { quizzes, fetchTeacherQuizzes, fetchStudentQuizzes } = useQuizStore();
  
  useEffect(() => {
    if (user) {
      fetchUserClassrooms(user.id);
      
      if (user.userType === 'teacher') {
        fetchTeacherQuizzes(user.id);
      } else {
        fetchStudentQuizzes(user.id);
      }
    }
  }, [user]);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  const isTeacher = user?.userType === 'teacher';
  
  const upcomingQuizzes = Array.isArray(quizzes) 
  ? quizzes.filter(quiz => {
      const startTime = new Date(quiz.startTime);
      return startTime > new Date();
    }) 
  : [];

  
  
  const activeQuizzes = Array.isArray(quizzes)
  ? quizzes.filter(quiz => {
      const startTime = new Date(quiz.startTime);
      const endTime = new Date(quiz.endTime);
      const now = new Date();
      return startTime <= now && endTime >= now;
    })
  : [];

  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome, {user?.fullname}
            </h1>
            <p className="text-gray-600">
              {isTeacher ? 'Manage your classrooms and quizzes' : 'View your classrooms and take quizzes'}
            </p>
          </div>
          
          {/* Quick stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-blue-100 mr-4">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Classrooms</p>
                    <p className="text-2xl font-bold text-gray-900">{classrooms.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-indigo-100 mr-4">
                    <BookOpen className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Quizzes</p>
                    <p className="text-2xl font-bold text-gray-900">{quizzes.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-green-100 mr-4">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Active Quizzes</p>
                    <p className="text-2xl font-bold text-gray-900">{activeQuizzes.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Quick actions */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {isTeacher ? (
                <>
                  <Link to="/classrooms">
                    <Button fullWidth variant="outline" className="justify-start">
                      <PlusCircle className="h-5 w-5 mr-2" />
                      Create Classroom
                    </Button>
                  </Link>
                  <Link to="/quizzes/create">
                    <Button fullWidth variant="outline" className="justify-start">
                      <PlusCircle className="h-5 w-5 mr-2" />
                      Create Quiz
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/classrooms/join">
                    <Button fullWidth variant="outline" className="justify-start">
                      <Users className="h-5 w-5 mr-2" />
                      Join Classroom
                    </Button>
                  </Link>
                </>
              )}
              <Link to="/classrooms">
                <Button fullWidth variant="outline" className="justify-start">
                  <BookOpen className="h-5 w-5 mr-2" />
                  View Classrooms
                </Button>
              </Link>
              <Link to="/profile">
                <Button fullWidth variant="outline" className="justify-start">
                  <Users className="h-5 w-5 mr-2" />
                  Update Profile
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Active quizzes */}
          {activeQuizzes.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Active Quizzes</h2>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <ul className="divide-y divide-gray-200">
                  {activeQuizzes.map(quiz => (
                    <li key={quiz.id}>
                      <Link 
                        to={isTeacher ? `/quizzes/${quiz.id}/results` : `/quizzes/${quiz.id}`}
                        className="block hover:bg-gray-50"
                      >
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-blue-600 truncate">
                              {quiz.title}
                            </p>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Active
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                {quiz.duration} minutes
                              </p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <p>
                                Ends at {new Date(quiz.endTime).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {/* Upcoming quizzes */}
          {upcomingQuizzes.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Upcoming Quizzes</h2>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <ul className="divide-y divide-gray-200">
                  {upcomingQuizzes.map(quiz => (
                    <li key={quiz.id}>
                      <Link 
                        to={`/quizzes/${quiz.id}`}
                        className="block hover:bg-gray-50"
                      >
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-blue-600 truncate">
                              {quiz.title}
                            </p>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                Upcoming
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                {quiz.duration} minutes
                              </p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <p>
                                Starts at {new Date(quiz.startTime).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {/* Recent classrooms */}
          {classrooms.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Your Classrooms</h2>
                <Link to="/classrooms">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classrooms.slice(0, 3).map(classroom => (
                  <Card key={classroom.classCode}>
                    <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                      <CardTitle>{classroom.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <p className="text-gray-600 mb-4">{classroom.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-gray-500">
                          <Users className="h-4 w-4 mr-1" />
                          <span className="text-sm">{classroom.students.length} Students</span>
                        </div>
                        <Link to={`/classrooms/${classroom.classCode}`}>
                          <Button size="sm">View</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DashboardPage;