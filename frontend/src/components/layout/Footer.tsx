import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">SureScore</span>
            </div>
            <p className="mt-4 text-gray-600 max-w-md">
              SureScore is an innovative online quiz platform designed to help teachers create engaging assessments and track student progress with confidence metrics.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Platform</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/" className="text-base text-gray-600 hover:text-blue-600">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-base text-gray-600 hover:text-blue-600">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-base text-gray-600 hover:text-blue-600">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Support</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/help" className="text-base text-gray-600 hover:text-blue-600">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-base text-gray-600 hover:text-blue-600">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-base text-gray-600 hover:text-blue-600">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-base text-gray-600 hover:text-blue-600">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-500 text-center">
            &copy; {new Date().getFullYear()} SureScore. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;