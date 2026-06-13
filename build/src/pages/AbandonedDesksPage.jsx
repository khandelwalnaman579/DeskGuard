/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useSpace } from '../context/SpaceContext';
import { AlertTriangle } from 'lucide-react';
export const AbandonedDesksPage = () => {
  const {
    desks,
    adminForceRelease,
    startPresenceVerification
  } = useSpace();

  // Highlight desks that are Away or showing Sensor Warnings
  const idleDesks = desks.filter(d => d.status === 'Away' || d.lastActivityText.toLowerCase().includes('abandoned') || d.lastActivityText.toLowerCase().includes('idle'));
  const handleForceRelease = (deskId, name) => {
    if (confirm(`ADMIN FORCE RELEASE: Clear student "${name}" out of Desk ${deskId.replace('D-', '')}? Seat is reported unattended.`)) {
      adminForceRelease(deskId);
      alert('Desk cleared successfully.');
    }
  };
  const handleVerify = deskId => {
    startPresenceVerification();
    alert('Presence check verification deployed.');
  };
  return <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 text-slate-100 selection:bg-indigo-950 font-sans">
      
      {/* Title */}
      <div className="border-b border-slate-800 pb-5">
        <h2 className="text-2xl font-black text-white tracking-tight">Idling & Hoarding Monitor</h2>
        <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">
          Operations ledger to target abandoned study seats and enforce compliance limits
        </p>
      </div>

      {/* Info Warning */}
      <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-200 rounded-2xl flex items-start gap-3 text-xs leading-normal">
        <AlertTriangle className="text-amber-400 shrink-0 mt-0.5" size={16} />
        <div className="space-y-1">
          <h4 className="font-bold text-amber-300">Passive sensor policy active</h4>
          <p className="text-slate-400 leading-relaxed font-sans">
            Desks categorized under "Away" status must be checked back in within 20 minutes. Motion sensors flag inactive sessions automatically, routing alerts straight to this operator cockpit. Use commands to keep study channels clear.
          </p>
        </div>
      </div>

      {/* Stats Block */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        <div className="p-5 bg-[#111625] border border-slate-800 rounded-2xl space-y-1.5 shadow-sm">
          <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">IDLE OR UNATTENDED FLAGGED</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-rose-500 font-mono">{idleDesks.length}</span>
            <span className="text-xs text-slate-400">/ {desks.length} assets</span>
          </div>
          <span className="text-[10px] text-slate-500 block">Requiring operator clearance</span>
        </div>

        <div className="p-5 bg-[#111625] border border-slate-800 rounded-2xl space-y-1.5 shadow-sm">
          <span className="text-[10px] text-slate-505 font-mono block uppercase">AVERAGE SENSOR REPORT BLOCK</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-300 font-mono">14.2</span>
            <span className="text-xs text-slate-400">Minutes</span>
          </div>
          <span className="text-[10px] text-slate-505 block">Duration before operator dispatch</span>
        </div>

        <div className="p-5 bg-[#111625] border border-slate-80s rounded-2xl space-y-1.5 shadow-sm">
          <span className="text-[10px] text-slate-505 font-mono block uppercase">INCIDENTS CLEARED</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-emerald-450 font-mono">18</span>
            <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-1 rounded">Today</span>
          </div>
          <span className="text-[10px] text-slate-505 block">Seats recycled for general studies</span>
        </div>

      </div>

      {/* Main Audit List */}
      <div className="bg-[#111625] border border-slate-850 rounded-2xl shadow-md overflow-hidden">
        
        <div className="p-4 bg-slate-950/45 border-b border-slate-850 flex items-center justify-between text-xs font-mono">
          <span className="font-bold text-slate-400">Flagged idle assets registry</span>
          <span className="text-slate-500">Live operational directory</span>
        </div>

        <div className="divide-y divide-slate-850">
          {idleDesks.length === 0 ? <div className="p-10 text-center text-slate-500 font-mono text-xs">
              ★ Excellent: No study compartments are currently reported idle or hoarded!
            </div> : idleDesks.map(desk => <div key={desk.id} className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-slate-900/10 transition text-xs font-sans">
                
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-500/10 text-red-300 border border-red-500/15 text-[10px] font-bold font-mono py-0.5 px-2 rounded uppercase">
                      IDLE FLAG STATE
                    </span>
                    <h3 className="font-bold text-white text-sm">Desk Coordinate #{desk.id.replace('D-', '')}</h3>
                    <span className="text-slate-550 font-mono">• {desk.zone}</span>
                  </div>
                  
                  <p className="text-slate-400">
                    Occupying Student: <strong className="text-slate-205">{desk.studentName || 'Sarah Jenkins'}</strong> ({desk.studentId || 'UG-10292'})
                  </p>
                  <p className="text-slate-500 font-mono text-[11px]">
                    Alert category: {desk.lastActivityText} — Seated length: {desk.durationText || '2h 10m elapsed'}
                  </p>
                </div>

                <div className="flex gap-2 justify-end font-mono text-[10px]">
                  <button onClick={() => handleVerify(desk.id)} className="px-3.5 py-2 bg-slate-900 hover:bg-slate-850 text-indigo-400 font-bold uppercase rounded-lg border border-slate-800 cursor-pointer transition">
                    DEPLOY PRESENCE VERIFY
                  </button>
                  <button onClick={() => handleForceRelease(desk.id, desk.studentName || 'Sarah Jenkins')} className="px-3.5 py-2 bg-red-955 hover:bg-red-900 text-red-400 font-bold uppercase rounded-lg border border-red-900/10 cursor-pointer transition">
                    FORCE SEAT EVECT
                  </button>
                </div>

              </div>)}
        </div>

      </div>

    </div>;
};