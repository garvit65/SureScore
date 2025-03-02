import React from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Button';
import { Classroom } from '../../types';
import useAuthStore from '../../store/authStore';




interface ClassroomCardProps {
  classroom: Classroom;
  isTeacher: boolean;
  onDelete?: (id: string) => void;
  onLeave?: (id: string) => void;
};


const ClassroomCard: React.FC<ClassroomCardProps> = ({ 
  classroom, 
  onDelete,
  onLeave

}) => {
  const { user } = useAuthStore();
  const isTeacher = user?.userType === 'teacher';
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardTitle>{classroom.name}</CardTitle>
        <CardDescription className="text-blue-100">{classroom.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {isTeacher && classroom.classCode && (
            <div className="bg-blue-50 p-3 rounded-md flex items-center">
              <span className="text-sm font-medium text-blue-800">Class Code: </span>
              <span className="ml-2 font-mono text-sm bg-white px-2 py-1 rounded border border-blue-200">
                {classroom.classCode}
              </span>
            </div>
          )}
          
          <div className="flex items-center text-gray-600">
            <Users className="h-5 w-5 mr-2" />
            <span>{classroom.students?.length ?? 0} Students</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <BookOpen className="h-5 w-5 mr-2" />
            <span>{classroom.quizzes?.length ?? 0} Quizzes</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 border-t border-gray-100 p-4 flex justify-between">
        <Link to={`/classrooms/${classroom.classCode}`}>
          <Button variant="primary">
            View Classroom
          </Button>
        </Link>
        
        {isTeacher ? (
          <Button 
            variant="danger" 
            onClick={() => onDelete && onDelete(classroom.classCode)}
          >
            Delete
          </Button>
        ) : (
          <Button 
            variant="outline" 
            onClick={() => onLeave && onLeave(classroom.classCode)}
          >
            Leave
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ClassroomCard;
