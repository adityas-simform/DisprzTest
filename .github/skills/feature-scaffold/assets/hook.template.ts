import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

import type { {{FeatureName}}Item } from './types';
import { API_ENDPOINT } from './constants';

interface Use{{FeatureName}}Return {
  data: {{FeatureName}}Item[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

const use{{FeatureName}} = (): Use{{FeatureName}}Return => {
  const [data, setData] = useState<{{FeatureName}}Item[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Prevent state updates on unmounted component
  const isMountedRef = useRef<boolean>(true);

  const fetchData = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(API_ENDPOINT);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const json = (await response.json()) as {{FeatureName}}Item[];

      if (isMountedRef.current) {
        setData(json);
      }
    } catch (err: unknown) {
      if (isMountedRef.current) {
        const message =
          err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(message);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    void fetchData();

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchData]);

  // Example of a derived / memoised value — replace with real logic
  const sortedData = useMemo<{{FeatureName}}Item[]>(
    () => [...data].sort((a, b) => a.id - b.id),
    [data],
  );

  return {
    data: sortedData,
    isLoading,
    error,
    refresh: fetchData,
  };
};

export default use{{FeatureName}};
