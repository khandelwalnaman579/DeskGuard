/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
export const NotFoundPage = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-6 text-center select-none font-sans">
      <div className="max-w-md space-y-6">
        
        <div className="w-16 h-16 bg-indigo-50 text-indigo-650 rounded-2xl flex items-center justify-center mx-auto shadow border border-indigo-100">
          <AlertCircle size={32} />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Coordinate Missing</h1>
          <p className="text-xs text-slate-500 font-mono tracking-wider uppercase">404 PAGE INVENTORY OUT OF RANGE</p>
        </div>

        <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
          It looks like the particular library route, student file coordinate, or admin setting pathway does not exist in DeskGuard's system index grids.
        </p>

        <button onClick={() => navigate('/')} className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-705 text-white font-bold rounded-xl text-xs shadow-md transition cursor-pointer">
          <ArrowLeft size={14} />
          <span>General Portal Gateway</span>
        </button>

      </div>
    </div>;
};