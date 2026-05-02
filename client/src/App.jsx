import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import { Toaster } from 'react-hot-toast';

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <span style={{ color: '#8892b0', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem' }}>
          Initializing...
        </span>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/admin/login" element={<AdminLogin />} />
    <Route
      path="/admin/dashboard"
      element={
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    {/* Redirect /admin to /admin/login */}
    <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
    {/* 404 */}
    <Route path="*" element={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', background: 'var(--bg-primary)', color: '#f0f0f5', gap: '1rem' }}>
        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '4rem', fontWeight: 800, background: 'linear-gradient(135deg, #00d4ff, #9b59b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>404</h1>
        <p style={{ color: '#8892b0' }}>Page not found.</p>
        <a href="/" style={{ color: '#00d4ff', textDecoration: 'none', fontWeight: 600 }}>← Go Home</a>
      </div>
    } />
  </Routes>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(13, 13, 26, 0.95)',
              color: '#f0f0f5',
              border: '1px solid rgba(0, 212, 255, 0.2)',
              backdropFilter: 'blur(20px)',
              borderRadius: '12px',
              fontSize: '0.9rem',
            },
          }}
        />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
