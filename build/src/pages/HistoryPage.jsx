/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useSpace } from '../context/SpaceContext';
import { Search, HelpCircle, ArrowUpRight, FileSpreadsheet, Calendar } from 'lucide-react';
export const HistoryPage = () => {
  const {
    bookingLogs
  } = useSpace();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Filter logs based on inputs
  const filteredLogs = bookingLogs.filter(log => {
    const matchesSearch = log.deskId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  return <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 selection:bg-indigo-150">
      
      {/* Title */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Study Seat Log Logs</h2>
          <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">
            Historic university seat utilization history
          </p>
        </div>
        
        {/* Export / Report button */}
        <button onClick={() => alert('Exporting study record statement as CSV... (Simulated)')} className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-805 text-white text-xs font-bold rounded-xl shadow cursor-pointer transition">
          <FileSpreadsheet size={14} className="text-emerald-400" />
          <span>Export Study History CSV</span>
        </button>
      </div>

      {/* Analytics stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm space-y-1.5">
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">TOTAL BOOKINGS</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900 font-mono">42</span>
            <span className="text-[10px] text-emerald-600 font-mono font-bold">+5 this week</span>
          </div>
          <p className="text-[11px] text-slate-500">Completed study reservations</p>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm space-y-1.5">
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">HOURS STUDIED</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-indigo-650 font-mono">128.5</span>
            <span className="text-xs text-slate-450 font-mono">Hours</span>
          </div>
          <p className="text-[11px] text-slate-450">Focused study time logged</p>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm space-y-1.5">
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">FAVORITE ZONE</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-slate-800 truncate block">Quiet Zone B</span>
          </div>
          <p className="text-[11px] text-slate-500">Floor 2 silent sections</p>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm space-y-1.5">
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">COMPLETION RATE</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-emerald-650 font-mono">94%</span>
            <span className="text-[10px] bg-emerald-550/15 text-emerald-700 px-1.5 py-0.5 rounded font-bold font-mono">Excellent</span>
          </div>
          <p className="text-[11px] text-slate-500">Low percentage canceled or missed</p>
        </div>

      </div>

      {/* Main Table Interface */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
        
        {/* Search / filter control subbar */}
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center text-xs">
          
          <div className="relative w-full max-w-sm">
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search by desk coordinate (e.g. Desk #205)" className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-600 transition text-xs" />
            <Search className="absolute left-3.5 top-2.5 text-slate-405" size={14} />
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
            <span className="font-mono text-slate-405 text-[11px] uppercase tracking-wider">Status filter:</span>
            <div className="flex gap-1.5">
              {['All', 'Completed', 'Cancelled'].map(st => <button key={st} onClick={() => setStatusFilter(st)} className={`px-3 py-1.5 rounded-lg border transition cursor-pointer ${statusFilter === st ? 'bg-slate-900 border-slate-900 text-white font-bold' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'}`}>
                  {st}
                </button>)}
            </div>
          </div>

        </div>

        {/* Dense Logs Grid list */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-50 border-b border-slate-100 font-mono text-[10px] text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Desk Coordinate</th>
                <th className="px-6 py-3.5">Study Date</th>
                <th className="px-6 py-3.5">Check-In</th>
                <th className="px-6 py-3.5">Check-Out</th>
                <th className="px-6 py-3.5">Duration Seated</th>
                <th className="px-6 py-3.5">Status Check</th>
                <th className="px-6 py-3.5 text-right">Activity logs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLogs.length === 0 ? <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-slate-400">
                    No study reservation logs found matching criteria.
                  </td>
                </tr> : filteredLogs.map(log => <tr key={log.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-bold text-slate-900">{log.deskId}</td>
                    <td className="px-6 py-4 flex items-center gap-1.5">
                      <Calendar size={13} className="text-slate-400 mb-0.5" />
                      <span>{log.date}</span>
                    </td>
                    <td className="px-6 py-4 font-mono">{log.checkIn}</td>
                    <td className="px-6 py-4 font-mono">{log.checkOut}</td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-800">{log.duration}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 font-mono text-[9px] uppercase px-2 py-0.5 rounded font-bold ${log.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-800 border border-emerald-500/25' : 'bg-red-500/10 text-red-800 border border-red-500/25'}`}>
                        <span className={`w-1 h-1 rounded-full ${log.status === 'Completed' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => alert(`Reviewing technical audit file: log log ID #${log.id}`)} className="text-xs font-bold text-indigo-650 hover:underline cursor-pointer">
                        Audit Details
                      </button>
                    </td>
                  </tr>)}
            </tbody>
          </table>
        </div>

      </div>

      {/* Missing Logs contextual block instructions */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between text-xs font-sans">
        <div className="flex gap-3">
          <div className="bg-indigo-50 p-2 rounded-xl text-indigo-705 mt-0.5 shrink-0">
            <HelpCircle size={18} />
          </div>
          <div className="space-y-1 max-w-2xl text-slate-600">
            <h4 className="font-bold text-slate-950 text-xs">Missing a study log record session?</h4>
            <p className="leading-relaxed leading-normal">
              If an automatic seat clear evicted your seat because of failure to check in on presence verification, you can file a request to administration to manually restore study block metrics. Include timestamp details.
            </p>
          </div>
        </div>

        <button onClick={() => alert('Summoning desk coordinator contact form...')} className="w-full md:w-auto inline-flex items-center justify-center gap-1.5 px-4.5 py-2.5 bg-white hover:bg-slate-100 text-slate-705 border border-slate-205 font-bold rounded-xl transition cursor-pointer">
          <span>Contact Coordinator</span>
          <ArrowUpRight size={14} />
        </button>
      </div>

    </div>;
};