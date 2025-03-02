import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, Users, BarChart3, Shield } from 'lucide-react';
import Button from '../components/ui/Button';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  Elevate Learning with Confidence-Based Assessments
                </h1>
                <p className="text-xl text-blue-100">
                  SureScore helps teachers create engaging quizzes and gain deeper insights into student understanding through confidence metrics.
                </p>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                  <Link to="/register">
                    <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-700">
                      Login
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hidden md:block">
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
                  alt="Students taking a quiz" 
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Features section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900">Why Choose SureScore?</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                Our platform offers unique features designed to enhance the assessment experience for both teachers and students.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <GraduationCap className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Confidence Metrics</h3>
                <p className="text-gray-600">
                  Students rate their confidence in each answer, providing deeper insights into their understanding and knowledge gaps.
                </p>
              </div>
              
              <div className="bg-indigo-50 p-6 rounded-lg">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Flexible Quiz Creation</h3>
                <p className="text-gray-600">
                  Create MCQs and true/false questions with ease. Set time limits and schedule quizzes for your classes.
                </p>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Detailed Analytics</h3>
                <p className="text-gray-600">
                  Get comprehensive reports on student performance, including confidence correlation and topic mastery.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* How it works section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900">How SureScore Works</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                Our platform streamlines the assessment process from start to finish.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
                  alt="Teacher creating a quiz" 
                  className="rounded-lg shadow-lg"
                />
              </div>
              
              <div className="space-y-8">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                      1
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-medium text-gray-900">Create a Classroom</h3>
                    <p className="mt-2 text-gray-600">
                      Teachers create virtual classrooms and invite students using a unique class code.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                      2
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-medium text-gray-900">Design Quizzes</h3>
                    <p className="mt-2 text-gray-600">
                      Create engaging quizzes with multiple-choice or true/false questions, set time limits, and schedule start times.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                      3
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-medium text-gray-900">Students Take Quizzes</h3>
                    <p className="mt-2 text-gray-600">
                      Students answer questions and rate their confidence level for each answer.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                      4
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-medium text-gray-900">Review Insights</h3>
                    <p className="mt-2 text-gray-600">
                      Both teachers and students receive detailed reports with performance metrics and confidence analysis.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900">What Educators Are Saying</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                Hear from teachers who have transformed their assessment approach with SureScore.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <Users className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">Dr. Sarah Johnson</h4>
                    <p className="text-gray-600">High School Science Teacher</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "The confidence metrics have completely changed how I approach teaching. I can now identify when students are guessing versus when they truly understand the material."
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <Users className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">Prof. Michael Chen</h4>
                    <p className="text-gray-600">University Mathematics Department</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "SureScore has revolutionized my assessment strategy. The detailed analytics help me tailor my lectures to address specific knowledge gaps."
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <Users className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">Ms. Rebecca Torres</h4>
                    <p className="text-gray-600">Middle School English Teacher</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "My students love the interactive nature of SureScore quizzes. The confidence ratings make them more mindful about their answers and learning process."
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA section */}
        <section className="bg-blue-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Assessments?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join thousands of educators who are gaining deeper insights into student learning with SureScore.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Link to="/register">
                <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
                  Sign Up Now
                </Button>
              </Link>
              <Link to="/features">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-700">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;