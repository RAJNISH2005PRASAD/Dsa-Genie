import React, { useState, useEffect } from 'react';
import { 
  UserIcon, 
  Cog6ToothIcon, 
  TrophyIcon, 
  FireIcon,
  StarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../stores/authStore';
import api from '../utils/api';

interface UserStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  streak: {
    current: number;
    longest: number;
  };
  level: number;
  experience: number;
  coins: number;
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    unlockedAt: string;
  }>;
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: string;
  }>;
}

const Profile: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await api.get('/auth/me');
        setStats(res.data.user);
        updateUser(res.data.user);
      } catch (err) {
        console.error('Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [updateUser]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner h-8 w-8"></div>
      </div>
    );
  }

  if (!user || !stats) {
    return <div>Loading...</div>;
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: UserIcon },
    { id: 'achievements', name: 'Achievements', icon: TrophyIcon },
    { id: 'activity', name: 'Activity', icon: ChartBarIcon },
    { id: 'settings', name: 'Settings', icon: Cog6ToothIcon },
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="card p-6">
        <div className="flex items-center space-x-6">
          <div className="h-20 w-20 rounded-full bg-primary-600 flex items-center justify-center">
            <span className="text-white font-bold text-2xl">
              {user.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white mb-2">{user.username}</h1>
            <p className="text-dark-300 mb-3">{user.email}</p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <StarIcon className="h-4 w-4 text-warning-400 mr-1" />
                <span className="text-white">Level {stats.level}</span>
              </div>
              <div className="flex items-center">
                <FireIcon className="h-4 w-4 text-success-400 mr-1" />
                <span className="text-white">{stats.streak.current} day streak</span>
              </div>
              <div className="flex items-center">
                <TrophyIcon className="h-4 w-4 text-warning-400 mr-1" />
                <span className="text-white">{stats.coins} coins</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-dark-700">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-400'
                    : 'border-transparent text-dark-300 hover:text-dark-200 hover:border-dark-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Stats Overview */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-dark-300">Total Problems Solved</span>
                  <span className="text-white font-semibold">{stats.totalSolved}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-success-400">Easy</span>
                  <span className="text-white">{stats.easySolved}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-warning-400">Medium</span>
                  <span className="text-white">{stats.mediumSolved}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-error-400">Hard</span>
                  <span className="text-white">{stats.hardSolved}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-dark-300">Longest Streak</span>
                  <span className="text-white">{stats.streak.longest} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-dark-300">Experience</span>
                  <span className="text-white">{stats.experience} XP</span>
                </div>
              </div>
            </div>

            {/* Progress Chart */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-success-400">Easy</span>
                    <span className="text-white">{stats.easySolved}</span>
                  </div>
                  <div className="w-full bg-dark-700 rounded-full h-2">
                    <div 
                      className="bg-success-400 h-2 rounded-full" 
                      style={{ width: `${(stats.easySolved / Math.max(stats.totalSolved, 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-warning-400">Medium</span>
                    <span className="text-white">{stats.mediumSolved}</span>
                  </div>
                  <div className="w-full bg-dark-700 rounded-full h-2">
                    <div 
                      className="bg-warning-400 h-2 rounded-full" 
                      style={{ width: `${(stats.mediumSolved / Math.max(stats.totalSolved, 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-error-400">Hard</span>
                    <span className="text-white">{stats.hardSolved}</span>
                  </div>
                  <div className="w-full bg-dark-700 rounded-full h-2">
                    <div 
                      className="bg-error-400 h-2 rounded-full" 
                      style={{ width: `${(stats.hardSolved / Math.max(stats.totalSolved, 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Achievements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.achievements.map((achievement) => (
                <div key={achievement.id} className="bg-dark-700 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-primary-600/20 rounded-lg flex items-center justify-center">
                      <span className="text-primary-400 text-lg">{achievement.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{achievement.name}</h4>
                      <p className="text-dark-300 text-sm">{achievement.description}</p>
                      <p className="text-dark-400 text-xs mt-1">
                        Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {stats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-dark-700 rounded-lg">
                  <div className="h-8 w-8 bg-primary-600/20 rounded-lg flex items-center justify-center">
                    <span className="text-primary-400 text-sm">📊</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm">{activity.description}</p>
                    <p className="text-dark-400 text-xs">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Account Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={user.username}
                  className="input w-full"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={user.email}
                  className="input w-full"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-2">
                  Member Since
                </label>
                <input
                  type="text"
                  value={new Date().toLocaleDateString()}
                  className="input w-full"
                  disabled
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 