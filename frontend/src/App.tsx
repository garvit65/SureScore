import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ClassroomsPage from './pages/ClassroomsPage';
import ClassroomDetailPage from './pages/ClassroomDetailPage';
import QuizPage from './pages/QuizPage';
import QuizResultsPage from './pages/QuizResultsPage';
import ProfilePage from './pages/ProfilePage';
import useAuthStore from './store/authStore';

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        
        <Route path="/classrooms" element={
          <ProtectedRoute>
            <ClassroomsPage />
          </ProtectedRoute>
        } />
        
        <Route path="/classrooms/:id" element={
          <ProtectedRoute>
            <ClassroomDetailPage />
          </ProtectedRoute>
        } />
        
        <Route path="/quizzes/:id" element={
          <ProtectedRoute>
            <QuizPage />
          </ProtectedRoute>
        } />
        
        <Route path="/quizzes/:id/results" element={
          <ProtectedRoute>
            <QuizResultsPage />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;