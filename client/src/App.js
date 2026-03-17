/**
 * NEXUS Test Platform - Main App Component
 * Sets up routing, context providers, and global state
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LangProvider } from './context/LangContext';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TestPage from './pages/TestPage';
import ResultsPage from './pages/ResultsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import PolicyPage from './pages/PolicyPage';

// Route Guards
import PrivateRoute from './components/common/PrivateRoute';
import AdminRoute from './components/common/AdminRoute';

import './index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <LangProvider>
        <ThemeProvider>
          {/* Global Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#12122e',
                color: '#fff',
                border: '1px solid rgba(0, 245, 255, 0.3)',
                fontFamily: 'DM Sans, sans-serif',
              },
              success: {
                iconTheme: { primary: '#00ff88', secondary: '#12122e' },
              },
              error: {
                iconTheme: { primary: '#ff006e', secondary: '#12122e' },
              },
            }}
          />

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />

            {/* Protected User Routes */}
            <Route path="/dashboard" element={
              <PrivateRoute><DashboardPage /></PrivateRoute>
            } />
            <Route path="/test/:category" element={
              <PrivateRoute><TestPage /></PrivateRoute>
            } />
            <Route path="/results/:id" element={
              <PrivateRoute><ResultsPage /></PrivateRoute>
            } />
            <Route path="/profile" element={
              <PrivateRoute><ProfilePage /></PrivateRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin/*" element={
              <AdminRoute><AdminPage /></AdminRoute>
            } />

            <Route path="/policy" element={<PolicyPage />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ThemeProvider>
        </LangProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
