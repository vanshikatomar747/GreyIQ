import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Canvas3D from './components/Canvas3D';
import CustomCursor from './components/CustomCursor';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import StudentDashboard from './pages/StudentDashboard';
import TestPortal from './pages/TestPortal';
import Test1Analysis from './pages/Test1Analysis';
import Test2Analysis from './pages/Test2Analysis';
import ApplyCertification from './pages/ApplyCertification';
import AdminDashboard from './pages/AdminDashboard';
import OurFounders from './pages/OurFounders';
import ProgramDetails from './pages/ProgramDetails';
import PlacementSupport from './pages/PlacementSupport';
import ContactUs from './pages/ContactUs';
import Horizon from './pages/Horizon';
import Synergy from './pages/Synergy';

// Role-Based Route Guard Helper
function ProtectedRoute({ children, role }) {
  const { isAuthenticated, user } = useAppStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user?.role !== role) {
    // Redirect if they try to access student route as admin or vice-versa
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return children;
}

// Guest-Only Route Guard Helper (Redirects authenticated users to their dashboards)
function GuestRoute({ children }) {
  const { isAuthenticated, user } = useAppStore();

  if (isAuthenticated) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return children;
}

export default function App() {
  const { isAuthenticated } = useAppStore();
  const location = useLocation();
  const isTestPortal = location.pathname.startsWith('/test/');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <CustomCursor />
      <Canvas3D />

      {/* Suppress Navbar and Footer when student is taking high-stakes exams */}
      {!isTestPortal && <Navbar />}

      <div className="min-h-[85vh]">
        <Routes>
          {/* Public Views */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/our-founders" element={<OurFounders />} />
          <Route path="/program-details" element={<ProgramDetails />} />
          <Route path="/placement-support" element={<PlacementSupport />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/horizon" element={<Horizon />} />
          <Route path="/synergy" element={<Synergy />} />

          {/* Guest-Only Views */}
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/admin-login" element={<GuestRoute><AdminLogin /></GuestRoute>} />

          {/* Protected Student Views */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/test/:testId"
            element={
              <ProtectedRoute role="student">
                <TestPortal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analysis/test1"
            element={
              <ProtectedRoute role="student">
                <Test1Analysis />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analysis/test2"
            element={
              <ProtectedRoute role="student">
                <Test2Analysis />
              </ProtectedRoute>
            }
          />
          <Route
            path="/apply-certification"
            element={
              <ProtectedRoute role="student">
                <ApplyCertification />
              </ProtectedRoute>
            }
          />

          {/* Protected Administrator Views */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {!isTestPortal && !isAuthenticated && location.pathname !== '/login' && <Footer />}
    </>
  );
}
