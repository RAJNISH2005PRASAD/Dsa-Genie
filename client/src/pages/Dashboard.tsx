import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChartBarIcon, 
  FireIcon, 
  StarIcon, 
  TrophyIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../stores/authStore';
import api from '../utils/api';

interface DashboardStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  streak: {
    current: number;
    longest: number;
    lastSolvedDate: string | null;
  };
  level: number;
  experience: number;
  coins: number;
  recentProblems: Array<{
    title: string;
    slug: string;
    difficulty: string;
    solvedAt: string;
  }>;
}

interface Recommendation {
  _id: string;
  title: string;
  slug: string;
  difficulty: string;
  topics: string[];
  tags?: string[];
  stats?: {
    acceptanceRate?: number;
    totalSubmissions?: number;
  };
  recommendationScore?: number;
  reason?: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  // Recommendation state
  const [recLoading, setRecLoading] = useState(true);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [recError, setRecError] = useState<string | null>(null);

  const fetchRecommendation = async () => {
    setRecLoading(true);
    setRecError(null);
    try {
      const res = await api.get('/ai/recommendations?limit=1');
      if (res.data.recommendations && res.data.recommendations.length > 0) {
        setRecommendation(res.data.recommendations[0]);
      } else {
        setRecommendation(null);
      }
    } catch (err) {
      setRecError('Failed to fetch recommendation. Please try again later.');
    } finally {
      setRecLoading(false);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/auth/me');
        setStats(res.data.user);
      } catch (err) {
        console.error('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
    fetchRecommendation();
  }, []);

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

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="card p-6">
        <h1 className="text-2xl font-bold text-white mb-2">
          Welcome back, {user.username}! 👋
        </h1>
        <p className="text-dark-300">
          Ready to continue your DSA learning journey?
        </p>
      </div>

      {/* Recommended Next Question */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-primary-400">Recommended Next Question</h2>
          <button
            className="btn-outline text-xs px-3 py-1"
            onClick={fetchRecommendation}
            disabled={recLoading}
          >
            {recLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        {recLoading ? (
          <div className="text-dark-300">Loading recommendation...</div>
        ) : recError ? (
          <div className="text-error-400">{recError}</div>
        ) : recommendation ? (
          <div>
            <div className="mb-2">
              <span className="font-bold text-white text-lg">{recommendation.title}</span>
              <span className="ml-2 px-2 py-1 rounded text-xs bg-dark-700 text-primary-400 uppercase">{recommendation.difficulty}</span>
            </div>
            <div className="mb-2 text-dark-300 text-sm">
              Topics: {recommendation.topics && recommendation.topics.length > 0 ? recommendation.topics.join(', ') : 'N/A'}
            </div>
            {recommendation.tags && recommendation.tags.length > 0 && (
              <div className="mb-2 text-dark-400 text-xs">
                Tags: {recommendation.tags.join(', ')}
              </div>
            )}
            {recommendation.stats && (
              <div className="mb-2 text-dark-400 text-xs">
                Acceptance Rate: {recommendation.stats.acceptanceRate ?? 'N/A'}% | Submissions: {recommendation.stats.totalSubmissions ?? 'N/A'}
              </div>
            )}
            <div className="mb-2 text-dark-200 text-xs italic">
              {recommendation.reason}
            </div>
            <Link to={`/problems/${recommendation.slug}`} className="btn-primary inline-block mt-2">
              Solve Now
            </Link>
          </div>
        ) : (
          <div className="text-dark-300">No recommendation available. Try solving more problems!</div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-primary-600/20 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-primary-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-dark-300">Problems Solved</p>
              <p className="text-2xl font-bold text-white">{stats.totalSolved}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-success-600/20 rounded-lg">
              <FireIcon className="h-6 w-6 text-success-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-dark-300">Current Streak</p>
              <p className="text-2xl font-bold text-white">{stats.streak.current} days</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-warning-600/20 rounded-lg">
              <StarIcon className="h-6 w-6 text-warning-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-dark-300">Level</p>
              <p className="text-2xl font-bold text-white">{stats.level}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-warning-600/20 rounded-lg">
              <TrophyIcon className="h-6 w-6 text-warning-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-dark-300">Coins</p>
              <p className="text-2xl font-bold text-white">{stats.coins}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Progress by Difficulty</h3>
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

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Experience Progress</h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-400 mb-2">
              {stats.experience} XP
            </div>
            <p className="text-dark-300 mb-4">
              Next level at {stats.level * 100} XP
            </p>
            <div className="w-full bg-dark-700 rounded-full h-3">
              <div 
                className="bg-primary-400 h-3 rounded-full" 
                style={{ width: `${(stats.experience / (stats.level * 100)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/problems" className="btn-primary text-center">
            Practice Problems
          </Link>
          <Link to="/contests" className="btn-secondary text-center">
            Join Contest
          </Link>
          <Link to="/chat" className="btn-outline text-center">
            Ask AI Assistant
          </Link>
          <Link to="/leaderboard" className="btn-outline text-center">
            View Leaderboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 