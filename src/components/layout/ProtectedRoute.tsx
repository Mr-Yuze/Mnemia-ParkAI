import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
}) => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
        <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium text-slate-500">Checking credentials & security status...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-[70vh] max-w-lg mx-auto flex flex-col items-center justify-center text-center p-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 font-display">Administrator Access Required</h2>
        <p className="text-sm text-slate-600 mt-2">
          Your current account (<span className="font-semibold text-slate-800">{user.email}</span>) does not have system administrator privileges.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="px-4 py-2 text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
          >
            Go to User Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
