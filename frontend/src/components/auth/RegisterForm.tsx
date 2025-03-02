import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import useAuthStore from '../../store/authStore';
import { UserType } from '../../types';

interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType: UserType;
}

const RegisterForm: React.FC = () => {
  const { register: registerUser } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>();
  const password = watch('password');
  
  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await registerUser(data.fullName, data.email, data.password, data.userType);
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register. Please try again.');
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
        label="Full Name"
        fullWidth
        error={errors.fullName?.message}
        {...register('fullName', { 
          required: 'Full name is required',
          minLength: {
            value: 2,
            message: 'Full name must be at least 2 characters'
          }
        })}
      />
      
      <Input
        label="Email"
        type="email"
        fullWidth
        error={errors.email?.message}
        {...register('email', { 
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address'
          }
        })}
      />
      
      <Input
        label="Password"
        type="password"
        fullWidth
        error={errors.password?.message}
        {...register('password', { 
          required: 'Password is required',
          minLength: {
            value: 6,
            message: 'Password must be at least 6 characters'
          }
        })}
      />
      
      <Input
        label="Confirm Password"
        type="password"
        fullWidth
        error={errors.confirmPassword?.message}
        {...register('confirmPassword', { 
          required: 'Please confirm your password',
          validate: value => value === password || 'Passwords do not match'
        })}
      />
      
      <Select
        label="User Type"
        fullWidth
        error={errors.userType?.message}
        options={[
          { value: 'teacher', label: 'Teacher' },
          { value: 'student', label: 'Student' }
        ]}
        {...register('userType', { 
          required: 'Please select a user type'
        })}
      />
      
      <Button type="submit" fullWidth isLoading={isLoading}>
        Register
      </Button>
    </form>
  );
};

export default RegisterForm;