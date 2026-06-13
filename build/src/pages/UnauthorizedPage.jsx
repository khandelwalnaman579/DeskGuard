/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const dashboardPath = user?.role === 'admin' ? '/admin-dashboard' : '/student-dashboard';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-6 text-center select-none font-sans">
      <div className="max-w-md space-y-6">

        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto shadow border border-rose-100">
          <ShieldAlert size={32} />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Access Denied</h1>
          <p className="text-xs text-slate-500 font-mono tracking-wider uppercase">Insufficient Permissions</p>
        </div>

        <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
          You don't have the required permissions to view this page. If you believe this is a mistake, please contact a system administrator.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
          >
            <Home size={14} />
            <span>Return Home</span>
          </button>
          {user && (
            <button
              onClick={() => navigate(dashboardPath)}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-705 text-white font-bold rounded-xl text-xs shadow-md transition cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Return to Dashboard</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
