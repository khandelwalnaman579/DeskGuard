/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Server, ArrowLeft, ShieldAlert } from 'lucide-react';
export const MaintenancePage = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center px-6 text-center select-none font-sans">
      <div className="max-w-md bg-slate-950 border border-slate-800 p-8 rounded-2xl space-y-6 shadow-2xl">
        
        <div className="w-16 h-16 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mx-auto border border-amber-500/20 animate-pulse">
          <Server size={32} />
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] bg-amber-550/10 border border-amber-500/20 text-amber-400 font-mono px-2.5 py-1 rounded">
            FIRMWARE INVENTORY UPDATE
          </span>
          <h1 className="text-2xl font-black tracking-tight text-white">System Maintenance</h1>
          <p className="text-xs text-slate-500 font-mono">DESKGRID FIRMWARE SYNC v1.2.0</p>
        </div>

        <p className="text-sm text-slate-400 leading-relaxed leading-normal">
          Active passive microwave motion sensors, power outlet channels, and physical check-in interfaces are currently undergoing routine battery replacements and local server synchronization.
        </p>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-left flex items-start gap-3">
          <ShieldAlert size={18} className="text-indigo-400 shrink-0 mt-0.5" />
          <p className="text-slate-500 text-[11px] leading-relaxed">
            Note: Core reservation timers and student study history logs survive maintenance intervals intact under durable local state caches.
          </p>
        </div>

        <button onClick={() => navigate(-1)} className="w-full h-11 inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-850 hover:text-white text-slate-200 border border-slate-800 font-bold rounded-xl text-xs shadow transition cursor-pointer">
          <ArrowLeft size={14} />
          <span>Restore Previous Window</span>
        </button>

      </div>
    </div>;
};