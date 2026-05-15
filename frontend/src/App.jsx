import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import AuditLogsPage from './pages/AuditLogsPage';
import CronJobsPage from './pages/CronJobsPage';
import { motion } from 'framer-motion';

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', backgroundColor: '#222', color: 'red', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h2>Application Crashed!</h2>
          <p style={{ color: 'white' }}>{this.state.error && this.state.error.toString()}</p>
          <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', marginTop: '20px' }}>Reload Page</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const LoadingScreen = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-[#030303] relative overflow-hidden">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
    <motion.div 
      animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shadow-glow relative z-10"
    >
      <svg viewBox="0 0 24 24" className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </motion.div>
    <div className="mt-10 flex flex-col items-center gap-3 relative z-10">
      <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Initializing Core</div>
    </div>
  </div>
);

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) return <Navigate to="/dashboard" replace />;
  return children;
};

const AuthRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingScreen />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
      <Route path="/register" element={<AuthRoute><RegisterPage /></AuthRoute>} />
      
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<ProtectedRoute allowedRoles={['admin','manager']}><UsersPage /></ProtectedRoute>} />
        <Route path="/audit-logs" element={<ProtectedRoute allowedRoles={['admin','manager']}><AuditLogsPage /></ProtectedRoute>} />
        <Route path="/cron-jobs" element={<ProtectedRoute allowedRoles={['admin']}><CronJobsPage /></ProtectedRoute>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <GlobalErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
          <Toaster position="top-right" />
        </AuthProvider>
      </BrowserRouter>
    </GlobalErrorBoundary>
  );
}
