/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpace } from '../context/SpaceContext';
import { ShieldAlert, AlertTriangle, Check, DoorOpen } from 'lucide-react';
export const PresenceVerificationPage = () => {
  const navigate = useNavigate();
  const {
    activeSession,
    confirmPresence,
    releaseDesk
  } = useSpace();
  if (!activeSession) {
    return <div className="p-8 max-w-sm mx-auto text-center space-y-4">
        <h3 className="text-lg font-bold text-slate-900 font-sans">No Active Verification Verification</h3>
        <button onClick={() => navigate('/student-dashboard')} className="px-4 py-2 bg-indigo-650 text-white rounded">
          Back
        </button>
      </div>;
  }
  const formatSeconds = ticks => {
    const mins = Math.floor(ticks / 60);
    const secs = ticks % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  const handleImHere = () => {
    confirmPresence();
    navigate('/student-dashboard');
  };
  const [showCheckoutModal, setShowCheckoutModal] = React.useState(false);
  const handleRelease = () => {
    setShowCheckoutModal(true);
  };
  const handleReleaseConfirm = () => {
    releaseDesk();
    setShowCheckoutModal(false);
    navigate('/student-dashboard');
  };
  return <div className="min-h-screen bg-rose-50/50 flex flex-col justify-center items-center px-6 selection:bg-rose-100">
      
      <div className="max-w-md w-full bg-white border border-rose-200/80 shadow-2xl rounded-2xl p-6 md:p-8 space-y-6 text-center animate-shake">
        
        {/* Verification alarm badge */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-500 text-white flex items-center justify-center p-2 relative animate-pulse">
          <ShieldAlert size={32} />
          <span className="absolute inset-0 rounded-2xl border border-rose-500 animate-ping opacity-75" />
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] bg-rose-100 border border-rose-205 text-rose-800 font-mono font-black uppercase px-2.5 py-1 rounded">
            DURABLE PRESENCE CHECK
          </span>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Are you still here?</h2>
          <p className="text-xs text-slate-500 font-mono">DESK COORDINATE: DESK {activeSession.deskId.replace('D-', '')}</p>
        </div>

        {/* Large Countdown Clock */}
        <div className="p-6 bg-rose-50/40 border border-rose-105 rounded-2xl space-y-1">
          <span className="text-[10px] text-rose-800/80 uppercase font-mono tracking-wider block font-bold">
            VERIFICATION COUNTDOWN
          </span>
          <h1 className="text-5xl font-black text-rose-650 font-mono tracking-tight animate-pulse">
            {formatSeconds(activeSession?.verificationTimeRemainingSeconds || 300)}
          </h1>
          <span className="text-[10px] text-slate-450 block font-mono">Limit caps at 05:00 minutes total</span>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed font-medium">
          Motion sensors have registered zero activity for an extended session block. Confirm you are physically occupying this workspace.
        </p>

        {/* Action button tree */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          
          <button onClick={handleImHere} className="h-11 inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-650 text-white text-xs font-bold rounded-xl shadow cursor-pointer transition">
            <Check size={16} />
            <span>Yes, I'm Here</span>
          </button>

          <button onClick={handleRelease} className="h-11 inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-805 text-white text-xs font-bold rounded-xl shadow cursor-pointer transition">
            <DoorOpen size={16} />
            <span>Release Desk</span>
          </button>

        </div>

        {/* Alert alert warning block */}
        <div className="p-3.5 bg-amber-50 border border-amber-105 rounded-xl text-left flex items-start gap-2.5">
          <AlertTriangle size={15} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[10px] text-amber-850 leading-tight leading-normal">
            Failing to verify within the time limit results in instant <strong>force clear desk eviction</strong>, lowering trust profile logs.
          </p>
        </div>

      </div>

      {showCheckoutModal && <div id="checkout-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 max-w-sm w-full space-y-5 shadow-2xl text-center">
            <div className="mx-auto w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
              <DoorOpen size={22} className="rotate-180" />
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-900 font-sans">Checkout & Vacate Slot</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                Are you sure you want to check out of your desk and release it back to general library availability?
              </p>
            </div>
            <div className="flex gap-3">
              <button id="cancel-checkout-btn" onClick={() => setShowCheckoutModal(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer">
                Cancel
              </button>
              <button id="confirm-checkout-btn" onClick={handleReleaseConfirm} className="flex-1 py-2.5 bg-red-655 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-md shadow-red-605/10">
                Yes, Check Out
              </button>
            </div>
          </div>
        </div>}
    </div>;
};