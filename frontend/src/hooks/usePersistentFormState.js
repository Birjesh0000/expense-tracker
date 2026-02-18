import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to manage form state with localStorage persistence
 * Allows form data to survive page refreshes
 */
function usePersistentFormState(storageKey, initialState) {
  const [formData, setFormData] = useState(() => {
    // Try to load from localStorage on mount
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        console.log(`Recovered form state from localStorage:`, JSON.parse(saved));
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }
    return initialState;
  });

  // Save to localStorage whenever formData changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(formData));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [formData, storageKey]);

  const updateFormData = useCallback((updates) => {
    setFormData(prev => ({
      ...prev,
      ...updates,
    }));
  }, []);

  const clearFormData = useCallback(() => {
    setFormData(initialState);
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }, [initialState, storageKey]);

  return {
    formData,
    updateFormData,
    clearFormData,
    hasSavedData: localStorage.getItem(storageKey) !== null,
  };
}

export default usePersistentFormState;
