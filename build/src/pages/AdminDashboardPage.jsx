/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpace } from '../context/SpaceContext';
import { AlertCircle, Sparkles, Cpu } from 'lucide-react';
export const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const {
    desks,
    notifications,
    adminForceRelease,
    startPresenceVerification
  } = useSpace();

  // Aggregate stats
  const totalDesksCount = desks.length;
  const occupiedCount = desks.filter(d => d.status === 'Occupied').length;
  const availableCount = desks.filter(d => d.status === 'Available').length;
  const awayCount = desks.filter(d => d.status === 'Away').length;
  const disabledCount = desks.filter(d => d.status === 'Disabled').length;
  const abandonedCount = desks.filter(d => d.status === 'Away' || d.lastActivityText.toLowerCase().includes('abandoned')).length;
  const currentOccupancyPercent = totalDesksCount > 0 ? Math.round((occupiedCount + awayCount) / totalDesksCount * 100) : 0;

  // Utilize CSS mock charts for reliability
  const hourlyOccupancy = [{
    hour: '08:00 AM',
    load: 35
  }, {
    hour: '10:00 AM',
    load: 60
  }, {
    hour: '12:00 PM',
    load: 88
  }, {
    hour: '02:00 PM',
    load: 92
  }, {
    hour: '04:00 PM',
    load: 74
  }, {
    hour: '06:00 PM',
    load: 55
  }];
  return <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 text-slate-100 selection:bg-indigo-950 font-sans">
      
      {/* Dashboard Top Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-white tracking-tight">Operations Control Console</h2>
            <Sparkles size={16} className="text-amber-400 animate-pulse fill-current" />
          </div>
          <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">
            Real-time library occupancy monitor and smart seat clearing registry
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button onClick={() => {
          if (confirm('Deploying global presence checks to all occupied/away desks. Trigger alert?')) {
            // Deploy verification
            desks.forEach(d => {
              if (d.status === 'Occupied' || d.status === 'Away') {
                startPresenceVerification();
              }
            });
            alert('Mass verification alerts deployed to active study slots.');
          }
        }} className="px-4.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold font-sans rounded-xl shadow cursor-pointer transition animate-pulse">
            Deploy Mass Verification Check
          </button>
        </div>
      </div>

      {/* KPI Overviews Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="bg-[#111625] border border-slate-800 p-4.5 rounded-2xl space-y-1.5 shadow-md">
          <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider block">TOTAL CAP REGISTRY</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-white font-mono">{totalDesksCount}</span>
            <span className="text-[10px] text-slate-500 font-mono">slots</span>
          </div>
          <p className="text-[10px] text-slate-405 leading-none">Global monitored assets</p>
        </div>

        <div className="bg-[#111625] border border-slate-800 p-4.5 rounded-2xl space-y-1.5 shadow-md">
          <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider block">CURRENT OCCUPIED</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-indigo-400 font-mono">{occupiedCount}</span>
            <span className="text-[10px] text-slate-500">/ {totalDesksCount}</span>
          </div>
          <p className="text-[10px] text-slate-405 leading-none">Physically verified active</p>
        </div>

        <div className="bg-[#111625] border border-slate-800 p-4.5 rounded-2xl space-y-1.5 shadow-md">
          <span className="text-[9px] text-slate-505 font-mono uppercase tracking-wider block">FREE SLOTS</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-emerald-400 font-mono">{availableCount}</span>
            <span className="text-[10px] text-slate-500 font-mono">left</span>
          </div>
          <p className="text-[10px] text-slate-405 leading-none">Ready for immediate booking</p>
        </div>

        <div className="bg-[#111625] border border-slate-800 p-4.5 rounded-2xl space-y-1.5 shadow-md">
          <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider block">AWAY CHANNELS</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-amber-400 font-mono">{awayCount}</span>
            <span className="text-[10px] text-slate-500">/ 20m max</span>
          </div>
          <p className="text-[10px] text-purple-400 font-mono leading-none">{desks.filter(d => d.status === 'Disabled').length} Under maintenance</p>
        </div>

        <div className="bg-[#111625] border border-slate-800 p-4.5 rounded-2xl space-y-1.5 shadow-md border-amber-500/15">
          <span className="text-[9px] text-amber-400 font-mono uppercase tracking-wider block">HOARDING CHANNELS</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-rose-500 font-mono">{abandonedCount}</span>
            <span className="text-[10px] text-rose-405/70 font-mono bg-rose-500/10 px-1.5 rounded animate-pulse">Alert</span>
          </div>
          <p className="text-[10px] text-slate-405 leading-none">Sensor timed out idle seats</p>
        </div>

      </div>

      {/* Main Charts & Notifications section */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Occupancy Trends Graph & smart insights */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Custom Hourly Occupancy chart */}
          <div className="bg-[#111625] border border-slate-800 p-6 rounded-2xl shadow-md space-y-6">
            <div>
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                DAILY HOURLY OCCUPANCY TRENDS
              </h3>
              <p className="text-xs text-slate-500 mt-1">Average hourly utilization index (Levels 1-3)</p>
            </div>

            {/* Graphic Bar Chart */}
            <div className="grid grid-cols-6 gap-4 min-h-[160px] bg-slate-950 p-4 border border-slate-900 rounded-xl items-end relative overflow-hidden">
              <div className="absolute inset-0 bg-radial from-slate-900 via-transparent to-transparent opacity-50 block pointer-events-none" />
              
              {hourlyOccupancy.map((hr, idx) => <div key={idx} className="flex flex-col items-center gap-2 group relative z-10 w-full">
                  <div className="w-full bg-slate-850 hover:bg-slate-800 rounded-md h-[120px] relative transition-all">
                    {/* Inner percentage color indicators */}
                    <div className={`absolute inset-x-0 bottom-0 rounded-md transition-all ${hr.load > 85 ? 'bg-indigo-600 group-hover:bg-indigo-500' : hr.load > 60 ? 'bg-indigo-700 group-hover:bg-indigo-650' : 'bg-indigo-800 group-hover:bg-indigo-750'}`} style={{
                  height: `${hr.load}%`
                }} />
                    
                    {/* Tooltip percentage on hover */}
                    <span className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 bg-slate-900 text-white border border-slate-800 font-mono text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap pointer-events-none transition z-10 uppercase font-black uppercase">
                      {hr.load}% LOAD
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono tracking-wider">{hr.hour.split(' ')[0]}</span>
                </div>)}
            </div>
          </div>

          {/* Smart Insights Cards */}
          <div className="bg-[#111625] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-md">
            <h3 className="text-sm font-bold text-slate-100 font-mono uppercase tracking-wider border-b border-slate-800 pb-3">
              INTELLIGENT OCCUPANCY RECOMMENDATIONS
            </h3>

            <div className="space-y-3.5 text-xs">
              
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-200 rounded-xl flex gap-3 items-start">
                <AlertCircle className="text-amber-400 shrink-0 mt-0.5" size={16} />
                <div className="space-y-1">
                  <h4 className="font-bold text-amber-300">Level 2 (Quiet studying zone) Seat Hoarding Detected</h4>
                  <p className="text-slate-400 leading-normal">
                    Quiet Zone A is experiencing sustained Away Mode timers. Automated sensors indicate 3 desks have been vacant for over 15 minutes. Suggest deploying manual verify prompts.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-indigo-550/10 border border-indigo-500/20 text-indigo-200 rounded-xl flex gap-3 items-start">
                <Cpu className="text-indigo-400 shrink-0 mt-0.5" size={16} />
                <div className="space-y-1">
                  <h4 className="font-bold text-indigo-300">Predictive Load Threshold warning</h4>
                  <p className="text-slate-400 leading-normal">
                    Midterm review blocks peak forecast starting at 12:00 PM. System recommends disabling maintenance lockouts on Desk 104 and 209 to maximize capacity.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Right Side: Live activity notifications stream */}
        <div className="lg:col-span-5 bg-[#111625] border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                REAL-TIME OPERATIONS EVENT STREAM
              </h3>
              <p className="text-[10px] text-slate-550 mt-0.5">Sensor feedback triggers and alarm metrics</p>
            </div>
            <span className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] px-2 py-0.5 rounded font-mono font-bold animate-pulse">
              LIVE BROADCAST
            </span>
          </div>

          {/* List items */}
          <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
            {notifications.length === 0 ? <p className="text-slate-500 text-xs text-center py-10 font-mono">No recent activity logged completely.</p> : notifications.map(notif => <div key={notif.id} className="p-3.5 bg-slate-950/85 border border-slate-900 rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                    <span className={`inline-block font-bold uppercase rounded px-1.5 py-0.5 ${notif.type === 'error' ? 'bg-red-500/10 text-red-400' : notif.type === 'warning' ? 'bg-amber-500/10 text-amber-450' : notif.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                      {notif.type}
                    </span>
                    <span>{notif.timestamp}</span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-200">{notif.title}</h4>
                    <p className="text-slate-400 text-[11px] leading-relaxed">{notif.description}</p>
                  </div>

                  {/* Actions associated with the notified desk */}
                  {notif.deskId && <div className="flex justify-end gap-2 pt-2 border-t border-slate-900 font-mono text-[10px]">
                      <button onClick={() => {
                const simpleId = notif.deskId?.replace('Desk #', 'D-') || '';
                if (simpleId && confirm(`Force clear occupancy on ${notif.deskId}? This releases the desk.`)) {
                  adminForceRelease(simpleId);
                  alert(`Cleared ${notif.deskId}`);
                }
              }} className="text-red-400 hover:text-red-300 font-bold transition cursor-pointer">
                        FORCE CLEAR SEAT
                      </button>
                    </div>}
                </div>)}
          </div>
        </div>

      </div>
    </div>;
};