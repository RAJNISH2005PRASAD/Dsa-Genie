import React from 'react';
import { Link } from 'react-router-dom';
import { SparklesIcon, CodeBracketIcon, TrophyIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const Home: React.FC = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center py-16">
        <div className="flex justify-center mb-6">
          <SparklesIcon className="h-16 w-16 text-primary-500" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Master DSA with
          <span className="gradient-text"> AI-Powered</span> Learning
        </h1>
        <p className="text-xl text-dark-300 mb-8 max-w-3xl mx-auto">
          Practice Data Structures and Algorithms with personalized recommendations, 
          real-time AI assistance, and gamified learning experience.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/problems" className="btn-primary text-lg px-8 py-3">
            Start Practicing
          </Link>
          <Link to="/register" className="btn-outline text-lg px-8 py-3">
            Join Now
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6 text-center">
          <CodeBracketIcon className="h-12 w-12 text-primary-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Smart Problems</h3>
          <p className="text-dark-300">
            AI-curated problem sets tailored to your skill level and learning goals.
          </p>
        </div>

        <div className="card p-6 text-center">
          <SparklesIcon className="h-12 w-12 text-primary-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">AI Assistant</h3>
          <p className="text-dark-300">
            Get instant hints, explanations, and personalized learning guidance.
          </p>
        </div>

        <div className="card p-6 text-center">
          <TrophyIcon className="h-12 w-12 text-primary-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Contests</h3>
          <p className="text-dark-300">
            Compete in timed contests and climb the leaderboards.
          </p>
        </div>

        <div className="card p-6 text-center">
          <ChartBarIcon className="h-12 w-12 text-primary-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Progress Tracking</h3>
          <p className="text-dark-300">
            Visualize your learning journey with detailed analytics and insights.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="card p-8">
        <h2 className="text-2xl font-bold text-white text-center mb-8">
          Join Thousands of Learners
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-primary-400 mb-2">10K+</div>
            <div className="text-dark-300">Active Users</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-success-400 mb-2">500+</div>
            <div className="text-dark-300">Problems Solved</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-warning-400 mb-2">95%</div>
            <div className="text-dark-300">Success Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 