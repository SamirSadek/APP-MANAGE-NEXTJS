import { FormData } from './types';

export const validateForm = (data: Partial<FormData>): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.name?.trim()) {
    errors.name = 'Name is required';
  }

  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Invalid email format';
  }

  if (!data.phone?.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!/^\+?[\d\s-]{10,}$/.test(data.phone)) {
    errors.phone = 'Invalid phone number format';
  }

  if (!data.skills || data.skills.length < 3) {
    errors.skills = 'Please select at least 3 skills';
  }

  if (!data.experienceLevel) {
    errors.experienceLevel = 'Experience level is required';
  }

  if (!data.expectedSalary || data.expectedSalary <= 0) {
    errors.expectedSalary = 'Expected salary must be greater than 0';
  }

  if (!data.employmentStatus) {
    errors.employmentStatus = 'Employment status is required';
  }

  if (!data.introduction?.trim()) {
    errors.introduction = 'Introduction is required';
  } else if (data.introduction.length > 500) {
    errors.introduction = 'Introduction must not exceed 500 characters';
  }

  return errors;
};