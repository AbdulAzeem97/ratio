import React from 'react';
import { Printer, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  fileName: string;
}

const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode, fileName }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Printer className="h-8 w-8 text-blue-500" />
            <div className="ml-3">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">UPS Optimization Tool</h1>
              {fileName && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Working with: {fileName}
                </p>
              )}
            </div>
          </div>
          
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;