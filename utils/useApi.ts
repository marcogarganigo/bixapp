import { useEffect, useState } from 'react';
import { consoleDebug } from '@/utils/develop';
import axios from 'axios';

export const useApi = <T>(
  payload: Record<string, any>
) => {
  console.info('useApi:'+JSON.stringify(payload)); 
  const [response, setResponse] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const startTime = performance.now();
      try {
        consoleDebug('Fetching data with payload:', payload);
        setLoading(true);
        setError(null);

        const res = await axios.post<T>('/postApi', payload, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });

        setResponse(res.data);
      } catch (err: any) {
        setError(err.message || 'Errore durante il recupero dei dati');
      } finally {
        const timeTaken = performance.now() - startTime;
        setElapsedTime(timeTaken);
        setLoading(false);
      }
    };

    console.log('Fetching data with payload:', payload);
    fetchData();
  }, [payload]);

  return { response, loading, error, elapsedTime  };
};
