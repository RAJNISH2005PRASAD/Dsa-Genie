import React, { useState } from 'react';
import api from '../utils/api';

const CodingPlatforms: React.FC = () => {
  const [leetcodeUsername, setLeetcodeUsername] = useState('');
  const [savedUsername, setSavedUsername] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchStats = async (username: string) => {
    setLoading(true);
    setError('');
    setStats(null);
    try {
      const res = await api.get(`/ai/leetcode/${username}`);
      setStats(res.data);
      setSavedUsername(username);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch LeetCode data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (leetcodeUsername.trim()) {
      fetchStats(leetcodeUsername.trim());
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white mb-4">Coding Platforms</h1>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter your LeetCode username"
          value={leetcodeUsername}
          onChange={(e) => setLeetcodeUsername(e.target.value)}
          className="input flex-1"
          disabled={loading}
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Loading...' : 'Fetch Stats'}
        </button>
      </form>
      {error && <div className="p-4 bg-error-600/20 border border-error-600 rounded-lg text-error-400">{error}</div>}
      {stats && (
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-white mb-2">LeetCode Stats for <span className="text-primary-400">{savedUsername}</span></h2>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <span className="text-dark-300">Total Solved</span>
              <div className="text-lg font-bold text-white">{stats.totalSolved}</div>
            </div>
            <div>
              <span className="text-dark-300">Ranking</span>
              <div className="text-lg font-bold text-white">{stats.ranking}</div>
            </div>
            <div>
              <span className="text-dark-300">Easy</span>
              <div className="text-lg font-bold text-success-400">{stats.easySolved} / {stats.totalEasy}</div>
            </div>
            <div>
              <span className="text-dark-300">Medium</span>
              <div className="text-lg font-bold text-warning-400">{stats.mediumSolved} / {stats.totalMedium}</div>
            </div>
            <div>
              <span className="text-dark-300">Hard</span>
              <div className="text-lg font-bold text-error-400">{stats.hardSolved} / {stats.totalHard}</div>
            </div>
            <div>
              <span className="text-dark-300">Contribution Points</span>
              <div className="text-lg font-bold text-white">{stats.contributionPoints}</div>
            </div>
            <div>
              <span className="text-dark-300">Reputation</span>
              <div className="text-lg font-bold text-white">{stats.reputation}</div>
            </div>
            <div>
              <span className="text-dark-300">Streak</span>
              <div className="text-lg font-bold text-primary-400">{stats.streak}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodingPlatforms; 