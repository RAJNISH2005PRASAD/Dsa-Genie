import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

interface Problem {
  _id: string;
  title: string;
  slug: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topics: string[];
  stats: {
    acceptanceRate: number;
    totalSubmissions: number;
  };
}

const Problems: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    difficulty: '',
    topics: [] as string[],
    search: ''
  });

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      try {
        const params: any = {};
        if (filters.difficulty) params.difficulty = filters.difficulty;
        if (filters.search) params.search = filters.search;
        // Add topics filter if needed
        const res = await api.get('/problems', { params });
        setProblems(res.data.problems);
      } catch (err) {
        setProblems([]);
      }
      setLoading(false);
    };
    fetchProblems();
    // eslint-disable-next-line
  }, [filters.difficulty, filters.search]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'badge-easy';
      case 'medium': return 'badge-medium';
      case 'hard': return 'badge-hard';
      default: return 'badge';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner h-8 w-8"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Problems</h1>
        <div className="flex space-x-4">
          <select
            value={filters.difficulty}
            onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
            className="input w-32"
          >
            <option value="">All</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          
          <input
            type="text"
            placeholder="Search problems..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="input w-64"
          />
        </div>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-dark-700">
            <thead className="bg-dark-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">
                  Difficulty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">
                  Topics
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">
                  Acceptance Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-dark-800 divide-y divide-dark-700">
              {problems.map((problem) => (
                <tr key={problem._id} className="hover:bg-dark-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-4 h-4 rounded-full bg-dark-600"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      to={`/problems/${problem.slug}`}
                      className="text-primary-400 hover:text-primary-300 font-medium"
                    >
                      {problem.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getDifficultyColor(problem.difficulty)}>
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-1">
                      {problem.topics.slice(0, 2).map((topic) => (
                        <span
                          key={topic}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-dark-600 text-dark-300"
                        >
                          {topic}
                        </span>
                      ))}
                      {problem.topics.length > 2 && (
                        <span className="text-dark-400 text-xs">+{problem.topics.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-300">
                    {problem.stats.acceptanceRate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Problems; 