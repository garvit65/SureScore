import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import useClassroomStore from '../../store/classroomStore';
import useAuthStore from '../../store/authStore';

interface CreateClassroomFormData {
  name: string;
  description: string;
}

interface CreateClassroomFormProps {
  onSuccess?: () => void;
}

const CreateClassroomForm: React.FC<CreateClassroomFormProps> = ({ onSuccess }) => {
  const { createClassroom } = useClassroomStore();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateClassroomFormData>();
  
  const onSubmit = async (data: CreateClassroomFormData) => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await createClassroom(data.name, data.description, user.id);
      reset();
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create classroom. Please try again.');
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
        label="Classroom Name"
        fullWidth
        error={errors.name?.message}
        {...register('name', { 
          required: 'Classroom name is required',
          minLength: {
            value: 3,
            message: 'Classroom name must be at least 3 characters'
          }
        })}
      />
      
      <Textarea
        label="Description"
        fullWidth
        error={errors.description?.message}
        {...register('description', { 
          required: 'Description is required',
          minLength: {
            value: 10,
            message: 'Description must be at least 10 characters'
          }
        })}
      />
      
      <Button type="submit" fullWidth isLoading={isLoading}>
        Create Classroom
      </Button>
    </form>
  );
};

export default CreateClassroomForm;