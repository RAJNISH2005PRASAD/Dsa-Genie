import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  XMarkIcon,
  HomeIcon,
  CodeBracketIcon,
  TrophyIcon,
  UserIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../../stores/authStore';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Dashboard', href: '/dashboard', icon: ChartBarIcon },
  { name: 'Problems', href: '/problems', icon: CodeBracketIcon },
  { name: 'Contests', href: '/contests', icon: TrophyIcon },
  { name: 'Leaderboard', href: '/leaderboard', icon: ChartBarIcon },
  { name: 'AI Chat', href: '/chat', icon: ChatBubbleLeftRightIcon },
  { name: 'Coding Platforms', href: '/coding-platforms', icon: ChartBarIcon },
  { name: 'Profile', href: '/profile', icon: UserIcon },
];

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-dark-800 border-r border-dark-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-dark-700">
            <Link to="/" className="flex items-center">
              <SparklesIcon className="h-8 w-8 text-primary-500" />
              <span className="ml-2 text-xl font-bold gradient-text">DSA Genie</span>
            </Link>
            
            <button
              type="button"
              className="text-dark-300 hover:text-white lg:hidden"
              onClick={onClose}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4 py-6">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                    ${isActive 
                      ? 'bg-primary-600 text-white' 
                      : 'text-dark-300 hover:bg-dark-700 hover:text-white'
                    }
                  `}
                  onClick={onClose}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          {user && (
            <div className="border-t border-dark-700 p-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user.username}
                  </p>
                  <p className="text-xs text-dark-400">
                    Level {user.level ?? 0} • {user.stats?.totalSolved ?? 0} solved
                  </p>
                </div>
              </div>
              
              {/* Stats */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-dark-400">Coins</span>
                  <span className="text-warning-400 font-semibold">{user.coins ?? 0}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-dark-400">Streak</span>
                  <span className="text-success-400 font-semibold">{user.streak?.current ?? 0} days</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-dark-400">Experience</span>
                  <span className="text-primary-400 font-semibold">{user.experience ?? 0} XP</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <Link
                  to="/profile"
                  className="flex items-center px-3 py-2 text-sm text-dark-300 hover:text-white hover:bg-dark-700 rounded-lg transition-colors duration-200"
                  onClick={onClose}
                >
                  <Cog6ToothIcon className="mr-3 h-4 w-4" />
                  Settings
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center w-full px-3 py-2 text-sm text-danger-400 hover:text-danger-300 hover:bg-dark-700 rounded-lg transition-colors duration-200"
                >
                  <ArrowRightOnRectangleIcon className="mr-3 h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar; 