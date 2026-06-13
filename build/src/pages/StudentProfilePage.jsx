/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Award, Shield } from 'lucide-react';
export const StudentProfilePage = () => {
  const {
    user
  } = useAuth();

  // Peak Hours Dummy block metrics
  const peakHours = [{
    hour: '08:00 AM',
    value: 35,
    label: 'Low occupancy'
  }, {
    hour: '10:00 AM',
    value: 78,
    label: 'High study load'
  }, {
    hour: '12:00 PM',
    value: 92,
    label: 'Peak occupancy'
  }, {
    hour: '02:00 PM',
    value: 65,
    label: 'Average'
  }, {
    hour: '04:00 PM',
    value: 85,
    label: 'High load'
  }, {
    hour: '06:00 PM',
    value: 50,
    label: 'Low occupancy'
  }];
  return <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8 selection:bg-indigo-150">
      
      {/* Page Title */}
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Student Study Profile</h2>
        <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">
          Personal academic credentials and performance monitoring indices
        </p>
      </div>

      {/* Grid: Left bio credentials, Right graph and activities */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Bio Grid Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center space-y-6 shadow-sm">
            
            {/* Avatar block with badge */}
            <div className="relative inline-block">
              <img src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop"} alt="Profile Avatar" className="w-28 h-28 rounded-full border-4 border-indigo-50 shadow-md mx-auto object-cover" referrerPolicy="no-referrer" />
              <span className="absolute bottom-1 right-2 bg-indigo-600 text-white rounded-full p-1.5 shadow border-2 border-white">
                <Award size={15} />
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-slate-900">{user?.name || 'Alex Johnston'}</h3>
              <p className="text-xs text-slate-400 font-mono">{user?.studentId || 'UG-882910'}</p>
              
              <span className="inline-block bg-indigo-50 border border-indigo-200 text-indigo-805 font-medium text-[10px] uppercase font-mono px-2.5 py-1 rounded mt-1">
                {user?.department || 'Computer Science & AI'}
              </span>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-3.5 text-xs text-left">
              
              <div className="flex justify-between items-center column">
                <span className="text-slate-405 font-medium">Compliance Trust Rating</span>
                <span className="font-bold text-emerald-650 font-mono">{user?.trustScore || 98}% Excellent</span>
              </div>
              
              <div className="flex justify-between items-center column">
                <span className="text-slate-405 font-medium">Clearance Level</span>
                <span className="font-bold text-slate-800 font-mono">Level-2 General Study</span>
              </div>

              <div className="flex justify-between items-center column">
                <span className="text-slate-405 font-medium">Primary University Mail</span>
                <span className="font-bold text-slate-700 truncate max-w-[150px] font-mono">{user?.email || 'student@university.edu'}</span>
              </div>

            </div>

          </div>

          {/* Quick Metrics stats block */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-1.5">
              <Shield size={14} className="text-indigo-400 animate-pulse" />
              Sensor Compliance Streak
            </h4>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="flex justify-between font-mono">
                <span className="text-slate-400">Total study sessions:</span>
                <span className="font-bold text-white">39</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-slate-405">Average session length:</span>
                <span className="font-bold text-white">2.8 hrs</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-slate-400">Streak counter:</span>
                <span className="font-bold text-amber-400 font-bold">12 Days</span>
              </div>
              <p className="text-[10px] text-slate-500 font-sans mt-2">Streak grows by completing reservations without inactivity alerts.</p>
            </div>
          </div>
        </div>

        {/* Right peak study graphs & timeline activities */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Custom peak study hours CSS vertical bar chart */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-950 font-mono uppercase tracking-wider">
                PEAK ANALYSIS: RESERVATION STUDY HOURS
              </h3>
              <p className="text-xs text-slate-400 mt-1">Histogram of historical seat bookings frequency by hour blocks</p>
            </div>

            {/* Graphic Bars Layout */}
            <div className="grid grid-cols-6 gap-3 pt-6 items-end min-h-[160px] bg-slate-50 p-4 border border-slate-100 rounded-xl">
              {peakHours.map((hour, idx) => <div key={idx} className="flex flex-col items-center gap-2">
                  <div className="w-full bg-slate-200 hover:bg-slate-300 rounded-md relative group transition-all" style={{
                height: `${hour.value}px`
              }}>
                    <div className="bg-indigo-600 absolute inset-x-0 bottom-0 rounded-md transition-all group-hover:bg-indigo-700" style={{
                  height: `${hour.value}%`
                }} />
                    
                    {/* Tooltip on hover */}
                    <span className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 bg-slate-950 text-white font-mono text-[9px] py-1 px-1.5 rounded shadow whitespace-nowrap pointer-events-none transition duration-150 z-10 uppercase">
                      {hour.value}% Frequency
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-450 font-mono text-center tracking-tight truncate w-full">{hour.hour.split(' ')[0]}</span>
                </div>)}
            </div>
          </div>

          {/* Timeline of recent milestone activities */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wider border-b border-slate-100 pb-3 block">
              COMPLIANCE MILESTONE HISTORY TIMELINE
            </h3>

            <div className="space-y-5 text-sm">
              
              {/* Timeline item 1 */}
              <div className="flex gap-4 relative">
                <div className="absolute left-3 top-7 bottom-0 w-0.5 bg-slate-100" />
                <div className="w-6.5 h-6.5 shrink-0 bg-amber-50 text-amber-600 rounded-full border border-amber-100 flex items-center justify-center p-1 font-bold z-10">
                  ★
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-800 text-xs">Awarded Gold Member Badge</h4>
                    <span className="text-[10px] text-indigo-650 font-mono bg-indigo-50 border border-indigo-150/40 px-1.5 rounded">Oct 24, 2023</span>
                  </div>
                  <p className="text-xs text-slate-500 font-sans leading-relaxed">
                    Maintained a flawless 98% study check-in compliance record during the winter semester midterms monitoring audit cycle.
                  </p>
                </div>
              </div>

              {/* Timeline item 2 */}
              <div className="flex gap-4 relative">
                <div className="absolute left-3 top-7 bottom-0 w-0.5 bg-slate-100" />
                <div className="w-6.5 h-6.5 shrink-0 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 flex items-center justify-center p-1.5 z-10">
                  ✓
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-800 text-xs">Trust Rating Restored to 100%</h4>
                    <span className="text-[10px] text-slate-405 font-mono">Oct 21, 2023</span>
                  </div>
                  <p className="text-xs text-slate-500 font-sans leading-relaxed">
                    Staff attendants cleared a false motion-sensor verification alert triggered on Desk #102 due to erratic battery configurations.
                  </p>
                </div>
              </div>

              {/* Timeline item 3 */}
              <div className="flex gap-4">
                <div className="w-6.5 h-6.5 shrink-0 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100 flex items-center justify-center p-1.5 z-10">
                  ⚡
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-800 text-xs">Session Completed: Desk #202</h4>
                    <span className="text-[10px] text-slate-405 font-mono">Oct 18, 2023</span>
                  </div>
                  <p className="text-xs text-slate-405 font-sans leading-relaxed">
                    Checked out completely of seat following a robust 3 hours 30 minutes silent study block. Study history records saved.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>;
};