import { useState } from 'react';

interface UseFormProps<T> {
  initialState: T;
  onSubmit: (data: T) => Promise<void>;
}

export const useForm = <T extends Record<string, any>>({ 
  initialState, 
  onSubmit 
}: UseFormProps<T>) => {
  const [formData, setFormData] = useState<T>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    error,
    handleChange,
    handleSubmit,
    setFormData,
    setError
  };
};