import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const Admin: React.FC = () => {
  // AI Generation States
  const [topic, setTopic] = useState('arrays');
  const [difficulty, setDifficulty] = useState('easy');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [numProblems, setNumProblems] = useState(3);
  const [contestType, setContestType] = useState('special');
  const [duration, setDuration] = useState(60);
  const [contestLoading, setContestLoading] = useState(false);
  const [contestMessage, setContestMessage] = useState('');
  const [contestError, setContestError] = useState('');
  const [description, setDescription] = useState('');

  // Manual Problem Creation States
  const [manualProblem, setManualProblem] = useState({
    title: '',
    description: '',
    difficulty: 'easy',
    topics: ['arrays'],
    constraints: [''],
    examples: [{ input: '', output: '', explanation: '' }]
  });
  const [manualLoading, setManualLoading] = useState(false);
  const [manualMessage, setManualMessage] = useState('');
  const [manualError, setManualError] = useState('');

  // Problem Management States
  const [adminProblems, setAdminProblems] = useState([]);
  const [problemsLoading, setProblemsLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProblems: 0,
    hasNext: false,
    hasPrev: false
  });
  const [filters, setFilters] = useState({
    search: '',
    difficulty: '',
    topic: ''
  });

  const topics = [
    'arrays', 'strings', 'linked-lists', 'trees', 'graphs', 
    'dynamic-programming', 'greedy', 'backtracking', 'binary-search', 
    'two-pointers', 'sliding-window', 'stack', 'queue', 'heap', 
    'trie', 'union-find', 'bit-manipulation', 'math', 'geometry'
  ];

  const difficulties = ['easy', 'medium', 'hard'];

  const contestTypes = ['daily', 'weekly', 'monthly', 'special', 'adaptive'];

  // Load admin problems
  const loadAdminProblems = async (page = 1) => {
    setProblemsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...filters
      });
      
      const response = await api.get(`/ai/admin-problems?${params}`);
      setAdminProblems(response.data.problems);
      setPagination(response.data.pagination);
    } catch (err: any) {
      console.error('Failed to load admin problems:', err);
    } finally {
      setProblemsLoading(false);
    }
  };

  // Load problems on component mount
  useEffect(() => {
    loadAdminProblems();
  }, []);

  // Delete problem
  const deleteProblem = async (problemId: string) => {
    if (!window.confirm('Are you sure you want to delete this problem? This action cannot be undone.')) {
      return;
    }

    setDeleteLoading(problemId);
    try {
      await api.delete(`/ai/problem/${problemId}`);
      setMessage('Problem deleted successfully!');
      loadAdminProblems(pagination.currentPage); // Reload current page
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete problem');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Apply filters
  const applyFilters = () => {
    loadAdminProblems(1);
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({ search: '', difficulty: '', topic: '' });
    loadAdminProblems(1);
  };

  const generateProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await api.post('/ai/generate-problem', {
        topic,
        difficulty,
        description
      });

      setMessage(`✅ Problem "${response.data.problem.title}" generated successfully!`);
      setDescription('');
      loadAdminProblems(); // Reload problems list
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate problem');
      if (err.response?.data?.details) {
        setError(prev => prev + ': ' + err.response.data.details);
      }
    } finally {
      setLoading(false);
    }
  };

  const generateContest = async (e: React.FormEvent) => {
    e.preventDefault();
    setContestLoading(true);
    setContestMessage('');
    setContestError('');
    try {
      const response = await api.post('/ai/generate-contest', {
        topic,
        difficulty,
        numProblems,
        type: contestType,
        duration,
        description
      });
      setContestMessage(`✅ Contest "${response.data.contest.title}" generated successfully with ${response.data.contest.problemsCount} problems!`);
      setDescription('');
    } catch (err: any) {
      setContestError(err.response?.data?.error || 'Failed to generate contest');
      if (err.response?.data?.details) {
        setContestError(prev => prev + ': ' + err.response.data.details);
      }
    } finally {
      setContestLoading(false);
    }
  };

  const createManualProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    setManualLoading(true);
    setManualMessage('');
    setManualError('');

    try {
      const response = await api.post('/ai/manual-problem', {
        title: manualProblem.title,
        description: manualProblem.description,
        difficulty: manualProblem.difficulty,
        topics: manualProblem.topics,
        constraints: manualProblem.constraints.filter(c => c.trim()),
        examples: manualProblem.examples.filter(ex => ex.input.trim() && ex.output.trim())
      });

      setManualMessage(`✅ Problem "${response.data.problem.title}" created successfully!`);
      setManualProblem({
        title: '',
        description: '',
        difficulty: 'easy',
        topics: ['arrays'],
        constraints: [''],
        examples: [{ input: '', output: '', explanation: '' }]
      });
      loadAdminProblems(); // Reload problems list
    } catch (err: any) {
      setManualError(err.response?.data?.error || 'Failed to create problem');
      if (err.response?.data?.details) {
        setManualError(prev => prev + ': ' + err.response.data.details);
      }
    } finally {
      setManualLoading(false);
    }
  };

  const addConstraint = () => {
    setManualProblem(prev => ({
      ...prev,
      constraints: [...prev.constraints, '']
    }));
  };

  const removeConstraint = (index: number) => {
    setManualProblem(prev => ({
      ...prev,
      constraints: prev.constraints.filter((_, i) => i !== index)
    }));
  };

  const updateConstraint = (index: number, value: string) => {
    setManualProblem(prev => ({
      ...prev,
      constraints: prev.constraints.map((c, i) => i === index ? value : c)
    }));
  };

  const addExample = () => {
    setManualProblem(prev => ({
      ...prev,
      examples: [...prev.examples, { input: '', output: '', explanation: '' }]
    }));
  };

  const removeExample = (index: number) => {
    setManualProblem(prev => ({
      ...prev,
      examples: prev.examples.filter((_, i) => i !== index)
    }));
  };

  const updateExample = (index: number, field: string, value: string) => {
    setManualProblem(prev => ({
      ...prev,
      examples: prev.examples.map((ex, i) => 
        i === index ? { ...ex, [field]: value } : ex
      )
    }));
  };

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h1 className="text-2xl font-bold text-white mb-4">Admin Panel</h1>
        <p className="text-dark-300 mb-6">Manage DSA problems and contests using AI</p>
      </div>

      {/* Problem Management */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-white mb-4">Manage Problems</h2>
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            placeholder="Search problems..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="input"
          />
          <select
            value={filters.difficulty}
            onChange={(e) => handleFilterChange('difficulty', e.target.value)}
            className="input"
          >
            <option value="">All Difficulties</option>
            {difficulties.map((d) => (
              <option key={d} value={d}>
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </option>
            ))}
          </select>
          <select
            value={filters.topic}
            onChange={(e) => handleFilterChange('topic', e.target.value)}
            className="input"
          >
            <option value="">All Topics</option>
            {topics.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1).replace('-', ' ')}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <button
              onClick={applyFilters}
              className="btn-primary flex-1"
              disabled={problemsLoading}
            >
              Apply
            </button>
            <button
              onClick={clearFilters}
              className="btn-secondary flex-1"
              disabled={problemsLoading}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Problems List */}
        {problemsLoading ? (
          <div className="text-center py-8">
            <div className="spinner h-8 w-8 mx-auto"></div>
            <p className="text-dark-300 mt-2">Loading problems...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {adminProblems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-dark-300">No problems found</p>
              </div>
            ) : (
              adminProblems.map((problem: any) => (
                <div key={problem._id} className="border border-dark-600 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">{problem.title}</h3>
                      <p className="text-dark-300 text-sm mt-1">Slug: {problem.slug}</p>
                      <div className="flex gap-2 mt-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          problem.difficulty === 'easy' ? 'bg-green-600/20 text-green-400' :
                          problem.difficulty === 'medium' ? 'bg-yellow-600/20 text-yellow-400' :
                          'bg-red-600/20 text-red-400'
                        }`}>
                          {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                        </span>
                        {problem.topics.map((topic: string) => (
                          <span key={topic} className="px-2 py-1 rounded text-xs font-medium bg-primary-600/20 text-primary-400">
                            {topic.charAt(0).toUpperCase() + topic.slice(1).replace('-', ' ')}
                          </span>
                        ))}
                      </div>
                      <p className="text-dark-400 text-sm mt-2">
                        Source: {problem.source} • Created: {new Date(problem.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-dark-400 text-sm">
                        Submissions: {problem.stats?.totalSubmissions || 0} • 
                        Acceptance Rate: {problem.stats?.acceptanceRate || 0}%
                      </p>
                    </div>
                    <button
                      onClick={() => deleteProblem(problem._id)}
                      disabled={deleteLoading === problem._id}
                      className="btn-error ml-4"
                    >
                      {deleteLoading === problem._id ? (
                        <div className="spinner h-4 w-4"></div>
                      ) : (
                        'Delete'
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => loadAdminProblems(pagination.currentPage - 1)}
              disabled={!pagination.hasPrev}
              className="btn-secondary"
            >
              Previous
            </button>
            <span className="text-dark-300">
              Page {pagination.currentPage} of {pagination.totalPages} 
              ({pagination.totalProblems} total problems)
            </span>
            <button
              onClick={() => loadAdminProblems(pagination.currentPage + 1)}
              disabled={!pagination.hasNext}
              className="btn-secondary"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Manual Problem Creation */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-white mb-4">Create Problem Manually</h2>
        <form onSubmit={createManualProblem} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Problem Title *
            </label>
            <input
              type="text"
              value={manualProblem.title}
              onChange={(e) => setManualProblem({ ...manualProblem, title: e.target.value })}
              className="input w-full"
              placeholder="Enter problem title"
              required
              disabled={manualLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Description *
            </label>
            <textarea
              value={manualProblem.description}
              onChange={(e) => setManualProblem({ ...manualProblem, description: e.target.value })}
              className="input w-full h-32"
              placeholder="Enter detailed problem description"
              required
              disabled={manualLoading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Difficulty
              </label>
              <select
                value={manualProblem.difficulty}
                onChange={(e) => setManualProblem({ ...manualProblem, difficulty: e.target.value })}
                className="input w-full"
                disabled={manualLoading}
              >
                {difficulties.map((d) => (
                  <option key={d} value={d}>
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Topics *
              </label>
              <select
                multiple
                value={manualProblem.topics}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, option => option.value);
                  setManualProblem({ ...manualProblem, topics: selected });
                }}
                className="input w-full h-24"
                disabled={manualLoading}
              >
                {topics.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
              <p className="text-xs text-dark-400 mt-1">
                Hold Ctrl (or Cmd on Mac) to select multiple topics
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Constraints
            </label>
            {manualProblem.constraints.map((constraint, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={constraint}
                  onChange={(e) => updateConstraint(index, e.target.value)}
                  className="input flex-1"
                  placeholder="Enter constraint"
                  disabled={manualLoading}
                />
                <button
                  type="button"
                  onClick={() => removeConstraint(index)}
                  className="btn-secondary px-3"
                  disabled={manualLoading}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addConstraint}
              className="btn-secondary text-sm"
              disabled={manualLoading}
            >
              + Add Constraint
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Examples
            </label>
            {manualProblem.examples.map((example, index) => (
              <div key={index} className="border border-dark-600 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-white">Example {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeExample(index)}
                    className="btn-secondary text-sm px-2 py-1"
                    disabled={manualLoading}
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={example.input}
                    onChange={(e) => updateExample(index, 'input', e.target.value)}
                    className="input"
                    placeholder="Input"
                    disabled={manualLoading}
                  />
                  <input
                    type="text"
                    value={example.output}
                    onChange={(e) => updateExample(index, 'output', e.target.value)}
                    className="input"
                    placeholder="Output"
                    disabled={manualLoading}
                  />
                </div>
                <textarea
                  value={example.explanation}
                  onChange={(e) => updateExample(index, 'explanation', e.target.value)}
                  className="input mt-2"
                  placeholder="Explanation (optional)"
                  disabled={manualLoading}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addExample}
              className="btn-secondary text-sm"
              disabled={manualLoading}
            >
              + Add Example
            </button>
          </div>

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={manualLoading}
          >
            {manualLoading ? 'Creating Problem...' : 'Create Problem'}
          </button>
        </form>

        {manualMessage && (
          <div className="mt-4 p-4 bg-success-600/20 border border-success-600 rounded-lg">
            <p className="text-success-400">{manualMessage}</p>
          </div>
        )}

        {manualError && (
          <div className="mt-4 p-4 bg-error-600/20 border border-error-600 rounded-lg">
            <p className="text-error-400">{manualError}</p>
          </div>
        )}
      </div>

      {/* AI Problem Generation */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-white mb-4">Generate Problem with AI</h2>
        <form onSubmit={generateProblem} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Topic
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="input w-full"
                disabled={loading}
              >
                {topics.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="input w-full"
                disabled={loading}
              >
                {difficulties.map((d) => (
                  <option key={d} value={d}>
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Additional Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input w-full h-20"
              placeholder="Add any specific requirements or context for the AI"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? 'Generating Problem...' : 'Generate Problem with AI'}
          </button>
        </form>

        {message && (
          <div className="mt-4 p-4 bg-success-600/20 border border-success-600 rounded-lg">
            <p className="text-success-400">{message}</p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-error-600/20 border border-error-600 rounded-lg">
            <p className="text-error-400">{error}</p>
          </div>
        )}
      </div>

      {/* Contest Generation Form */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-white mb-4">Generate Contest with AI</h2>
        <form onSubmit={generateContest} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Topic</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="input w-full"
                disabled={contestLoading}
              >
                {topics.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="input w-full"
                disabled={contestLoading}
              >
                {difficulties.map((d) => (
                  <option key={d} value={d}>
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Number of Problems</label>
              <input
                type="number"
                min={1}
                max={10}
                value={numProblems}
                onChange={(e) => setNumProblems(Number(e.target.value))}
                className="input w-full"
                disabled={contestLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Contest Type</label>
              <select
                value={contestType}
                onChange={(e) => setContestType(e.target.value)}
                className="input w-full"
                disabled={contestLoading}
              >
                {contestTypes.map((ct) => (
                  <option key={ct} value={ct}>
                    {ct.charAt(0).toUpperCase() + ct.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Duration (minutes)</label>
              <input
                type="number"
                min={10}
                max={300}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="input w-full"
                disabled={contestLoading}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Additional Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input w-full h-20"
              placeholder="Add any specific requirements or context for the contest"
              disabled={contestLoading}
            />
          </div>
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={contestLoading}
          >
            {contestLoading ? 'Generating Contest...' : 'Generate Contest with AI'}
          </button>
        </form>

        {contestMessage && (
          <div className="mt-4 p-4 bg-success-600/20 border border-success-600 rounded-lg">
            <p className="text-success-400">{contestMessage}</p>
          </div>
        )}

        {contestError && (
          <div className="mt-4 p-4 bg-error-600/20 border border-error-600 rounded-lg">
            <p className="text-error-400">{contestError}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin; 