/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, TrendingUp, Clock, Trash2, HelpCircle, Activity, ChevronRight, Download, RefreshCw, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, LineChart, Line, Cell } from 'recharts';
import { analyticsService } from '../services/analyticsService';
export const ReportsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [trends, setTrends] = useState([]);
  const [weekly, setWeekly] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [peakHours, setPeakHours] = useState([]);
  const [abandonedStats, setAbandonedStats] = useState([]);

  // Selected sub-tab / filter for specific logs inside analytics page
  const [activeSegment, setActiveSegment] = useState('all');
  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [trendsData, weeklyData, monthlyData, peakData, abandonedData] = await Promise.all([analyticsService.getOccupancyTrends(), analyticsService.getWeeklyUsage(), analyticsService.getMonthlyUsage(), analyticsService.getPeakHours(), analyticsService.getAbandonedDeskAnalytics()]);
      setTrends(trendsData);
      setWeekly(weeklyData);
      setMonthly(monthlyData);
      setPeakHours(peakData);
      setAbandonedStats(abandonedData);
    } catch (e) {
      console.error("Error loading mock analytics database summaries", e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Calculate high-level aggregates
  const totalWeeklyHours = weekly.reduce((sum, item) => sum + item.studyHours, 0);
  const avgOccupancy = Math.round(trends.reduce((sum, item) => sum + item.occupancyRate, 0) / (trends.length || 1));
  const totalTriggers = abandonedStats.reduce((sum, item) => sum + item.timeoutTriggerCount, 0);
  const averageTimeout = Math.round(abandonedStats.reduce((sum, item) => sum + item.averageInactivityMinutes, 0) / (abandonedStats.length || 1));

  // Custom tooltips styling for the Dark dashboard charts
  const CustomTooltip = ({
    active,
    payload,
    label
  }) => {
    if (active && payload && payload.length) {
      return <div className="bg-[#161c30] border border-slate-75 *:border-slate-800 p-3 rounded-lg text-xs shadow-xl min-w-[124px]">
          <p className="font-mono font-bold text-slate-100 mb-1">{label}</p>
          {payload.map((pld, i) => <p key={i} className="font-sans py-0.5 text-[11px]" style={{
          color: pld.color || pld.fill
        }}>
              <span className="capitalize">{pld.name.replace(/([A-Z])/g, ' $1')}: </span>
              <strong className="font-mono">{pld.value}{pld.unit || ''}</strong>
            </p>)}
        </div>;
    }
    return null;
  };
  return <div className="min-h-screen bg-[#0c101c] text-slate-100 p-6 md:p-8 space-y-8 selection:bg-indigo-900">
      
      {/* breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/60 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <button onClick={() => navigate('/admin-dashboard')} className="hover:text-indigo-400 transition">ADMINCONSOLE</button>
            <ChevronRight size={10} />
            <span className="text-slate-350">ANALYTIC_REPORTS</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <BarChart3 className="text-indigo-500" size={24} />
            Library Space Statistics & Reports
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={fetchAnalytics} className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-indigo-400 rounded-xl transition flex items-center gap-1.5 text-xs font-mono font-bold cursor-pointer">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>RE-FETCH</span>
          </button>
          
          <button onClick={() => alert("Simulating PDF download of active report. Report generated on console log successfully.")} className="px-4 py-2.5 bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold font-mono tracking-wider flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-600/10 border border-indigo-505">
            <Download size={15} />
            <span>EXPORT PDF</span>
          </button>
        </div>
      </div>

      {loading ? <div className="h-[400px] flex flex-col justify-center items-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-xs font-mono tracking-widest uppercase">Analyzing transaction logs & sensors...</p>
        </div> : <>
          {/* Key Metrics Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Metric 1 */}
            <div className="bg-[#111625] border border-slate-800/80 p-5 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 text-slate-800 leading-none">
                <TrendingUp size={44} className="opacity-15 group-hover:scale-110 transition duration-300" />
              </div>
              <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest block mb-1">AVERAGE OCCUPANCY</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-mono font-black text-white">{avgOccupancy}%</span>
                <span className="text-xs font-semibold text-emerald-400">+4.2% today</span>
              </div>
              <div className="w-full bg-[#1b2238] rounded-full h-1 mt-4">
                <div className="bg-indigo-500 h-1 rounded-full" style={{
              width: `${avgOccupancy}%`
            }} />
              </div>
            </div>

            {/* Metric 2 */}
            <div className="bg-[#111625] border border-slate-800/80 p-5 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 text-slate-800 leading-none">
                <Clock size={44} className="opacity-15 group-hover:scale-110 transition duration-300" />
              </div>
              <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest block mb-1">TOTAL STUDY HOURS</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-mono font-black text-white">{totalWeeklyHours} Hrs</span>
                <span className="text-xs font-semibold text-indigo-400">+12% vs last week</span>
              </div>
              <div className="w-full bg-[#1b2238] rounded-full h-1 mt-4">
                <div className="bg-emerald-500 h-1 rounded-full w-4/5" />
              </div>
            </div>

            {/* Metric 3 */}
            <div className="bg-[#111625] border border-slate-800/80 p-5 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 text-slate-800 leading-none">
                <Trash2 size={44} className="opacity-15 group-hover:scale-110 transition duration-300" />
              </div>
              <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest block mb-1">ABANDONED TRIGGERS</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-mono font-black text-white">{totalTriggers}</span>
                <span className="text-xs font-semibold text-red-400">-8% than avg</span>
              </div>
              <div className="w-full bg-[#1b2238] rounded-full h-1 mt-4">
                <div className="bg-amber-500 h-1 rounded-full w-[38%]" />
              </div>
            </div>

            {/* Metric 4 */}
            <div className="bg-[#111625] border border-slate-800/80 p-5 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 text-slate-800 leading-none">
                <Activity size={44} className="opacity-15 group-hover:scale-110 transition duration-300" />
              </div>
              <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest block mb-1">AVG TIMEOUT TO RE-RELEASE</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-mono font-black text-white">{averageTimeout}m</span>
                <span className="text-xs font-semibold text-indigo-400">Strict Sensor mode</span>
              </div>
              <div className="w-full bg-[#1b2238] rounded-full h-1 mt-4">
                <div className="bg-[#4f46e5] h-1 rounded-full w-[60%]" />
              </div>
            </div>
          </div>

          {/* Section: Occupancy Trends (Area Chart) */}
          <div className="bg-[#111625] border border-slate-800 rounded-2xl p-5 md:p-6 space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-805/50 pb-4">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Occupancy Rates & Live Seat Trends</h3>
                <p className="text-xs text-slate-500 font-medium">Real-time study seat density comparison chart over a 24-hour cycle</p>
              </div>
              <div className="flex gap-1.5 bg-slate-900/60 p-1 rounded-xl border border-slate-800 text-xs font-mono">
                {['all', 'collab', 'silent'].map(seg => <button key={seg} onClick={() => setActiveSegment(seg)} className={`px-3 py-1.5 rounded-lg transition-all font-bold cursor-pointer ${activeSegment === seg ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}>
                    {seg === 'all' ? 'FULL HOUSE' : seg.toUpperCase()}
                  </button>)}
              </div>
            </div>

            <div className="h-[300px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trends} margin={{
              top: 10,
              right: 10,
              left: -25,
              bottom: 0
            }}>
                  <defs>
                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.01} />
                    </linearGradient>
                    <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1c2338" />
                  <XAxis dataKey="time" stroke="#475569" fontSize={10} fontFamily="monospace" />
                  <YAxis stroke="#475569" fontSize={10} fontFamily="monospace" unit="%" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{
                fontSize: '11px',
                fontFamily: 'sans-serif',
                color: '#cbd5e1'
              }} />
                  <Area type="monotone" name="Occupancy rate" unit="%" dataKey={activeSegment === 'silent' ? item => Math.max(10, item.occupancyRate - 15) : activeSegment === 'collab' ? item => Math.min(95, item.occupancyRate + 10) : "occupancyRate"} stroke="#4338ca" fillOpacity={1} fill="url(#colorRate)" />
                  <Area type="monotone" name="Active desk allocations" dataKey={activeSegment === 'silent' ? item => Math.max(5, item.activeBookings - 6) : activeSegment === 'collab' ? item => Math.min(48, item.activeBookings + 4) : "activeBookings"} stroke="#10b981" fillOpacity={1} fill="url(#colorActive)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Row: Weekly and Monthly charts */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Weekly Usage (Stacked Columns) */}
            <div className="bg-[#111625] border border-slate-800 rounded-2xl p-5 md:p-6 space-y-4">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Weekly Utilization & Area Hours</h3>
                <p className="text-xs text-slate-500 font-medium">Daily study counts allocated between Collaborative versus Silent zones</p>
              </div>

              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weekly} margin={{
                top: 10,
                right: 10,
                left: -25,
                bottom: 0
              }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1c2338" />
                    <XAxis dataKey="day" stroke="#475569" fontSize={10} fontFamily="monospace" />
                    <YAxis stroke="#475569" fontSize={10} fontFamily="monospace" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{
                  fontSize: '11px'
                }} />
                    <Bar name="Collaborative space hours" dataKey="collabZoneHours" stackId="a" fill="#6366f1" radius={[0, 0, 0, 0]} />
                    <Bar name="Silent study zone hours" dataKey="silentZoneHours" stackId="a" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monthly Check-ins trends (Line Chart) */}
            <div className="bg-[#111625] border border-slate-800 rounded-2xl p-5 md:p-6 space-y-4">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">6-Month Enrollment & Volume Growth</h3>
                <p className="text-xs text-slate-500 font-medium">Tracking unique visitor accounts and study hours booked month-over-month</p>
              </div>

              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthly} margin={{
                top: 10,
                right: 10,
                left: -25,
                bottom: 0
              }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1c2338" />
                    <XAxis dataKey="month" stroke="#475569" fontSize={10} fontFamily="monospace" />
                    <YAxis stroke="#475569" fontSize={10} fontFamily="monospace" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{
                  fontSize: '11px'
                }} />
                    <Line type="monotone" name="Active library students" dataKey="activeStudents" stroke="#f59e0b" strokeWidth={3} dot={{
                  r: 4
                }} activeDot={{
                  r: 7
                }} />
                    <Line type="monotone" name="Total study hours logged" dataKey="totalHoursSpent" stroke="#ec4899" strokeWidth={2} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Row: Peak Times & Abandoned Diagnostics */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Peak Hours (Hour code visualization) */}
            <div className="lg:col-span-7 bg-[#111625] border border-slate-800 rounded-2xl p-5 md:p-6 space-y-4">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Peak Load Hours & High-Capacity Indicators</h3>
                <p className="text-xs text-slate-500 font-medium">Average weekly occupancy per hour with highlighted threshold overload warnings</p>
              </div>

              <div className="h-[280px] w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={peakHours} margin={{
                top: 10,
                right: 10,
                left: -25,
                bottom: 0
              }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1c2338" />
                    <XAxis dataKey="hourLabel" stroke="#475569" fontSize={9} fontFamily="monospace" />
                    <YAxis stroke="#475569" fontSize={10} fontFamily="monospace" unit="%" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar name="Avg Occupancy Rate" dataKey="averageOccupancy" radius={[4, 4, 0, 0]}>
                      {peakHours.map((entry, index) => {
                    // Highlight peak hours (>= 80%) in Red/Amber, others in regular Indigo
                    const isOverloaded = entry.averageOccupancy >= 80;
                    const isMedium = entry.averageOccupancy >= 60 && entry.averageOccupancy < 80;
                    return <Cell key={`cell-${index}`} className="transition duration-300" fill={isOverloaded ? '#ef4444' : isMedium ? '#f59e0b' : '#312e81'} />;
                  })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-wrap gap-4 items-center justify-center p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-[#ef4444] block" />
                  <span className="text-slate-450">Critical Overload (&ge;80%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-[#f59e0b] block" />
                  <span className="text-slate-450">Moderate Volume (60-79%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-[#312e81] block" />
                  <span className="text-slate-450">Optimal Quiet Space (&lt;60%)</span>
                </div>
              </div>
            </div>

            {/* Abandoned Desk Analytics (Sensor Diagnostic metrics) */}
            <div className="lg:col-span-5 bg-[#111625] border border-slate-800 rounded-2xl p-5 md:p-6 space-y-5">
              <div className="border-b border-slate-800/80 pb-3">
                <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <AlertTriangle size={17} className="text-amber-400" />
                  Abandoned Desk Analytics
                </h3>
                <p className="text-xs text-slate-550 font-medium mt-1">Sensor timeout analysis reporting seats released automatically from student absence</p>
              </div>

              <div className="space-y-4">
                {abandonedStats.map((stat, i) => <div key={i} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-indigo-400">{stat.floor.toUpperCase()} DIAGNOSTICS</span>
                      <span className="text-[10px] bg-red-950/40 text-red-300 font-mono border border-red-900/30 px-2 py-0.5 rounded">
                        {stat.timeoutTriggerCount} alerts triggered
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-mono mb-0.5">Average Inactivity</span>
                        <strong className="text-slate-200">{stat.averageInactivityMinutes} mins</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-mono mb-0.5">Staff Res. Code</span>
                        <strong className="text-slate-200">{stat.resolvedByStaffCount} manual sweeps</strong>
                      </div>
                    </div>

                    {/* Progress representation */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                        <span>Auto-released capacity</span>
                        <span>{Math.round(stat.resolvedByAutoReleaseCount / stat.timeoutTriggerCount * 100)}%</span>
                      </div>
                      <div className="w-full bg-[#1b2238] rounded-full h-1">
                        <div className="bg-amber-400 h-1 rounded-full" style={{
                    width: `${stat.resolvedByAutoReleaseCount / stat.timeoutTriggerCount * 100}%`
                  }} />
                      </div>
                    </div>
                  </div>)}
              </div>

              {/* Informative advice banner */}
              <div className="p-3.5 bg-indigo-950/20 rounded-xl border border-indigo-900/30 text-[11px] text-slate-400 font-sans leading-relaxed">
                <HelpCircle size={14} className="text-indigo-400 inline mr-1.5 shrink-0" />
                Automatic seat releases prevent seat squatting and preserve equal library opportunity. Dynamic sensing logs demonstrate Floor 2 suffers the highest count of abandoned states, justifying closer staff attendant checks during peak hours (11:00 AM - 3:00 PM).
              </div>
            </div>

          </div>

        </>}

    </div>;
};