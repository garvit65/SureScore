import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, HelpCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Button';
import { Quiz } from '../../types';

interface QuizCardProps {
  quiz: Quiz;
  isTeacher: boolean;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz, isTeacher }) => {
  const startDate = new Date(quiz.startTime);
  const endDate = new Date(quiz.endTime);
  const now = new Date();
  
  const isUpcoming = startDate > now;
  const isActive = startDate <= now && endDate >= now;
  const isCompleted = endDate < now;
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getStatusBadge = () => {
    if (isUpcoming) {
      return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Upcoming</span>;
    }
    if (isActive) {
      return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Active</span>;
    }
    return <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Completed</span>;
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <div className="flex justify-between items-start">
          <CardTitle>{quiz.title}</CardTitle>
          {getStatusBadge()}
        </div>
        <CardDescription className="text-indigo-100">{quiz.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-5 w-5 mr-2" />
            <div>
              <div>Start: {formatDate(startDate)}</div>
              <div>End: {formatDate(endDate)}</div>
            </div>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Clock className="h-5 w-5 mr-2" />
            <span>{quiz.duration} minutes</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <HelpCircle className="h-5 w-5 mr-2" />
            <span>{quiz.questions?.length || 0} Questions</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 border-t border-gray-100 p-4">
        {isTeacher ? (
          <Link to={`/quizzes/${quiz.id}/results`} className="w-full">
            <Button variant="primary" fullWidth>
              View Results
            </Button>
          </Link>
        ) : (
          <Link to={`/quizzes/${quiz.id}`} className="w-full">
            <Button 
              variant="primary" 
              fullWidth
              disabled={!isActive && !isCompleted}
            >
              {isActive ? 'Take Quiz' : isCompleted ? 'View Results' : 'Not Available Yet'}
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
};

export default QuizCard;