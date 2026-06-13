/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export const ProtectedRoute = ({
  children
}) => {
  const {
    user,
    loading
  } = useAuth();
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#f8f9ff]">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>;
  }
  if (!user) {
    return <Navigate to="/student-login" replace />;
  }
  if (user.role !== 'student') {
    return <Navigate to="/unauthorized" replace />;
  }
  return <>{children}</>;
};
export const AdminProtectedRoute = ({
  children
}) => {
  const {
    user,
    loading
  } = useAuth();
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#f8f9ff]">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>;
  }
  if (!user) {
    return <Navigate to="/admin-login" replace />;
  }
  if (user.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }
  return <>{children}</>;
};