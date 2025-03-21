import { useState, useEffect } from "react";

const cache = JSON.parse(localStorage.getItem('fetchCache')) || {};

const saveToLocalStorage = (cache) => {
  localStorage.setItem('fetchCache', JSON.stringify(cache));
};

const useFetch = (fetchFunction, deps = [], cacheDuration = 60 * 60 * 1000) => {
  const cacheKey = fetchFunction.toString() + JSON.stringify(deps);
  const cachedData = cache[cacheKey] || null;
  const isCacheValid = cachedData && (Date.now() - cachedData.timestamp < cacheDuration);

  const [data, setData] = useState(isCacheValid ? cachedData.data : null);
  const [loading, setLoading] = useState(!isCacheValid);
  const [error, setError] = useState(null);

  useEffect(() => {
    let canceled = false;

    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await fetchFunction();
        if (!canceled) {
          setData(result);
          const newCache = {
            ...cache,
            [cacheKey]: { data: result, timestamp: Date.now() },
          };
          Object.assign(cache, newCache);
          saveToLocalStorage(newCache);
        }
      } catch (err) {
        if (!canceled) {
          setError(err);
        }
      } finally {
        if (!canceled) {
          setLoading(false);
        }
      }
    };

    if (!isCacheValid) {
      fetchData();
    }

    return () => {
      canceled = true;
    };
  }, deps);

  return { data, loading, error };
};

export default useFetch;
