/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useSpace } from '../context/SpaceContext';
import { Clock, CheckCircle, MonitorPlay } from 'lucide-react';
export const LiveSessionsPage = () => {
  const {
    desks,
    adminForceRelease,
    startPresenceVerification
  } = useSpace();

  // Search filter for active seated users
  const activeSessionsDesks = desks.filter(d => d.status === 'Occupied' || d.status === 'Away');
  const handleForceRelease = (deskId, studentName) => {
    if (confirm(`ADMIN OVERRIDE: Clear active occupancy of student "${studentName}" on Desk ${deskId.replace('D-', '')}? This releases seat immediately.`)) {
      adminForceRelease(deskId);
      alert('Seated student evicted successfully.');
    }
  };
  const handlePresenceVerification = deskId => {
    startPresenceVerification();
    alert(`Deploying: Physical presence verification prompt sent to Desk ${deskId.replace('D-', '')}.`);
  };
  return <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 text-slate-100 selection:bg-indigo-950 font-sans">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <h2 className="text-2xl font-black text-white tracking-tight">Real-Time Seated Sessions</h2>
        <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">
          Live monitoring grid of active university study reservations and physical motion sensor overrides
        </p>
      </div>

      {/* Grid: Top counts banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="p-5 bg-[#111625] border border-slate-800 rounded-2xl flex items-center gap-4.5 shadow-sm">
          <div className="p-3.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/15">
            <MonitorPlay size={20} className="animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-mono block">LIVE SEATED SESSIONS</span>
            <span className="text-2xl font-black text-white font-mono">{activeSessionsDesks.length}</span>
            <span className="text-slate-400 text-xs ml-2">Slots Active</span>
          </div>
        </div>

        <div className="p-5 bg-[#111625] border border-slate-800 rounded-2xl flex items-center gap-4.5 shadow-sm">
          <div className="p-3.5 bg-amber-500/10 text-amber-450 rounded-xl border border-amber-500/15">
            <Clock size={20} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-mono block">AWAY ENVELOPE STATIONS</span>
            <span className="text-2xl font-black text-[#fbc02d] font-mono">
              {desks.filter(d => d.status === 'Away').length}
            </span>
            <span className="text-slate-400 text-xs ml-2">Students Absent</span>
          </div>
        </div>

        <div className="p-5 bg-[#111625] border border-slate-850 rounded-2xl flex items-center gap-4.5 shadow-sm">
          <div className="p-3.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/15">
            <CheckCircle size={20} />
          </div>
          <div>
            <span className="text-[10px] text-slate-505 font-mono block">AVERAGE LOAD INDICES</span>
            <span className="text-2xl font-black text-emerald-405 font-mono">
              {desks.length > 0 ? Math.round(activeSessionsDesks.length / desks.length * 100) : 0}%
            </span>
            <span className="text-slate-400 text-xs ml-2">Total Utilization</span>
          </div>
        </div>

      </div>

      {/* Main sessions grid */}
      <div className="bg-[#111625] border border-slate-800 rounded-2xl overflow-hidden shadow-md">
        
        <div className="p-4 bg-slate-950/45 border-b border-slate-850 flex items-center justify-between text-xs font-mono">
          <span className="font-bold text-slate-400 uppercase">Live reservation monitoring</span>
          <span className="text-slate-500">Real-time database sync</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#111625] border-b border-slate-800 font-mono text-[9px] text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Desk Node</th>
                <th className="px-6 py-3.5">Seated Student</th>
                <th className="px-6 py-3.5">Student ID</th>
                <th className="px-6 py-3.5">Study Duration Elapsed</th>
                <th className="px-6 py-3.5">Sensor State</th>
                <th className="px-6 py-3.5 text-right">Operations Commands</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-350 font-sans">
              {activeSessionsDesks.length === 0 ? <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-500 font-mono">
                    Zero student slots currently seated. Direct students to book slots.
                  </td>
                </tr> : activeSessionsDesks.map(desk => <tr key={desk.id} className="hover:bg-slate-900/40 transition">
                    <td className="px-6 py-4 font-bold font-mono text-white">Desk #{desk.id.replace('D-', '')}</td>
                    <td className="px-6 py-4 font-bold text-slate-200">{desk.studentName || 'Sarah Jenkins'}</td>
                    <td className="px-6 py-4 font-mono text-slate-400">{desk.studentId || '#2948102'}</td>
                    <td className="px-6 py-4 font-mono font-bold text-indigo-400">{desk.durationText || '2h 14m'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 font-mono text-[9px] uppercase px-2 py-0.5 rounded border ${desk.status === 'Away' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-505/20'}`}>
                        <span className={`w-1 h-1 rounded-full ${desk.status === 'Away' ? 'bg-amber-500' : 'bg-emerald-555'}`} />
                        {desk.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => handlePresenceVerification(desk.id)} className="px-2.5 py-1 bg-slate-900 hover:bg-slate-850 hover:text-white border border-slate-800 rounded font-bold font-mono text-[10px] uppercase text-indigo-400 transition cursor-pointer">
                        Verify
                      </button>
                      <button onClick={() => handleForceRelease(desk.id, desk.studentName || 'Sarah Jenkins')} className="px-2.5 py-1 bg-red-955 hover:bg-red-900 border border-red-900/10 text-red-400 rounded font-bold font-mono text-[10px] uppercase transition cursor-pointer">
                        Force Clear
                      </button>
                    </td>
                  </tr>)}
            </tbody>
          </table>
        </div>

      </div>

    </div>;
};