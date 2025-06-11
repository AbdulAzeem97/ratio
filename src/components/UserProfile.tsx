import React from 'react';
import { LogOut } from 'lucide-react';

interface UserProfileProps {
  user: { username: string; role: string; lastLogin: string };
  onLogout: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout }) => {
  return (
    <div className="flex items-center space-x-3">
      <div className="text-right mr-2">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {user.username}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
          {user.role} | Last login: {new Date(user.lastLogin).toLocaleString()}
        </p>
      </div>
      <button
        onClick={onLogout}
        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        aria-label="Logout"
      >
        <LogOut className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      </button>
    </div>
  );
};

export default UserProfile;
