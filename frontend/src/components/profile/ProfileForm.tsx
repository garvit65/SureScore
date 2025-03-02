import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../ui/Input';
import Button from '../ui/Button';
import useAuthStore from '../../store/authStore';

interface ProfileFormData {
  fullName: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ProfileForm: React.FC = () => {
  const { user, updateUser, logout } = useAuthStore(); // Added logout for password change
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<ProfileFormData>({
    defaultValues: {
      fullName: user?.fullname || '',
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  });

  const newPassword = watch('newPassword');

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Update profile information
      await updateUser({
        fullname: data.fullName,
        email: data.email
      });

      // If changing password
      if (isChangingPassword && data.currentPassword && data.newPassword) {
        const accessToken = localStorage.getItem('accessToken'); // Get token
        if (!accessToken) throw new Error('Unauthorized');

        const response = await fetch('http://localhost:3000/api/v1/users/change-password',{
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`, // Send token for authentication
          },
          credentials: 'include',
          body: JSON.stringify({
            oldPassword: data.currentPassword,
            newPassword: data.newPassword
          }),
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || 'Failed to change password.');
        }

        // Logout user after password change
        logout();
        setSuccess('Password changed successfully. Please log in again.');
      } else {
        setSuccess('Profile updated successfully');
      }

      // Reset password fields
      reset({
        fullName: data.fullName,
        email: data.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      setIsChangingPassword(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile. Please try again.');
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

      {success && (
        <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm">
          {success}
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

      <div className="pt-4 border-t border-gray-200">
        {!isChangingPassword ? (
          <Button 
            type="button" 
            variant="outline"
            onClick={() => setIsChangingPassword(true)}
          >
            Change Password
          </Button>
        ) : (
          <div className="space-y-4">
            <h3 className="font-medium">Change Password</h3>

            <Input
              label="Current Password"
              type="password"
              fullWidth
              error={errors.currentPassword?.message}
              {...register('currentPassword', { 
                required: 'Current password is required'
              })}
            />

            <Input
              label="New Password"
              type="password"
              fullWidth
              error={errors.newPassword?.message}
              {...register('newPassword', { 
                required: 'New password is required',
                minLength: {
                  value: 6,
                  message: 'New password must be at least 6 characters'
                }
              })}
            />

            <Input
              label="Confirm New Password"
              type="password"
              fullWidth
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', { 
                required: 'Please confirm your new password',
                validate: value => value === newPassword || 'Passwords do not match'
              })}
            />

            <div className="flex space-x-2">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  setIsChangingPassword(false);
                  reset({
                    fullName: user?.fullname || '',
                    email: user?.email || '',
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="pt-4">
        <Button type="submit" fullWidth isLoading={isLoading}>
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
