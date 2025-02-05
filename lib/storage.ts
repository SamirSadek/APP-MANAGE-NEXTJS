import { FormData } from './types';

const STORAGE_KEY = 'form_data';
const AUTOSAVE_KEY = 'form_autosave';

export const saveFormData = (data: FormData): void => {
    const existingData = getFormData();
    const updatedData = existingData.map(item =>
      item.id === data.id
        ? { ...data, updatedAt: new Date().toISOString() }  // Update existing
        : item
    );
  
    // If the entry doesn't exist, add it
    if (!existingData.some(item => item.id === data.id)) {
      updatedData.push({
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
  
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
  };
  

export const getFormData = (): FormData[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const deleteFormData = (id: string): void => {
  const existingData = getFormData();
  const updatedData = existingData.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
};

export const getFormDataById = (id: string): FormData | undefined => {
  const existingData = getFormData();
  return existingData.find(item => item.id === id);
};

export const saveAutosaveData = (data: Partial<FormData>): void => {
  localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(data));
};

export const getAutosaveData = (): Partial<FormData> | null => {
  const data = localStorage.getItem(AUTOSAVE_KEY);
  return data ? JSON.parse(data) : null;
};

export const clearAutosaveData = (): void => {
  localStorage.removeItem(AUTOSAVE_KEY);
};