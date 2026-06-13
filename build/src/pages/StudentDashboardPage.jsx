/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSpace } from '../context/SpaceContext';
import { Clock, Map, DoorOpen, LogOut, History, ShieldAlert, MapPin, AlertCircle, ArrowUpRight, CheckCircle2, Moon, Sparkles } from 'lucide-react';
export const StudentDashboardPage = () => {
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const {
    desks,
    activeSession,
    releaseDesk,
    toggleAway,
    bookingLogs
  } = useSpace();

  // Aggregate stats
  const totalDesks = desks.length;
  const occupiedDesks = desks.filter(d => d.status === 'Occupied' || d.status === 'Away').length;
  const liveOccupancyPercentage = totalDesks > 0 ? Math.round(occupiedDesks / totalDesks * 100) : 0;

  // Format active session remaining time (e.g. 02:44:56)
  const formatSeconds = ticks => {
    const hrs = Math.floor(ticks / 3600);
    const mins = Math.floor(ticks % 3600 / 60);
    const secs = ticks % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  const [showCheckoutModal, setShowCheckoutModal] = React.useState(false);
  const handleCheckout = () => {
    setShowCheckoutModal(true);
  };
  const handleCheckoutConfirm = () => {
    releaseDesk();
    setShowCheckoutModal(false);
  };
  const handleGoAway = () => {
    toggleAway();
    navigate('/away-mode');
  };
  return <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 selection:bg-indigo-150">
      
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-indigo-50 to-transparent opacity-80 pointer-events-none" />
        
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Welcome back, {user?.name || 'Student'}.</h2>
            <Sparkles size={18} className="text-amber-500 fill-current animate-pulse" />
          </div>
          <p className="text-xs text-slate-500 font-mono tracking-wider uppercase flex items-center gap-1.5">
            <span>Academic ID: {user?.studentId || 'UG-882910'}</span>
            <span className="text-slate-300">•</span>
            <span>Trust Score: <strong className="text-indigo-650">{user?.trustScore || 98}%</strong></span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10">
          <button onClick={() => navigate('/floor-map')} className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-600/10 cursor-pointer transition">
            <Map size={14} />
            <span>Interactive Floor Map</span>
          </button>
          
          <button onClick={() => navigate('/study-history')} className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer transition">
            <History size={14} />
            <span>My Study Logs</span>
          </button>
        </div>
      </div>

      {/* Primary Row Grid: Left (Active Session / Info), Right (Library Gauge) */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left Grid: Active Seat or No Booking State */}
        <div className="lg:col-span-8 space-y-6">
          {activeSession ? <div className="bg-white border border-indigo-120 shadow-md shadow-indigo-500/5 rounded-2xl overflow-hidden">
              {/* Header block with red animated badge for verification alerts and status */}
              <div className="px-6 py-4 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-indigo-600 animate-bounce" />
                  <span className="text-xs font-bold text-indigo-950 uppercase tracking-wider font-mono">
                    YOUR CURRENT LOCATION: FLOOR {activeSession.floor} SECTION
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                  <span className="bg-indigo-605 text-white font-mono text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    Desk {activeSession.deskId.replace('D-', '')}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-6">
                
                {/* Timer details */}
                <div className="grid sm:grid-cols-3 gap-6">
                  
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Session remaining</span>
                    <p className="text-3xl font-black text-slate-900 font-mono tracking-tight animate-pulse">
                      {formatSeconds(activeSession.timeRemainingSeconds)}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Study Hours Active</span>
                    <p className="text-2xl font-black text-slate-700 font-mono">
                      {Math.floor(activeSession.activeSeconds / 3600)}h {Math.floor(activeSession.activeSeconds % 3600 / 60)}m
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Inactivity Protection</span>
                    <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 mt-1 rounded-full border border-emerald-100">
                      <CheckCircle2 size={12} />
                      Motion Active
                    </span>
                  </div>

                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-500 font-medium">
                    <span>Target: 3 Hours Block</span>
                    <span>{Math.round(activeSession.activeSeconds / 10800 * 100)}% Completed</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full transition-all duration-500" style={{
                  width: `${Math.min(100, Math.round(activeSession.activeSeconds / 10800 * 100))}%`
                }} />
                  </div>
                </div>

                {/* Hoarding Warning Indicator */}
                <div className="p-4 bg-amber-50 border border-amber-100 text-amber-900 rounded-xl flex items-start gap-3">
                  <ShieldAlert size={18} className="text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-amber-950 font-sans uppercase tracking-wider">Hoarding alert system active</h4>
                    <p className="text-[11px] text-amber-800 leading-normal font-sans">
                      Leaving Desk unattended for more than 20 minutes triggers <strong>Away Mode expiration</strong>, flagging presence verification warnings and releasing seat automatically.
                    </p>
                  </div>
                </div>

                {/* Quick actions panel */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
                  
                  <button onClick={() => navigate('/active-session')} className="flex flex-col items-center justify-center p-3 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100/40 rounded-xl transition cursor-pointer">
                    <Clock size={16} className="text-indigo-650 mb-1" />
                    <span className="text-xs font-bold text-indigo-950">Focus Timer</span>
                  </button>

                  <button onClick={handleGoAway} className="flex flex-col items-center justify-center p-3 bg-amber-50/40 hover:bg-amber-50 border border-amber-100/40 rounded-xl transition cursor-pointer">
                    <Moon size={16} className="text-amber-600 mb-1" />
                    <span className="text-xs font-bold text-amber-955">Go Away (Temp)</span>
                  </button>

                  <button onClick={handleCheckout} className="flex flex-col items-center justify-center p-3 bg-red-50/50 hover:bg-red-50 border border-red-100/40 rounded-xl transition cursor-pointer">
                    <DoorOpen size={16} className="text-red-550 mb-1" />
                    <span className="text-xs font-bold text-red-950">Check Out Slot</span>
                  </button>

                  <button onClick={() => navigate('/study-history')} className="flex flex-col items-center justify-center p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/40 rounded-xl transition cursor-pointer">
                    <History size={16} className="text-slate-500 mb-1" />
                    <span className="text-xs font-bold text-slate-700">Past Bookings</span>
                  </button>

                </div>

              </div>
            </div> : <div className="bg-white border border-slate-200/85 shadow-sm rounded-2xl p-8 text-center space-y-6">
              <div className="mx-auto w-14 h-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center">
                <MapPin size={24} />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-lg font-bold text-slate-900">No Active Desk Booked</h3>
                <p className="text-sm text-slate-500">
                  You are not currently checked into any study desk. Book an available seat from Floor 2 floor sheets to begin your session.
                </p>
              </div>
              <button onClick={() => navigate('/floor-map')} className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-705 text-white font-bold rounded-xl text-sm shadow cursor-pointer transition">
                <span>Book Study Seat Now</span>
                <ArrowUpRight size={16} />
              </button>
            </div>}

          {/* Historical recent activity overview on dashboard */}
          <div className="bg-white border border-slate-200/85 rounded-2xl p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wider border-b border-slate-100 pb-3">
              YOUR RECENT BOOKING SESSIONS
            </h3>
            <div className="divide-y divide-slate-100">
              {bookingLogs.slice(0, 3).map(log => <div key={log.id} className="py-3 flex items-center justify-between text-sm">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-800">{log.deskId}</p>
                    <p className="text-xs text-slate-400 font-mono">{log.date} @ {log.checkIn}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-bold text-slate-705 font-mono">{log.duration}</p>
                    <span className={`inline-block font-mono text-[9px] uppercase px-1.5 py-0.5 rounded ${log.status === 'Completed' ? 'bg-emerald-550/10 text-emerald-700' : 'bg-red-500/10 text-red-700'}`}>
                      {log.status}
                    </span>
                  </div>
                </div>)}
            </div>
          </div>
        </div>

        {/* Right Grid: Occupancy gauge & regulations */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-slate-900 text-white rounded-2xl border border-slate-800/80 p-6 space-y-6 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-white">Central Library Occupancy</h3>
              <span className="text-[10px] text-slate-450 font-mono uppercase tracking-wider">Interactive campus status</span>
            </div>

            {/* Circular-looking gauge display or progress block */}
            <div className="flex flex-col items-center justify-center py-4 space-y-2 relative">
              <div className="w-32 h-32 rounded-full border-8 border-indigo-950 flex flex-col items-center justify-center relative">
                {/* Half accent border mock */}
                <div className="absolute inset-0 rounded-full border-8 border-indigo-500 border-t-transparent border-r-transparent animate-spin duration-3000" />
                <span className="text-3xl font-black font-mono text-white">{liveOccupancyPercentage}%</span>
                <span className="text-[10px] text-slate-400 font-mono uppercase">Full Load</span>
              </div>
              <p className="text-slate-400 font-medium text-xs font-mono text-center">
                {occupiedDesks} of {totalDesks} desks occupied
              </p>
            </div>

            {/* Quick Floor breakdowns */}
            <div className="space-y-3 pt-4 border-t border-slate-800 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Level 1 (General Library)</span>
                <span className="font-bold text-white font-mono">
                  {desks.filter(d => d.floor === 1 && d.status === 'Occupied').length} / {desks.filter(d => d.floor === 1).length} Desks
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Level 2 (Quiet Study Hub)</span>
                <span className="font-bold text-white font-mono">
                  {desks.filter(d => d.floor === 2 && d.status === 'Occupied').length} / {desks.filter(d => d.floor === 2).length} Desks
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Level 3 (Computer Clusters)</span>
                <span className="font-bold text-white font-mono">
                  {desks.filter(d => d.floor === 3 && d.status === 'Occupied').length} / {desks.filter(d => d.floor === 3).length} Desks
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-205 rounded-2xl p-6 space-y-3 shadow-sm text-xs">
            <h4 className="text-xs font-bold text-slate-900 font-mono uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle size={14} className="text-indigo-600" />
              DeskGuard Compliance Code
            </h4>
            <ul className="space-y-2 text-slate-500 list-disc list-inside leading-relaxed">
              <li>Students must physically check into their booked desks.</li>
              <li>Away Mode holds seat for exactly 20 minutes.</li>
              <li>Failing to click "Yes, I'm Here" on presence verification releases the desk immediately.</li>
              <li>Flagged offenses can reduce trust scores and lead to admin suspensions.</li>
            </ul>
          </div>

        </div>

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
              <button id="confirm-checkout-btn" onClick={handleCheckoutConfirm} className="flex-1 py-2.5 bg-red-650 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-md shadow-red-605/10">
                Yes, Check Out
              </button>
            </div>
          </div>
        </div>}
    </div>;
};