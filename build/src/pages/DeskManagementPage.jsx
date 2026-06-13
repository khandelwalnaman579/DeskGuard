/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useSpace } from '../context/SpaceContext';
import { PlusCircle, AlertTriangle, X } from 'lucide-react';
export const DeskManagementPage = () => {
  const {
    desks,
    adminToggleDeskDisable,
    addActivityNotification
  } = useSpace();
  const [selectedZone, setSelectedZone] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Register state
  const [registerOpen, setRegisterOpen] = useState(false);
  const [newDeskId, setNewDeskId] = useState('');
  const [newFloor, setNewFloor] = useState(2);
  const [newZone, setNewZone] = useState('Quiet Zone');

  // Filter logic
  const filteredDesks = desks.filter(d => {
    const matchesZone = selectedZone === 'All' || d.zone === selectedZone;
    const matchesStatus = selectedStatus === 'All' || d.status === selectedStatus;
    return matchesZone && matchesStatus;
  });
  const handleRegisterDesk = e => {
    e.preventDefault();
    if (!newDeskId) {
      alert('Provide desk asset number.');
      return;
    }
    const compiledDeskId = `D-${newDeskId}`;

    // Check duplication
    if (desks.find(d => d.id === compiledDeskId)) {
      alert('This desk coordinate already exists in DeskGuard database registry.');
      return;
    }

    // Since we write to mockData localStorage, we can append to db directly
    const currentList = JSON.parse(localStorage.getItem('deskguard_desks') || '[]');
    const newDeskObj = {
      id: compiledDeskId,
      floor: newFloor,
      zone: newZone,
      status: 'Available',
      lastActivityText: 'Ready (Registered just now)'
    };
    currentList.push(newDeskObj);
    localStorage.setItem('deskguard_desks', JSON.stringify(currentList));
    addActivityNotification(`New Desk Asset Registered: ${compiledDeskId}`, `Added desk coordinate Level ${newFloor} [${newZone}] for immediate student seating.`, 'success', compiledDeskId);
    setNewDeskId('');
    setRegisterOpen(false);
    alert('New study seat directory compiled successfully. Reload page or action map to view.');
    window.location.reload(); // Force full local state reload safely
  };
  const handleMassDisable = () => {
    if (confirm('GLOBAL EMERGENCY CONTROL: Put all Collaborative Section desks out of service for socket engineering? This evicts any seated students immediately.')) {
      const currentList = JSON.parse(localStorage.getItem('deskguard_desks') || '[]');
      const updated = currentList.map(d => {
        if (d.zone === 'Collaborative') {
          return {
            ...d,
            status: 'Disabled',
            studentName: undefined,
            studentId: undefined,
            lastActivityText: 'Out of service'
          };
        }
        return d;
      });
      localStorage.setItem('deskguard_desks', JSON.stringify(updated));
      addActivityNotification('Mass Disable Deployed: Collaborative Zones', 'Administrator flagged all Collab Hub desks out of service.', 'error');
      alert('Section disabled. Local repository updated.');
      window.location.reload();
    }
  };
  return <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 text-slate-100 selection:bg-indigo-950 font-sans">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-white tracking-tight">Seat Inventory Asset Registry</h2>
          <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">
            Operator settings for physical desk registration, mantenimiento lockouts, and bulk actions
          </p>
        </div>

        <div className="flex gap-2.5">
          <button onClick={handleMassDisable} className="px-4.5 py-2.5 bg-red-955 hover:bg-red-900 text-red-300 font-bold text-xs rounded-xl flex items-center gap-1.5 border border-red-900/10 transition cursor-pointer">
            <AlertTriangle size={15} />
            <span>Disable Collab Hub</span>
          </button>

          <button onClick={() => setRegisterOpen(true)} className="px-4.5 py-2.5 bg-indigo-650 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer">
            <PlusCircle size={15} />
            <span>Add Desk Coordinate</span>
          </button>
        </div>
      </div>

      {/* Main Panel */}
      <div className="bg-[#111625] border border-slate-800 rounded-2xl shadow-md p-6 space-y-6">
        
        {/* Filter bars */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center text-xs pb-4 border-b border-slate-800">
          <div className="flex flex-wrap gap-4">
            
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Zone</span>
              <select value={selectedZone} onChange={e => setSelectedZone(e.target.value)} className="px-3.5 py-2 bg-slate-900 border border-slate-800 outline-none focus:border-indigo-650 rounded-xl text-slate-300 font-sans cursor-pointer">
                <option value="All">All Sections</option>
                <option value="Quiet Zone">Quiet Zone Areas</option>
                <option value="Collaborative">Collaborative Hub</option>
                <option value="Computer Lab">Computer Labs</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Battery Check</span>
              <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} className="px-3.5 py-2 bg-slate-900 border border-slate-800 outline-none focus:border-indigo-650 rounded-xl text-slate-300 font-sans cursor-pointer">
                <option value="All">All Statuses</option>
                <option value="Available">Available</option>
                <option value="Occupied">Seated</option>
                <option value="Away">Away Mode</option>
                <option value="Disabled">Maintenance</option>
              </select>
            </div>

          </div>

          <span className="text-slate-505 font-mono text-[10px] uppercase">Showing {filteredDesks.length} assets</span>
        </div>

        {/* Inventory list block */}
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {filteredDesks.map(desk => <div key={desk.id} className="p-4 bg-slate-950/85 border border-slate-900 rounded-xl space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="font-bold text-white text-sm">Asset #{desk.id.replace('D-', '')}</span>
                  <span className={`inline-block text-[9px] px-1.5 py-0.5 rounded uppercase font-black ${desk.status === 'Available' ? 'bg-emerald-500/10 text-emerald-400' : desk.status === 'Occupied' ? 'bg-indigo-500/10 text-indigo-400' : desk.status === 'Away' ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>
                    {desk.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-sans leading-none">Floor Level {desk.floor}, {desk.zone}</p>
                <p className="text-[10px] text-slate-400 font-mono truncate">Sensor: {desk.lastActivityText}</p>
              </div>

              <div className="flex justify-end gap-1.5 pt-2 border-t border-slate-900">
                <button onClick={() => {
              adminToggleDeskDisable(desk.id);
              alert(`Desk status updated for ${desk.id}`);
            }} className="px-2.5 py-1 hover:bg-slate-900 text-[10px] font-bold font-mono uppercase bg-slate-900 text-indigo-400 rounded border border-slate-800 transition cursor-pointer">
                  {desk.status === 'Disabled' ? 'Enable' : 'Disable'}
                </button>
              </div>
            </div>)}
        </div>

      </div>

      {/* Reg modal */}
      {registerOpen && <div className="fixed inset-0 bg-slate-950/75 z-50 flex items-center justify-center p-6 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#111625] border border-slate-800 w-full max-w-md rounded-2xl p-6 relative space-y-5">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Compile Study Seat Asset
              </h3>
              <button onClick={() => setRegisterOpen(false)} className="p-1 rounded text-slate-500 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleRegisterDesk} className="space-y-4 text-xs font-sans text-slate-400">
              
              <div>
                <label className="block text-[10px] font-mono uppercase block mb-1.5 text-slate-400">
                  Seat coordinate number ID (Digits only, e.g. 217)
                </label>
                <input type="text" value={newDeskId} onChange={e => setNewDeskId(e.target.value)} placeholder="217" className="w-full px-4 py-2 bg-slate-905 border border-slate-800 rounded-xl outline-none focus:border-indigo-650 text-white text-xs transition" required />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase block mb-1.5 text-slate-400">
                  Floor Level assignment
                </label>
                <select value={newFloor} onChange={e => setNewFloor(Number(e.target.value))} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-indigo-650 text-xs transition">
                  <option value={1}>Level 1 - General Library</option>
                  <option value={2}>Level 2 - Quiet Zone Areas</option>
                  <option value={3}>Level 3 - Computer Cluster</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase block mb-1.5 text-slate-400">
                  Study Section Zone selection
                </label>
                <select value={newZone} onChange={e => setNewZone(e.target.value)} className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-indigo-650 text-xs transition">
                  <option value="Quiet Zone">Quiet Zone Areas Section</option>
                  <option value="Collaborative">Collaborative Hub Section</option>
                  <option value="Computer Lab">Computer Clusters Section</option>
                </select>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <button type="button" onClick={() => setRegisterOpen(false)} className="px-4 py-2 bg-slate-900 text-slate-400 font-bold rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl">
                  Compile Seat
                </button>
              </div>

            </form>

          </div>
        </div>}

    </div>;
};