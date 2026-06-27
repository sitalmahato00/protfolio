import { useState, useEffect, useCallback, useRef } from 'react';

const cache = new Map();

export function useCachedData(key, fetchFn) {
  const fetchRef = useRef(fetchFn);
  fetchRef.current = fetchFn;

  const [data, setData] = useState(() => {
    if (cache.has(key)) return cache.get(key);
    return undefined;
  });

  const [loading, setLoading] = useState(!cache.has(key));

  useEffect(() => {
    if (cache.has(key)) {
      setData(cache.get(key));
      setLoading(false);
      return;
    }

    let mounted = true;
    setLoading(true);

    fetchRef.current().then(result => {
      if (mounted) {
        cache.set(key, result);
        setData(result);
        setLoading(false);
      }
    });

    return () => { mounted = false; };
  }, [key]);

  const refresh = useCallback(() => {
    cache.delete(key);
    setLoading(true);
    return fetchRef.current().then(result => {
      cache.set(key, result);
      setData(result);
      setLoading(false);
      return result;
    });
  }, [key]);

  return { data, loading, refresh };
}
