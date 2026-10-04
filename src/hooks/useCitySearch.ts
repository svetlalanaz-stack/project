import { useEffect, useState } from "react";
import { searchCities, type City } from "@/api/cities";

export function useCitySearch(query: string, delay = 400) {
  const trimmed = query.trim();
  const tooShort = trimmed.length < 2;

  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (tooShort) return;

    const timer = setTimeout(() => {
      setLoading(true);
      setError(null);

      searchCities(trimmed)
        .then((result) => {
          setCities(result);
          setLoading(false);
        })
        .catch((err) => {
          setCities([]);
          setError(err instanceof Error ? err.message : "Ошибка");
          setLoading(false);
        });
    }, delay);

    return () => clearTimeout(timer);
  }, [trimmed, tooShort, delay]);

  return {
    cities: tooShort ? [] : cities,
    loading: tooShort ? false : loading,
    error: tooShort ? null : error,
  };
}
