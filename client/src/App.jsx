import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectView from './pages/ProjectView';
import IntentView from './pages/IntentView';
import DecisionView from './pages/DecisionView';
import TaskDetail from './pages/TaskDetail';
import Tasks from './pages/Tasks';
import Reports from './pages/Reports';
import Home from './pages/Home';
import FAQ from './pages/FAQ';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Register from './pages/Register';
import { AuthProvider } from './context/AuthContext';
import RequireAuth from './components/RequireAuth';

/**
 * App.jsx - Root Application Component
 * 
 * Route Structure:
 * - /: Public Landing Page
 * - /login: Public Login
 * - /dashboard, /projects, etc: Protected with RequireAuth + MainLayout
 */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/register" element={<Register />} />

          {/* Authenticated Routes - Protected and Wrapped in MainLayout */}
          <Route
            path="/app"
            element={
              <RequireAuth>
                <MainLayout />
              </RequireAuth>
            }
          >
            {/* Automatic redirection to dashboard from app root */}
            <Route index element={<Navigate to="/app/dashboard" replace />} />

            {/* Individual Pages render via <Outlet /> in MainLayout */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:id" element={<ProjectView />} />
            <Route path="intents/:id" element={<IntentView />} />
            <Route path="decisions/:id" element={<DecisionView />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="tasks/:id" element={<TaskDetail />} />
            <Route path="reports" element={<Reports />} />
          </Route>

          {/* Backward compatibility / Redirection for old links */}
          <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
          <Route path="/projects" element={<Navigate to="/app/projects" replace />} />
          <Route path="/tasks" element={<Navigate to="/app/tasks" replace />} />
          <Route path="/reports" element={<Navigate to="/app/reports" replace />} />

          {/* Catch-all redirect to landing or dashboard depending on context */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
