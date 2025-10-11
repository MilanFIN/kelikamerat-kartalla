import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

type SetValue<T> = Dispatch<SetStateAction<T>>;

export default function useLocalStorage<T>(
  key: string,
  fallbackValue: T
): [T, SetValue<T>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : fallbackValue;
    } catch {
      return fallbackValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error("Failed to save to localStorage:", err);
    }
  }, [key, value]);

  return [value, setValue];
}
