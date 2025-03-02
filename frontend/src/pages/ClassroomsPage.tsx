import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { PlusCircle, Search } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import ClassroomCard from '../components/classroom/ClassroomCard';
import CreateClassroomForm from '../components/classroom/CreateClassroomForm';
import JoinClassroomForm from '../components/classroom/JoinClassroomForm';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import useAuthStore from '../store/authStore';
import useClassroomStore from '../store/classroomStore';

const ClassroomsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { classrooms, fetchUserClassrooms, deleteClassroom, leaveClassroom } = useClassroomStore();
  
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetchUserClassrooms(user.id);
    }
  }, [user?.id, fetchUserClassrooms]); // Added user.id in the dependency array

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const isTeacher = user?.userType === 'teacher';

  const filteredClassrooms = (classrooms ?? []).filter(classroom => 
    classroom?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classroom?.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClassroom = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this classroom? This action cannot be undone.')) {
      await deleteClassroom(id);
    }
  };

  const handleLeaveClassroom = async (id: string) => {
    if (user && window.confirm('Are you sure you want to leave this classroom?')) {
      await leaveClassroom(id, user.id);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Classrooms</h1>
              <p className="text-gray-600">
                {isTeacher 
                  ? 'Manage your classrooms and create new ones' 
                  : 'View your classrooms and join new ones'}
              </p>
            </div>

            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Button 
                onClick={() => {
                  setIsCreating((prev) => !prev);
                  setIsJoining(true);
                }}
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                {isTeacher ? 'Create Classroom' : 'Join Classroom'}
              </Button>
            </div>
          </div>

          {/* Create or Join Form */}
          {isCreating && isTeacher && (
            <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Create a New Classroom</h2>
              <CreateClassroomForm 
                onSuccess={() => {
                  setIsCreating(false);
                  if (user) fetchUserClassrooms(user.id);
                }}
              />
            </div>
          )}

          {isJoining && !isTeacher && (
            <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Join a Classroom</h2>
              <JoinClassroomForm 
                onSuccess={() => {
                  setIsJoining(false);
                  if (user) fetchUserClassrooms(user.id);
                }}
              />
            </div>
          )}

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search classrooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                fullWidth
              />
            </div>
          </div>

          {/* Classrooms grid */}
          {filteredClassrooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClassrooms.map((classroom) => (
                <ClassroomCard
                  key={classroom.id || classroom.classCode}  // Ensured a unique key
                  classroom={{
                    ...classroom,
                    students: classroom.students ?? [], // Ensured students is always an array
                  }}
                  isTeacher={isTeacher && classroom.teacher === user?.id}
                  onDelete={handleDeleteClassroom}
                  onLeave={handleLeaveClassroom}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No classrooms found</h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? 'No classrooms match your search criteria' 
                  : isTeacher 
                    ? 'Create your first classroom to get started' 
                    : 'Join a classroom to get started'}
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ClassroomsPage;
