import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Bars3Icon, 
  BellIcon, 
  UserCircleIcon,
  SparklesIcon 
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../../stores/authStore';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuthStore();

  return (
    <nav className="bg-dark-800 border-b border-dark-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-dark-300 hover:text-white hover:bg-dark-700"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          
          <div className="ml-4 lg:ml-0">
            <h1 className="text-xl font-bold gradient-text">DSA Genie</h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {user && (
            <>
              <button className="p-2 text-dark-300 hover:text-white hover:bg-dark-700 rounded-md">
                <BellIcon className="h-6 w-6" />
              </button>
              
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="flex items-center space-x-2 px-3 py-2 text-dark-300 hover:text-white hover:bg-dark-700 rounded-md"
                >
                  <SparklesIcon className="h-5 w-5" />
                  <span className="hidden sm:block">Admin</span>
                </Link>
              )}
              
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-medium text-white">{user.username}</div>
                  <div className="text-xs text-dark-400">Level {user.level}</div>
                </div>
                
                <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 