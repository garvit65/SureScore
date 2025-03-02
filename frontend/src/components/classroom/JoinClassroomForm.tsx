import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../ui/Input';
import Button from '../ui/Button';
import useClassroomStore from '../../store/classroomStore';
import useAuthStore from '../../store/authStore';

interface JoinClassroomFormData {
  classCode: string;
}

interface JoinClassroomFormProps {
  onSuccess?: () => void;
}

const JoinClassroomForm: React.FC<JoinClassroomFormProps> = ({ onSuccess }) => {
  const { joinClassroom } = useClassroomStore();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<JoinClassroomFormData>();
  
  const onSubmit = async (data: JoinClassroomFormData) => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await joinClassroom(data.classCode, user);
      reset();
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join classroom. Please check the class code and try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <Input
        label="Class Code"
        fullWidth
        placeholder="Enter the class code"
        error={errors.classCode?.message}
        {...register('classCode', { 
          required: 'Class code is required',
          pattern: {
            value: /^[A-Z0-9]+$/, 
            message: 'Invalid class code format. Only letters and numbers are allowed'
          }          
        })}
      />
      
      <Button type="submit" fullWidth isLoading={isLoading}>
        Join Classroom
      </Button>
    </form>
  );
};

export default JoinClassroomForm;