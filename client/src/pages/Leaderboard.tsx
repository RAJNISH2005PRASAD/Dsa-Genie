import React, { useEffect, useState } from 'react';
import api from '../utils/api';

interface LeaderboardUser {
  _id: string;
  username: string;
  level: number;
  coins: number;
  totalSolved: number;
  streak: number;
}

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const res = await api.get('/users/leaderboard');
        setUsers(res.data.users || []);
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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white mb-4">Leaderboard</h1>
      <div className="card p-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-dark-700">
          <thead className="bg-dark-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">Rank</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">Level</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">Coins</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">Solved</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">Streak</th>
            </tr>
          </thead>
          <tbody className="bg-dark-800 divide-y divide-dark-700">
            {users.map((user, idx) => (
              <tr key={user._id} className="hover:bg-dark-700">
                <td className="px-6 py-4 whitespace-nowrap font-bold text-primary-400">{idx + 1}</td>
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