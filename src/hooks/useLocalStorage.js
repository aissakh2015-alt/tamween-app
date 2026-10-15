import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (err) {
      console.warn(`⚠️ خطأ في قراءة localStorage[${key}]:`, err);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn(`⚠️ خطأ في حفظ localStorage[${key}]:`, err);
    }
  }, [key, value]);

  return [value, setValue];
}

export function clearAppStorage() {
  const keys = ['stock', 'requirements', 'orders', 'received', 'counters'];
  keys.forEach(k => window.localStorage.removeItem(k));
}