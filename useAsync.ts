import { useState } from 'react';

interface AsyncState<T> {
  loading: boolean;
  error: any;
  value: T | null;
  execute: (...args: any[]) => Promise<void>;
}

export function useAsync<T>(callback: (...args: any[]) => Promise<T>): AsyncState<T> {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<any>(null);

  const execute = async (...args: any[]): Promise<void> => {
    setLoading(true);
    try {
      const result = await callback(...args);
      setValue(result);
      setError(undefined);
    } catch (err) {
      setError(err);
      setValue(null);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, value, execute };
}