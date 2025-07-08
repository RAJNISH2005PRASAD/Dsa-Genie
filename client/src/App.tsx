import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Problems from './pages/Problems';
import ProblemDetail from './pages/ProblemDetail';
import Contests from './pages/Contests';
import ContestDetail from './pages/ContestDetail';
import Profile from './pages/Profile';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import Chat from './pages/Chat';
import Admin from './pages/Admin';
import CodingPlatforms from './pages/CodingPlatforms';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen bg-dark-900">
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="problems" element={<Problems />} />
          <Route path="problems/:slug" element={<ProblemDetail />} />
          <Route path="contests" element={<Contests />} />
          <Route path="contests/:id" element={<ContestDetail />} />
          <Route path="profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="chat" element={isAuthenticated ? <Chat /> : <Navigate to="/login" />} />
          <Route path="admin" element={isAuthenticated ? <Admin /> : <Navigate to="/login" />} />
          <Route path="coding-platforms" element={isAuthenticated ? <CodingPlatforms /> : <Navigate to="/login" />} />
        </Route>
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App; 