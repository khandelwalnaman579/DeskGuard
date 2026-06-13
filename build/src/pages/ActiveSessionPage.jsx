/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpace } from '../context/SpaceContext';
import { useAuth } from '../context/AuthContext';
import { Moon, LogOut, CheckCircle, ShieldAlert, Clock, MapPin, Send, HardDrive, Sparkles } from 'lucide-react';
export const ActiveSessionPage = () => {
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const {
    activeSession,
    toggleAway,
    releaseDesk,
    addActivityNotification
  } = useSpace();
  const [ticketText, setTicketText] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  if (!activeSession) {
    return <div className="p-8 max-w-lg mx-auto text-center space-y-6">
        <div className="w-14 h-14 bg-slate-105 rounded-full flex items-center justify-center text-slate-400 mx-auto">
          <Clock size={24} />
        </div>
        <h3 className="text-lg font-bold text-slate-900">No Active Session Seated</h3>
        <p className="text-sm text-slate-500">You are not currently checked into any library desk. Book an available seat to start a focus timer.</p>
        <button onClick={() => navigate('/floor-map')} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-705 text-white font-bold rounded-xl text-xs transition shadow">
          Book study seat
        </button>
      </div>;
  }

  // Time converters
  const formatSeconds = ticks => {
    const hrs = Math.floor(ticks / 3600);
    const mins = Math.floor(ticks % 3600 / 60);
    const secs = ticks % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const handleCheckout = () => {
    setShowCheckoutModal(true);
  };
  const handleCheckoutConfirm = () => {
    releaseDesk();
    setShowCheckoutModal(false);
    navigate('/student-dashboard');
  };
  const handleGoAway = () => {
    toggleAway();
    navigate('/away-mode');
  };
  const handleTroubleReport = e => {
    e.preventDefault();
    if (!ticketText) return;
    addActivityNotification(`Trouble Ticket Submitted: Desk ${activeSession.deskId.replace('D-', '')}`, `Reported: "${ticketText}" Form submitted by student.`, 'warning', activeSession.deskId);
    setTicketText('');
    setTicketSubmitted(true);
    setTimeout(() => setTicketSubmitted(false), 5000);
  };
  return <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8 selection:bg-indigo-150">
      
      {/* Title block */}
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Focus Control Center</h2>
        <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">
          Student dynamic workspace session manager
        </p>
      </div>

      {/* Main Seat Widget Frame */}
      <div className="bg-white border border-indigo-150 shadow-lg shadow-indigo-600/5 rounded-2xl overflow-hidden grid md:grid-cols-12">
        
        {/* Left Grid Panel: Giant Timer */}
        <div className="md:col-span-7 p-6 md:p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-550/10 text-emerald-800 font-mono text-[10px] font-bold uppercase py-0.5 px-2 rounded border border-emerald-500/20">
                ● SESSION OCCUPIED ACTIVE
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-400 font-mono">ID: #{activeSession.deskId}</span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Remaining study block</span>
              <h1 className="text-5xl md:text-6xl font-black text-slate-900 font-mono tracking-tighter">
                {formatSeconds(activeSession.timeRemainingSeconds)}
              </h1>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Acquired study time</span>
              <p className="text-xl font-bold text-slate-650 font-mono">
                {Math.floor(activeSession.activeSeconds / 3600)}h {Math.floor(activeSession.activeSeconds % 3600 / 60)}m elapsed
              </p>
            </div>
          </div>

          {/* Quick Buttons */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100">
            
            <button onClick={handleGoAway} className="flex items-center justify-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-600 active:translate-y-0 text-white font-bold rounded-xl shadow transition cursor-pointer">
              <Moon size={16} />
              <span>Go Away (20m Max)</span>
            </button>

            <button onClick={handleCheckout} className="flex items-center justify-center gap-2 px-5 py-3 bg-red-650 hover:bg-red-700 text-white font-bold rounded-xl shadow transition cursor-pointer">
              <LogOut size={16} />
              <span>Check Out Desk</span>
            </button>

          </div>
        </div>

        {/* Right Grid panel: Desk details list & alerts */}
        <div className="md:col-span-5 bg-slate-50 border-t md:border-t-0 md:border-l border-slate-200/80 p-6 md:p-8 space-y-6">
          <h3 className="text-xs font-bold text-slate-900 font-mono uppercase tracking-wider border-b border-slate-200 pb-2">
            Workspace blueprint metadata
          </h3>

          <div className="space-y-4 text-xs font-sans">
            
            <div className="flex items-start gap-2.5">
              <MapPin size={16} className="text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-bold text-slate-800">Physical Coordinate</p>
                <p className="text-slate-500">Floor level {activeSession.floor}, Study desk #{activeSession.deskId.replace('D-', '')}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <HardDrive size={16} className="text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-bold text-slate-800">Hardware Sensor Shield</p>
                <p className="text-slate-500">Desk Guard passive microwave motion sensor status active</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <ShieldAlert size={16} className="text-amber-650 mt-0.5 shrink-0" />
              <div>
                <p className="font-bold text-slate-900 uppercase">Idling warning limit</p>
                <p className="text-slate-500">20m max. Unattended desks cleared auto or manually reported by operators.</p>
              </div>
            </div>

          </div>

          {/* Compliance notice */}
          <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl text-[11px] text-indigo-950 flex items-start gap-2">
            <Sparkles size={14} className="text-indigo-600 shrink-0 mt-0.5 animate-pulse" />
            <p>Seating rule: Compliance updates trust score logs. Release immediately on study conclusion.</p>
          </div>
        </div>

      </div>

      {/* Trouble submission panel */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
        <h3 className="text-sm font-bold text-slate-950 font-mono uppercase tracking-wider border-b border-indigo-50/10 pb-3 mb-4">
          Report technical or occupancy issue
        </h3>
        
        {ticketSubmitted ? <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2">
            <CheckCircle size={18} className="text-emerald-600 shrink-0" />
            <span>Thank you. Trouble report logged. Attendants have been notified.</span>
          </div> : <form onSubmit={handleTroubleReport} className="space-y-3">
            <span className="text-[10px] text-slate-400 font-mono block">Describe problem (e.g. Broken socket, messy desk, inaccurate sensors)</span>
            <div className="flex flex-col sm:flex-row gap-3">
              <input type="text" value={ticketText} onChange={e => setTicketText(e.target.value)} placeholder="Desk outlet has no power supply. Need help..." className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 rounded-xl text-xs outline-none transition" required />
              <button type="submit" className="inline-flex items-center justify-center gap-1.5 px-5 py-2 bg-slate-900 hover:bg-slate-805 text-white text-xs font-bold rounded-xl transition cursor-pointer">
                <span>Report</span>
                <Send size={12} />
              </button>
            </div>
          </form>}
      </div>

      {showCheckoutModal && <div id="checkout-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 max-w-sm w-full space-y-5 shadow-2xl text-center">
            <div className="mx-auto w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
              <LogOut size={22} className="rotate-180" />
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-900 font-sans">Checkout Study Seat</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                Are you sure you want to finish study and check out of your desk? This action finishes your active session and logs study hours to your system history.
              </p>
            </div>
            <div className="flex gap-3">
              <button id="cancel-checkout-btn" onClick={() => setShowCheckoutModal(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer">
                Cancel
              </button>
              <button id="confirm-checkout-btn" onClick={handleCheckoutConfirm} className="flex-1 py-2.5 bg-red-655 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-md shadow-red-605/10">
                Yes, Check Out
              </button>
            </div>
          </div>
        </div>}
    </div>;
};