'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, ProfileInput } from '@/utils/validation';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const genderOptions = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
];

interface ProfileFormProps {
  initialData?: ProfileInput;
  onSubmit: (data: ProfileInput) => Promise<void>;
}

export default function ProfileForm({ initialData, onSubmit }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialData,
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (data: ProfileInput) => {
    setIsLoading(true);
    setError('');

    try {
      await onSubmit(data);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <Input
            label="Full Name"
            type="text"
            error={errors.fullName?.message}
            {...register('fullName')}
          />

          <Input
            label="Phone Number"
            type="tel"
            error={errors.phoneNumber?.message}
            {...register('phoneNumber')}
          />

          <Input
            label="Age"
            type="number"
            error={errors.age?.message}
            {...register('age', { valueAsNumber: true })}
          />

          <Select
            label="Gender"
            options={genderOptions}
            error={errors.gender?.message}
            {...register('gender')}
          />

          <Input
            label="Address"
            type="text"
            error={errors.address?.message}
            {...register('address')}
          />

          <Input
            label="Emergency Contact"
            type="tel"
            error={errors.emergencyContact?.message}
            {...register('emergencyContact')}
          />

          <Textarea
            label="Medical Notes (Optional)"
            rows={3}
            error={errors.medicalNotes?.message}
            {...register('medicalNotes')}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner size="sm" /> : 'Save Changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
