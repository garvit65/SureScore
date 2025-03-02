import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import RegisterForm from '../components/auth/RegisterForm';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <div className="flex justify-center">
              <GraduationCap className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Create an account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Join SureScore to create and take quizzes
            </p>
          </div>
          
          <RegisterForm />
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RegisterPage;