import { useState, useEffect } from 'react';

export const useDarkMode = () => {
  // Check if user has a preference stored
  const savedPreference = localStorage.getItem('darkMode');
  
  // If no preference, use system preference
  const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Initialize state based on saved preference or system preference
  const [darkMode, setDarkMode] = useState<boolean>(
    savedPreference !== null ? savedPreference === 'true' : systemPreference
  );
  
  useEffect(() => {
    // Save preference to localStorage whenever it changes
    localStorage.setItem('darkMode', darkMode.toString());
    
    // Apply appropriate class to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  // Toggle function
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  return { darkMode, toggleDarkMode };
};