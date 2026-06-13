/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useSpace } from '../context/SpaceContext';
import { Settings, X, HardDrive, ShieldAlert } from 'lucide-react';
export const AdminFloorMapPage = () => {
  const {
    desks,
    adminForceRelease,
    adminToggleDeskDisable
  } = useSpace();
  const [selectedFloor, setSelectedFloor] = useState(2);
  const [selectedZone, setSelectedZone] = useState('All');

  // Selected Desk for admin drawer
  const [targetDesk, setTargetDesk] = useState(null);
  const filteredDesks = desks.filter(desk => {
    if (desk.floor !== selectedFloor) return false;
    if (selectedZone !== 'All' && desk.zone !== selectedZone) return false;
    return true;
  });
  const handleForceRelease = () => {
    if (!targetDesk) return;
    if (confirm(`ADMIN FORCE RELEASE: Evict student from Desk #${targetDesk.id.replace('D-', '')}? This clears occupancy and restores desk to Available status.`)) {
      adminForceRelease(targetDesk.id);
      setTargetDesk(null);
      alert('Desk released successfully.');
    }
  };
  const handleToggleDisable = () => {
    if (!targetDesk) return;
    const isCurrentlyDisabled = targetDesk.status === 'Disabled';
    const confirmMsg = isCurrentlyDisabled ? `ADMIN ENABLE: Restore Desk #${targetDesk.id.replace('D-', '')} to library availability inventory?` : `ADMIN DISABLE: Put Desk #${targetDesk.id.replace('D-', '')} out of service for hardware maintenance?`;
    if (confirm(confirmMsg)) {
      adminToggleDeskDisable(targetDesk.id);
      setTargetDesk(null);
      alert('Desk status toggled successfully.');
    }
  };
  return <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 text-slate-100 selection:bg-indigo-950 font-sans">
      
      {/* Page Header */}
      <div className="border-b border-slate-800 pb-5">
        <h2 className="text-2xl font-black text-white tracking-tight">Interactive Blueprint Sheet Map</h2>
        <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">
          Real-time physical asset controller and desk occupancy layout overrides
        </p>
      </div>

      {/* Primary Layout Grid */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Filter Options & Legends */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-[#111625] border border-slate-800 p-5 rounded-2xl shadow-md space-y-6">
            
            <h3 className="text-xs font-bold uppercase font-mono text-white tracking-wider border-b border-slate-800 pb-2 flex items-center gap-2">
              <Settings size={14} className="text-indigo-400" />
              Blueprint Overrides
            </h3>

            {/* Floor Selection */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">SELECT PHYSICAL FLOOR LEVEL</span>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map(f => <button key={f} onClick={() => {
                setSelectedFloor(f);
                setTargetDesk(null);
              }} className={`py-2 text-xs font-mono font-bold rounded-lg border transition-all cursor-pointer ${selectedFloor === f ? 'bg-indigo-600 border-indigo-500 text-white shadow' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'}`}>
                    LEVEL-{f}
                  </button>)}
              </div>
            </div>

            {/* Area Zone Selection */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">FILTER BY STUDY SECTION</span>
              <div className="space-y-1.5 text-xs text-slate-400">
                {['All', 'Quiet Zone', 'Collaborative', 'Computer Lab'].map(z => <button key={z} onClick={() => {
                setSelectedZone(z);
                setTargetDesk(null);
              }} className={`w-full text-left px-3.5 py-2.5 rounded-xl transition cursor-pointer ${selectedZone === z ? 'bg-slate-950 text-indigo-400 font-bold border border-slate-800' : 'hover:bg-slate-850 hover:text-white'}`}>
                    {z === 'All' ? 'All Sections' : z}
                  </button>)}
              </div>
            </div>

          </div>

          {/* Map Legend */}
          <div className="bg-[#111625] border border-slate-800 p-5 rounded-2xl shadow-md space-y-3 text-xs">
            <h4 className="font-bold font-mono text-white tracking-wide">STATUS LEGEND</h4>
            <div className="grid grid-cols-2 gap-2.5 font-mono text-[10px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-emerald-500 border border-emerald-600 block" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-indigo-600 border border-indigo-700 block" />
                <span>Seated</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-amber-500 border border-amber-600 block animate-pulse" />
                <span>Away Mode</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-slate-650 border border-slate-700 block" />
                <span>Maintenance</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Map Sheets & Commands */}
        <div className="lg:col-span-9 space-y-6">
          <div className="bg-[#111625] border border-slate-800 rounded-2xl p-6 shadow-md space-y-6">
            
            <div className="flex justify-between items-center text-xs border-b border-slate-800 pb-3">
              <span className="font-mono text-slate-500">Live Blueprint View Level {selectedFloor}</span>
              <span className="text-slate-400">Click any desk block to open administration override dashboard</span>
            </div>

            {/* Interactive Grid Canvas */}
            <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6 md:p-10 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#202535_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

              {filteredDesks.length === 0 ? <p className="text-slate-500 text-xs py-10 font-mono text-center">No desks matching current filter configurations.</p> : <div className="w-full space-y-6 relative z-10">
                  <div className="grid md:grid-cols-2 gap-8">
                    
                    {/* Collaborative Hub */}
                    <div className="bg-[#111625]/60 border border-slate-850 p-4 rounded-xl space-y-4">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 border-b border-slate-800 pb-1">
                        <span>COLLABORATIVE HUB AREA</span>
                        <span className="bg-slate-900 px-1 rounded">COLLAB</span>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4">
                        {filteredDesks.filter(d => d.zone === 'Collaborative').map(desk => <button key={desk.id} onClick={() => setTargetDesk(desk)} className={`aspect-square sm:aspect-[4/3] rounded-lg text-xs font-mono font-semibold flex flex-col justify-center items-center border shadow-sm transition cursor-pointer ${targetDesk?.id === desk.id ? 'ring-4 ring-indigo-550 border-white' : ''} ${desk.status === 'Available' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-555 hover:bg-emerald-500/30' : desk.status === 'Occupied' ? 'bg-indigo-650/40 text-indigo-200 border-indigo-600 hover:bg-indigo-650/50' : desk.status === 'Away' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30 animate-pulse' : 'bg-slate-800/40 text-slate-500 border-slate-700/60 cursor-not-allowed'}`}>
                            <span>#{desk.id.replace('D-', '')}</span>
                            <span className="text-[8px] opacity-65 font-sans mt-0.5">{desk.status}</span>
                          </button>)}
                      </div>
                    </div>

                    {/* Silent zones */}
                    <div className="bg-[#111625]/60 border border-slate-850 p-4 rounded-xl space-y-4">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 border-b border-slate-800 pb-1">
                        <span>SILENT STUDY ZONES</span>
                        <span className="bg-slate-900 px-1 rounded">SILENT</span>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4">
                        {filteredDesks.filter(d => d.zone === 'Quiet Zone' || d.zone === 'Computer Lab').map(desk => <button key={desk.id} onClick={() => setTargetDesk(desk)} className={`aspect-square sm:aspect-[4/3] rounded-lg text-xs font-mono font-semibold flex flex-col justify-center items-center border shadow-sm transition cursor-pointer ${targetDesk?.id === desk.id ? 'ring-4 ring-indigo-550 border-white' : ''} ${desk.status === 'Available' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-555 hover:bg-emerald-500/30' : desk.status === 'Occupied' ? 'bg-indigo-650/40 text-indigo-200 border-indigo-600 hover:bg-indigo-650/50' : desk.status === 'Away' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30 animate-pulse' : 'bg-slate-800/40 text-slate-500 border-slate-700/60 cursor-not-allowed'}`}>
                            <span>#{desk.id.replace('D-', '')}</span>
                            <span className="text-[8px] opacity-65 font-sans mt-0.5">{desk.status}</span>
                          </button>)}
                      </div>
                    </div>

                  </div>
                </div>}

            </div>

            {/* Bottom administration Drawer */}
            {targetDesk && <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-indigo-650 border border-indigo-505 text-white font-mono text-xs px-2.5 py-1 rounded font-bold font-mono">
                      DESK RESOURCE #{targetDesk.id.replace('D-', '')}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {targetDesk.zone} (Level {targetDesk.floor})
                    </span>
                  </div>
                  <button onClick={() => setTargetDesk(null)} className="p-1 rounded-full text-slate-550 hover:bg-slate-900 hover:text-white cursor-pointer">
                    <X size={15} />
                  </button>
                </div>

                <div className="grid md:grid-cols-12 gap-5 text-xs font-sans items-center">
                  <div className="md:col-span-8 text-slate-400 space-y-2">
                    <p>Sensor Status: <strong className="text-white font-mono uppercase">{targetDesk.status}</strong> (Inactivity tracker: {targetDesk.lastActivityText})</p>
                    {targetDesk.status === 'Occupied' || targetDesk.status === 'Away' ? <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-[11px] leading-relaxed">
                        <p>Occupant: <strong className="text-white font-bold">{targetDesk.studentName || 'Sarah Jenkins'}</strong> ({targetDesk.studentId || '#2948102'})</p>
                        <p className="text-slate-500 mt-1">Check-in session length: {targetDesk.durationText || '2h 45m active'}</p>
                      </div> : <p className="text-[11px] text-emerald-400">Desk resource is clean and available. No active students checked in.</p>}
                  </div>

                  <div className="md:col-span-4 flex flex-col sm:flex-row gap-2.5 justify-end">
                    
                    {/* Clear occupancy button */}
                    {(targetDesk.status === 'Occupied' || targetDesk.status === 'Away') && <button onClick={handleForceRelease} className="px-4.5 py-2.5 bg-red-800 hover:bg-red-700 text-white font-bold rounded-xl transition cursor-pointer text-center text-xs flex items-center justify-center gap-1.5">
                        <ShieldAlert size={14} />
                        <span>Force Release</span>
                      </button>}

                    {/* Disable desk block */}
                    <button onClick={handleToggleDisable} className={`px-4.5 py-2.5 font-bold rounded-xl transition cursor-pointer text-center text-xs flex items-center justify-center gap-1.5 ${targetDesk.status === 'Disabled' ? 'bg-emerald-650 hover:bg-emerald-600 text-white' : 'bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800'}`}>
                      <HardDrive size={14} />
                      <span>{targetDesk.status === 'Disabled' ? 'Enable Desk' : 'Disable (Maint)'}</span>
                    </button>

                  </div>
                </div>
              </div>}

          </div>
        </div>

      </div>
    </div>;
};