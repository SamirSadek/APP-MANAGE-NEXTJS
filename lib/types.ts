export interface FormData {
    id: string;
    name: string;
    email: string;
    phone: string;
    skills: string[];
    experienceLevel: 'Junior' | 'Mid' | 'Senior';
    expectedSalary: number;
    employmentStatus: 'Employed' | 'Unemployed';
    introduction: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export type FormErrors = Partial<Record<keyof FormData, string>>;