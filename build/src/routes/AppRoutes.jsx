/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts & Guards
import { ProtectedRoute, AdminProtectedRoute } from '../components/ProtectedRoute';
import { StudentLayout } from '../layouts/StudentLayout';
import { AdminLayout } from '../layouts/AdminLayout';

// Public Pages
import { LandingPage } from '../pages/LandingPage';
import { StudentLoginPage } from '../pages/StudentLoginPage';
import { StudentRegistrationPage } from '../pages/StudentRegistrationPage';
import { AdminLoginPage } from '../pages/AdminLoginPage';
import { MaintenancePage } from '../pages/MaintenancePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { UnauthorizedPage } from '../pages/UnauthorizedPage';
import { CheckInPage } from '../pages/CheckInPage';

// Student Pages
import { StudentDashboardPage } from '../pages/StudentDashboardPage';
import { FloorMapPage } from '../pages/FloorMapPage';
import { ActiveSessionPage } from '../pages/ActiveSessionPage';
import { AwayModePage } from '../pages/AwayModePage';
import { PresenceVerificationPage } from '../pages/PresenceVerificationPage';
import { HistoryPage } from '../pages/HistoryPage';
import { StudentProfilePage } from '../pages/StudentProfilePage';

// Admin Pages
import { AdminDashboardPage } from '../pages/AdminDashboardPage';
import { AdminFloorMapPage } from '../pages/AdminFloorMapPage';
import { ManageStudentsPage } from '../pages/ManageStudentsPage';
import { LiveSessionsPage } from '../pages/LiveSessionsPage';
import { DeskManagementPage } from '../pages/DeskManagementPage';
import { AbandonedDesksPage } from '../pages/AbandonedDesksPage';
import { ReportsPage } from '../pages/ReportsPage';
export const AppRoutes = () => {
  return <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/student-login" element={<StudentLoginPage />} />
      <Route path="/student-register" element={<StudentRegistrationPage />} />
      <Route path="/admin-login" element={<AdminLoginPage />} />
      <Route path="/system-maintenance" element={<MaintenancePage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/check-in/:deskId" element={<ProtectedRoute>
            <CheckInPage />
          </ProtectedRoute>} />

      {/* Student Protected Routes */}
      <Route path="/student-dashboard" element={<ProtectedRoute>
            <StudentLayout>
              <StudentDashboardPage />
            </StudentLayout>
          </ProtectedRoute>} />
      <Route path="/floor-map" element={<ProtectedRoute>
            <StudentLayout>
              <FloorMapPage />
            </StudentLayout>
          </ProtectedRoute>} />
      <Route path="/active-session" element={<ProtectedRoute>
            <StudentLayout>
              <ActiveSessionPage />
            </StudentLayout>
          </ProtectedRoute>} />
      <Route path="/away-mode" element={<ProtectedRoute>
            <AwayModePage />
          </ProtectedRoute>} />
      <Route path="/presence-verification" element={<ProtectedRoute>
            <PresenceVerificationPage />
          </ProtectedRoute>} />
      <Route path="/study-history" element={<ProtectedRoute>
            <StudentLayout>
              <HistoryPage />
            </StudentLayout>
          </ProtectedRoute>} />
      <Route path="/student-profile" element={<ProtectedRoute>
            <StudentLayout>
              <StudentProfilePage />
            </StudentLayout>
          </ProtectedRoute>} />

      {/* Admin Protected Routes */}
      <Route path="/admin-dashboard" element={<AdminProtectedRoute>
            <AdminLayout>
              <AdminDashboardPage />
            </AdminLayout>
          </AdminProtectedRoute>} />
      <Route path="/admin-floor-map" element={<AdminProtectedRoute>
            <AdminLayout>
              <AdminFloorMapPage />
            </AdminLayout>
          </AdminProtectedRoute>} />
      <Route path="/admin-students" element={<AdminProtectedRoute>
            <AdminLayout>
              <ManageStudentsPage />
            </AdminLayout>
          </AdminProtectedRoute>} />
      <Route path="/admin-live-sessions" element={<AdminProtectedRoute>
            <AdminLayout>
              <LiveSessionsPage />
            </AdminLayout>
          </AdminProtectedRoute>} />
      <Route path="/admin-desk-management" element={<AdminProtectedRoute>
            <AdminLayout>
              <DeskManagementPage />
            </AdminLayout>
          </AdminProtectedRoute>} />
      <Route path="/admin-abandoned-desks" element={<AdminProtectedRoute>
            <AdminLayout>
              <AbandonedDesksPage />
            </AdminLayout>
          </AdminProtectedRoute>} />
      <Route path="/admin-reports" element={<AdminProtectedRoute>
            <AdminLayout>
              <ReportsPage />
            </AdminLayout>
          </AdminProtectedRoute>} />

      {/* 404 Not Found & Fallbacks */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>;
};