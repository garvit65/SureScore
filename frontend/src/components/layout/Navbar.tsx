import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Menu, X } from 'lucide-react';
import Button from '../ui/Button';
import useAuthStore from '../../store/authStore';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-3xl font-bold text-gray-900">SureScore</span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <Link to="/" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600">
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600">
                  Dashboard
                </Link>
                <Link to="/classrooms" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600">
                  Classrooms
                </Link>
                <Link to="/profile" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600">
                  Profile
                </Link>
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Register</Button>
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/classrooms"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Classrooms
                </Link>
                <Link
                  to="/profile"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;