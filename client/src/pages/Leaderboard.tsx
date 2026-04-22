import React, { useEffect, useState } from 'react';
import api from '../utils/api';

interface LeaderboardUser {
  _id: string;
  username: string;
  level: number;
  coins: number;
  totalSolved: number;
  streak: number;
  rank: number;
}

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const res = await api.get('/auth/leaderboard');
        const normalizedUsers: LeaderboardUser[] = (res.data.users || []).map((user: any, index: number) => ({
          _id: user._id,
          username: user.username,
          level: user.level ?? 1,
          coins: user.coins ?? 0,
          totalSolved: user.stats?.totalSolved ?? user.totalSolved ?? 0,
          streak: user.streak?.longest ?? user.streak?.current ?? user.streak ?? 0,
          rank: user.rank ?? index + 1,
        }));
        setUsers(normalizedUsers);
      } catch (err) {
        setUsers([]);
      }
      setLoading(false);
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner h-8 w-8"></div>
      </div>
    );
  }

  return (
    <div className="leaderboard space-y-6">
      <div className="card p-6">
        <h1 className="text-3xl font-bold gradient-text mb-2">Leaderboard</h1>
        <p className="text-dark-300">Top performers ranked by solved problems.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {users.slice(0, 3).map((user, idx) => (
          <div key={user._id} className="card-hover tilt-hover p-4">
            <div className="text-dark-300 text-sm mb-1">#{idx + 1}</div>
            <div className="text-white font-semibold">{user.username}</div>
            <div className="text-xs text-dark-400 mt-1">Level {user.level} • {user.coins} coins</div>
            <div className="text-success-400 text-sm mt-2">{user.totalSolved} solved • {user.streak} streak</div>
          </div>
        ))}
      </div>

      <div className="card p-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-dark-700">
          <thead className="bg-dark-700/70">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">Rank</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">Level</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">Coins</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">Solved</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">Streak</th>
            </tr>
          </thead>
          <tbody className="bg-dark-800/40 divide-y divide-dark-700/70">
            {users.map((user, idx) => (
              <tr key={user._id} className="hover:bg-dark-700/70 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap font-bold text-primary-400">{user.rank || idx + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-white">{user.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-warning-400">{user.level}</td>
                <td className="px-6 py-4 whitespace-nowrap text-warning-400">{user.coins}</td>
                <td className="px-6 py-4 whitespace-nowrap text-success-400">{user.totalSolved}</td>
                <td className="px-6 py-4 whitespace-nowrap text-success-400">{user.streak}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard; 