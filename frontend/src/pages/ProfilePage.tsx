import React from 'react';
import { Navigate } from 'react-router-dom';
import { User } from 'lucide-react';
import ProfileForm from '../components/profile/ProfileForm';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import useAuthStore from '../store/authStore';

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8 text-white">
              <div className="flex items-center">
                <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center">
                  <User className="h-10 w-10 text-blue-600" />
                </div>
                <div className="ml-6">
                  <h1 className="text-2xl font-bold">{user?.fullname}</h1>
                  <p className="mt-1">{user?.email}</p>
                  <p className="mt-1 bg-blue-500 bg-opacity-50 px-2 py-1 rounded text-sm inline-block">
                    {user?.userType === 'teacher' ? 'Teacher' : 'Student'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
              <ProfileForm />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;