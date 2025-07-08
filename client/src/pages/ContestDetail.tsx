import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';

interface Contest {
  _id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  duration: number;
  problems: Array<{
    _id: string;
    title: string;
    slug: string;
    difficulty: string;
  }>;
  leaderboard: Array<{
    user: string;
    score: number;
    rank: number;
  }>;
  status: string;
}

const ContestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [contest, setContest] = useState<Contest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContest = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/contests/${id}`);
        setContest(res.data.contest);
      } catch (err) {
        setContest(null);
      }
      setLoading(false);
    };
    if (id) fetchContest();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner h-8 w-8"></div>
      </div>
    );
  }

  if (!contest) {
    return <div className="text-center text-error-400">Contest not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h1 className="text-2xl font-bold text-white mb-2">{contest.title}</h1>
        <p className="text-dark-300 mb-4">{contest.description}</p>
        <div className="flex space-x-6 text-sm text-dark-300 mb-4">
          <span>Start: {new Date(contest.startTime).toLocaleString()}</span>
          <span>End: {new Date(contest.endTime).toLocaleString()}</span>
          <span>Duration: {contest.duration} min</span>
          <span>Status: {contest.status}</span>
        </div>
        <h2 className="text-lg font-semibold text-white mb-2">Problems</h2>
        <ul className="space-y-2 mb-4">
          {contest.problems.map((problem) => (
            <li key={problem._id}>
              <Link to={`/problems/${problem.slug}`} className="text-primary-400 hover:underline">
                {problem.title} <span className="ml-2 text-xs text-dark-300">[{problem.difficulty}]</span>
              </Link>
            </li>
          ))}
        </ul>
        <h2 className="text-lg font-semibold text-white mb-2">Leaderboard</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-dark-700">
            <thead className="bg-dark-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">Score</th>
              </tr>
            </thead>
            <tbody className="bg-dark-800 divide-y divide-dark-700">
              {contest.leaderboard.map((entry) => (
                <tr key={entry.rank}>
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-primary-400">{entry.rank}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">{entry.user}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-success-400">{entry.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContestDetail; 