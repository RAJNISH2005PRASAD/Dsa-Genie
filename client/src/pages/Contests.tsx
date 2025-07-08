import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ClockIcon, TrophyIcon, UsersIcon, CalendarIcon } from '@heroicons/react/24/outline';
import api from '../utils/api';

interface Contest {
  _id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  duration: number;
  maxParticipants: number;
  currentParticipants: number;
  problems: string[];
  status: 'upcoming' | 'ongoing' | 'completed';
  prizes: {
    first: number;
    second: number;
    third: number;
  };
}

const Contests: React.FC = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchContests = async () => {
      setLoading(true);
      try {
        const res = await api.get('/contests');
        setContests(res.data.contests || []);
      } catch (err) {
        console.error('Failed to fetch contests');
        setContests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'text-info-400 bg-info-900/20';
      case 'ongoing': return 'text-success-400 bg-success-900/20';
      case 'completed': return 'text-dark-300 bg-dark-600';
      default: return 'text-dark-300 bg-dark-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming': return 'Upcoming';
      case 'ongoing': return 'Live';
      case 'completed': return 'Completed';
      default: return 'Unknown';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const filteredContests = contests.filter(contest => {
    if (filter === 'all') return true;
    return contest.status === filter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner h-8 w-8"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Contests</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input w-40"
        >
          <option value="all">All Contests</option>
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Live</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Contests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredContests.map((contest) => (
          <div key={contest._id} className="card-hover p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">
                  <Link 
                    to={`/contests/${contest._id}`}
                    className="hover:text-primary-400 transition-colors"
                  >
                    {contest.title}
                  </Link>
                </h3>
                <p className="text-dark-300 line-clamp-2 mb-3">
                  {contest.description}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(contest.status)}`}>
                {getStatusText(contest.status)}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-dark-300">
                <CalendarIcon className="h-4 w-4 mr-2" />
                <span>{formatDate(contest.startTime)}</span>
              </div>
              
              <div className="flex items-center text-sm text-dark-300">
                <ClockIcon className="h-4 w-4 mr-2" />
                <span>Duration: {formatDuration(contest.duration)}</span>
              </div>
              
              <div className="flex items-center text-sm text-dark-300">
                <UsersIcon className="h-4 w-4 mr-2" />
                <span>{contest.currentParticipants}/{contest.maxParticipants} participants</span>
              </div>
              
              <div className="flex items-center text-sm text-dark-300">
                <TrophyIcon className="h-4 w-4 mr-2" />
                <span>{contest.problems.length} problems</span>
              </div>
            </div>

            {/* Prizes */}
            {contest.prizes && (
              <div className="mb-4 p-3 bg-dark-700 rounded-lg">
                <h4 className="text-sm font-medium text-white mb-2">Prizes</h4>
                <div className="flex space-x-4 text-sm">
                  <div className="flex items-center">
                    <span className="text-warning-400 mr-1">🥇</span>
                    <span className="text-white">{contest.prizes.first} coins</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-dark-300 mr-1">🥈</span>
                    <span className="text-white">{contest.prizes.second} coins</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-warning-600 mr-1">🥉</span>
                    <span className="text-white">{contest.prizes.third} coins</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center">
              <div className="text-sm text-dark-300">
                {contest.status === 'upcoming' && (
                  <span>Starts in {Math.ceil((new Date(contest.startTime).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days</span>
                )}
                {contest.status === 'ongoing' && (
                  <span>Ends in {Math.ceil((new Date(contest.endTime).getTime() - Date.now()) / (1000 * 60 * 60))} hours</span>
                )}
                {contest.status === 'completed' && (
                  <span>Ended {formatDate(contest.endTime)}</span>
                )}
              </div>
              
              <Link 
                to={`/contests/${contest._id}`}
                className="btn-primary"
              >
                {contest.status === 'upcoming' ? 'Register' : 
                 contest.status === 'ongoing' ? 'Join Now' : 'View Results'}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredContests.length === 0 && (
        <div className="text-center py-12">
          <TrophyIcon className="h-12 w-12 text-dark-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-dark-300 mb-2">No contests found</h3>
          <p className="text-dark-400">Check back later for new contests!</p>
        </div>
      )}
    </div>
  );
};

export default Contests; 