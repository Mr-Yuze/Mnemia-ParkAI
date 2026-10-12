import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { Toaster } from 'react-hot-toast';

// Layout
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { LocationsPage } from './pages/LocationsPage';
import { BookingPage } from './pages/BookingPage';
import { UserDashboard } from './pages/UserDashboard';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { ProfileSettingsPage } from './pages/ProfileSettingsPage';

// Admin Pages
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminSlotsPage } from './pages/AdminSlotsPage';
import { AdminBookingsPage } from './pages/AdminBookingsPage';
import { AdminAnalyticsPage } from './pages/AdminAnalyticsPage';

export const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <BookingProvider>
          <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800 antialiased selection:bg-brand-500 selection:text-white">
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#0f172a',
                  color: '#fff',
                  borderRadius: '16px',
                  fontSize: '13px',
                  fontWeight: 500,
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />

            <Navbar />

            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/locations" element={<LocationsPage />} />
                <Route path="/book" element={<BookingPage />} />

                {/* User Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <UserDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-bookings"
                  element={
                    <ProtectedRoute>
                      <MyBookingsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfileSettingsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Protected Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/slots"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminSlotsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/bookings"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminBookingsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/analytics"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminAnalyticsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </BookingProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
