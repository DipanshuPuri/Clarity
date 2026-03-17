import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { ROUTES } from './routes/config';

// Simple Page Imports (Mocked or Real)
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import FAQ from './pages/FAQ';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Dashboard from './pages/Dashboard';
import Projects from './pages/ProjectsPage';
import ProjectView from './pages/ProjectDetailPage';
import WorkflowPage from './pages/WorkflowPage';
import Analytics from './pages/Analytics';
import OrganizationDashboard from './pages/OrganizationDashboard';
import Releases from './pages/Releases';
import ProfilePage from './pages/ProfilePage';

import { AuthProvider } from './context/AuthContext';
import { WorkflowProvider } from './context/WorkflowContext';
import RequireAuth from './components/RequireAuth';
import ScrollToTop from './components/ScrollToTop';

/**
 * App.jsx - Refactored Routing Architecture
 */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* 1. Public Routes */}
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />
          <Route path={ROUTES.FAQ} element={<FAQ />} />
          <Route path={ROUTES.TERMS} element={<Terms />} />
          <Route path={ROUTES.PRIVACY} element={<Privacy />} />

          {/* 2. Authenticated Routes Tree (/app) */}
          <Route
            path={ROUTES.APP_ROOT}
            element={
              <RequireAuth>
                <MainLayout />
              </RequireAuth>
            }
          >
            {/* Dashboard Redirect as Default */}
            <Route index element={<Navigate to={ROUTES.DASHBOARD} replace />} />

            {/* Application Pages */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:projectId" element={<ProjectView />} />
            <Route path="workflow" element={
              <WorkflowProvider>
                <WorkflowPage />
              </WorkflowProvider>
            } />
            <Route path="analytics" element={<Analytics />} />
            <Route path="organization" element={<OrganizationDashboard />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="releases" element={<Releases />} />
          </Route>

          {/* 3. Global Redirection & Catch-all */}
          {/* Redirect old top-level routes to /app */}
          <Route path="/dashboard" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          <Route path="/projects" element={<Navigate to={ROUTES.PROJECTS} replace />} />

          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
