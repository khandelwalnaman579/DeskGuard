/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpace } from '../context/SpaceContext';
import { Moon, AlertTriangle, ShieldCheck } from 'lucide-react';
export const AwayModePage = () => {
  const navigate = useNavigate();
  const {
    activeSession,
    returnFromAway
  } = useSpace();
  if (!activeSession) {
    return <div className="p-8 max-w-sm mx-auto text-center space-y-4">
        <h3 className="text-lg font-bold text-slate-900">No Active Session Seated</h3>
        <button onClick={() => navigate('/student-dashboard')} className="px-4 py-2 bg-indigo-600 text-white rounded">
          Back
        </button>
      </div>;
  }

  // Count down string
  const formatSeconds = ticks => {
    const mins = Math.floor(ticks / 60);
    const secs = ticks % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  const handleReturn = () => {
    returnFromAway();
    navigate('/student-dashboard');
  };
  return <div className="min-h-screen bg-amber-50/50 flex flex-col justify-center items-center px-6 selection:bg-amber-100">
      
      <div className="max-w-md w-full bg-white border border-amber-200/60 shadow-xl rounded-2xl p-6 md:p-8 space-y-6 text-center">
        
        {/* Glowing away header */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center p-2 relative">
          <Moon size={32} className="animate-pulse" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-550 rounded-full animate-bounce" />
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] bg-amber-100 border border-amber-200/50 text-amber-800 font-mono font-black uppercase px-2.5 py-1 rounded">
            AWAY MODE ACTIVE
          </span>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Temporary Absence Registered</h2>
          <p className="text-xs text-slate-450 font-mono">DESK: #{activeSession.deskId.replace('D-', '')}</p>
        </div>

        {/* Big countdown timer */}
        <div className="p-6 bg-amber-50/40 border border-amber-100 rounded-2xl space-y-2">
          <span className="text-[10px] text-amber-800/80 uppercase font-mono tracking-wider block font-bold">
            TIME REMAINING TO SECURE SEAT
          </span>
          <h1 className="text-5xl font-black text-amber-600 font-mono tracking-tight animate-pulse">
            {formatSeconds(activeSession?.awayTimeRemainingSeconds || 1200)}
          </h1>
          <span className="text-[10px] text-slate-400 block font-mono">Limit caps at 20:00 minutes total</span>
        </div>

        {/* Warning copy */}
        <div className="p-4 bg-red-50 border border-red-105 text-red-900 rounded-xl text-left flex items-start gap-3">
          <AlertTriangle size={18} className="text-red-650 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-red-955 font-sans">Compliance check alert</h4>
            <p className="text-[11px] text-red-800 leading-normal">
              If countdown reaches zero, sensors report desk abandoned. Desk releases automatically, a fine alert notification is logged, and trust score will degrade.
            </p>
          </div>
        </div>

        {/* Return CTA */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <button onClick={handleReturn} className="w-full h-12 inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-705 text-white text-sm font-bold rounded-xl shadow shadow-indigo-650/15 cursor-pointer transition-all hover:scale-101">
            <ShieldCheck size={18} />
            <span>Return Now & Check In</span>
          </button>
          
          <button onClick={() => navigate('/student-dashboard')} className="text-xs text-slate-400 hover:text-slate-600 font-mono font-medium">
            Go to dashboard &rarr;
          </button>
        </div>

      </div>
    </div>;
};