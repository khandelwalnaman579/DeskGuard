/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpace } from '../context/SpaceContext';
import { useAuth } from '../context/AuthContext';
import { Filter, ArrowUpRight, Search, BookOpen, AlertCircle, X, Landmark, Sparkles, ZoomIn, ZoomOut, Maximize2, Radio, Layers, Compass } from 'lucide-react';
// Coordinate dictionary to place desks precisely on our library blueprints
const DESK_COORDINATES = {
  // Floor 1 (Linear silent booths)
  'D-101': {
    x: 160,
    y: 180
  },
  'D-102': {
    x: 320,
    y: 180
  },
  'D-103': {
    x: 480,
    y: 180
  },
  'D-104': {
    x: 640,
    y: 180
  },
  // Floor 2 (Left side: quiet rows, Right/Lower: collab pods)
  'D-201': {
    x: 120,
    y: 110
  },
  'D-202': {
    x: 230,
    y: 110
  },
  'D-203': {
    x: 340,
    y: 110
  },
  'D-204': {
    x: 450,
    y: 110
  },
  'D-205': {
    x: 120,
    y: 220
  },
  'D-206': {
    x: 230,
    y: 220
  },
  'D-207': {
    x: 340,
    y: 220
  },
  'D-208': {
    x: 450,
    y: 220
  },
  'D-209': {
    x: 120,
    y: 390
  },
  'D-210': {
    x: 200,
    y: 390
  },
  'D-211': {
    x: 280,
    y: 390
  },
  'D-212': {
    x: 360,
    y: 390
  },
  'D-213': {
    x: 440,
    y: 390
  },
  'D-214': {
    x: 520,
    y: 390
  },
  'D-215': {
    x: 600,
    y: 390
  },
  'D-216': {
    x: 680,
    y: 390
  },
  // Floor 3 (Computer lab desks)
  'D-304': {
    x: 240,
    y: 240
  },
  'D-310': {
    x: 560,
    y: 240
  }
};
export const FloorMapPage = () => {
  const navigate = useNavigate();
  const {
    user
  } = useAuth();

  // Destructure Space Context details
  const {
    desks: contextDesks,
    bookDesk,
    activeSession
  } = useSpace();

  // Local state copy of desks for real-time sensor updates simulation
  const [desks, setDesks] = useState([]);
  const [simulationLogStr, setSimulationLogStr] = useState('Sensors synchronized');
  const [pulseLog, setPulseLog] = useState(false);

  // Sync with context desks on load or navigation
  useEffect(() => {
    setDesks(contextDesks);
  }, [contextDesks]);

  // Filters state
  const [selectedFloor, setSelectedFloor] = useState(2);
  const [selectedZone, setSelectedZone] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Desk for booking summary sheet
  const [targetDesk, setTargetDesk] = useState(null);

  // SVG Pan & Zoom factors
  const [zoom, setZoom] = useState(1.0);
  const [panOffset, setPanOffset] = useState({
    x: 0,
    y: 0
  });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartOffset = useRef({
    x: 0,
    y: 0
  });
  const svgContainerRef = useRef(null);

  // Hover Tooltip positions & targets
  const [hoveredDesk, setHoveredDesk] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({
    x: 0,
    y: 0
  });
  const [bookingError, setBookingError] = useState(null);
  const [bookingErrorRedirect, setBookingErrorRedirect] = useState(null);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [selectedDurationOption, setSelectedDurationOption] = useState('3'); // default is 3 hours
  const [customHours, setCustomHours] = useState(1);
  const [customMinutes, setCustomMinutes] = useState(30);

  // Filter logic
  const filteredDesks = desks.filter(desk => {
    if (desk.floor !== selectedFloor) return false;
    if (selectedZone !== 'All' && desk.zone !== selectedZone) return false;
    if (selectedStatus !== 'All' && desk.status !== selectedStatus) return false;
    if (searchQuery.trim() !== '') {
      const idOnly = desk.id.replace('D-', '').toLowerCase();
      const q = searchQuery.toLowerCase();
      if (!idOnly.includes(q) && !desk.id.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  // Action handlers for zoom controls
  const handleZoomIn = () => setZoom(z => Math.min(2.5, z + 0.15));
  const handleZoomOut = () => setZoom(z => Math.max(0.6, z - 0.15));
  const handleZoomReset = () => {
    setZoom(1.0);
    setPanOffset({
      x: 0,
      y: 0
    });
  };

  // Mouse drag-to-pan handlers
  const handleMouseDown = e => {
    setIsDragging(true);
    dragStartOffset.current = {
      x: e.clientX - panOffset.x,
      y: e.clientY - panOffset.y
    };
  };
  const handleMouseMove = e => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStartOffset.current.x,
      y: e.clientY - dragStartOffset.current.y
    });
  };
  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Hover Tooltip helper positions relative to container
  const handleDeskMouseEnter = (desk, e) => {
    setHoveredDesk(desk);
    updateTooltipPos(e);
  };
  const handleDeskMouseMove = e => {
    updateTooltipPos(e);
  };
  const updateTooltipPos = e => {
    if (svgContainerRef.current) {
      const bounds = svgContainerRef.current.getBoundingClientRect();
      setTooltipPos({
        x: e.clientX - bounds.left + 15,
        y: e.clientY - bounds.top + 15
      });
    }
  };
  const handleDeskMouseLeave = () => {
    setHoveredDesk(null);
  };
  const handleBooking = () => {
    if (!user) {
      setBookingError('You must be signed in to perform desk bookings.');
      setBookingErrorRedirect('/student-login');
      return;
    }
    if (activeSession) {
      setBookingError(`You already have an active study session! Check out of Desk ${activeSession.deskId.replace('D-', '')} before booking a new one.`);
      setBookingErrorRedirect(null);
      return;
    }
    if (targetDesk) {
      setShowCheckInModal(true);
    }
  };
  const handleCheckInConfirm = () => {
    if (targetDesk) {
      let durationSeconds = 3 * 3600; // default 3h
      if (selectedDurationOption === 'custom') {
        durationSeconds = customHours * 3600 + customMinutes * 60;
      } else {
        const h = parseInt(selectedDurationOption, 10);
        if (!isNaN(h)) {
          durationSeconds = h * 3600;
        }
      }

      // Minimum duration safeguard: let's keep it at least 60 seconds
      if (durationSeconds < 60) {
        durationSeconds = 60;
      }
      bookDesk(targetDesk.id, targetDesk.floor, durationSeconds);
      setTargetDesk(null);
      setShowCheckInModal(false);
      navigate('/student-dashboard');
    }
  };

  // Real-time status simulation: Toggles status of desks to simulate active motion sensors
  useEffect(() => {
    const sensorInterval = setInterval(() => {
      if (desks.length === 0) return;

      // Randomly pick a desk to simulate sensor status change
      const randomIndex = Math.floor(Math.random() * desks.length);
      const chosenDesk = desks[randomIndex];

      // We don't want to conflict with the user's active check-in or booking!
      if (activeSession && chosenDesk.id === activeSession.deskId) return;
      const randomChance = Math.random();
      let updatedStatus = chosenDesk.status;
      let logMsg = '';
      if (chosenDesk.status === 'Available' && randomChance > 0.6) {
        updatedStatus = 'Occupied';
        chosenDesk.studentName = ['Sophia Rivera', 'Mark Taylor', 'Ethan Hunt', 'Diana Ross'][Math.floor(Math.random() * 4)];
        chosenDesk.studentId = 'STU-' + Math.floor(10000 + Math.random() * 90000);
        chosenDesk.durationText = 'Just seated';
        chosenDesk.lastActivityText = 'Active now';
        logMsg = `Sensor event: Seat #${chosenDesk.id.replace('D-', '')} registered occupancy.`;
      } else if (chosenDesk.status === 'Occupied' && randomChance > 0.7) {
        updatedStatus = 'Away';
        chosenDesk.lastActivityText = 'Away for 1m';
        logMsg = `Away trigger: Student on Seat #${chosenDesk.id.replace('D-', '')} stepped out.`;
      } else if (chosenDesk.status === 'Away' && randomChance > 0.5) {
        updatedStatus = 'Available';
        chosenDesk.studentName = undefined;
        chosenDesk.studentId = undefined;
        chosenDesk.durationText = undefined;
        chosenDesk.lastActivityText = 'Cleared just now';
        logMsg = `Re-claimed: Spot #${chosenDesk.id.replace('D-', '')} vacated.`;
      }
      if (logMsg) {
        const revisedDesks = [...desks];
        revisedDesks[randomIndex] = {
          ...chosenDesk,
          status: updatedStatus
        };
        setDesks(revisedDesks);
        setSimulationLogStr(logMsg);
        setPulseLog(true);
        setTimeout(() => setPulseLog(false), 800);
      }
    }, 7000); // Trigger a simulated update every 7 seconds

    return () => clearInterval(sensorInterval);
  }, [desks, activeSession]);

  // Color mapper helper based on desk state
  const getDeskColor = (status, id) => {
    const isSearching = searchQuery.trim() !== '' && id.replace('D-', '').includes(searchQuery.trim());
    if (isSearching) return '#f59e0b'; // Amber highlight for search

    switch (status) {
      case 'Available':
        return '#10b981';
      // Emerald
      case 'Occupied':
        return '#4f46e5';
      // Indigo
      case 'Away':
        return '#f59e0b';
      // Amber
      case 'Disabled':
        return '#94a3b8';
      // Slate
      default:
        return '#cbd5e1';
    }
  };
  return <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 selection:bg-indigo-150">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Compass className="text-indigo-600 animate-spin-slow shrink-0" size={24} />
            Interactive Spatial Maps
          </h2>
          <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">
            High Precision SVG Floor Plans & Live Active Presence Boards
          </p>
        </div>

        {activeSession && <div className="bg-indigo-50 border border-indigo-150 text-indigo-950 p-3 rounded-xl text-xs flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-650 animate-ping shrink-0" />
            <div>
              <p className="font-bold">Active Space Check-In</p>
              <p className="text-slate-500 font-mono">Seat Desk {activeSession.deskId.replace('D-', '')}</p>
            </div>
            <button onClick={() => navigate('/student-dashboard')} className="text-xs font-bold text-indigo-705 underline pl-2 cursor-pointer">
              Control Center
            </button>
          </div>}
      </div>

      {/* Grid: Filters Left, Map Canvas Right */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Filter Controls Sidebar (3 columns) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-6">
            
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Filter className="text-indigo-600" size={16} />
              <h3 className="text-xs font-bold uppercase font-mono text-slate-900 tracking-wider">
                Blueprint Filters
              </h3>
            </div>

            {/* Quick Keyword Desk Search */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Find Seat Number</span>
              <div className="relative">
                <input type="text" placeholder="e.g. 201, 310" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono outline-none focus:border-indigo-650 focus:bg-white transition" />
                <Search size={14} className="absolute left-3 top-3 text-slate-400" />
                {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-2.5 p-0.5 rounded-full hover:bg-slate-200 text-slate-450">
                    <X size={12} />
                  </button>}
              </div>
            </div>

            {/* Floor Selection (L1, L2, L3 tabs) */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">LEVEL DECK VIEW</span>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map(fl => {
                const levelDesks = desks.filter(d => d.floor === fl);
                const availableCount = levelDesks.filter(d => d.status === 'Available').length;
                return <button key={fl} onClick={() => {
                  setSelectedFloor(fl);
                  setTargetDesk(null);
                }} className={`py-2 px-1 relative rounded-lg border transition-all cursor-pointer flex flex-col items-center ${selectedFloor === fl ? 'bg-slate-900 border-slate-900 text-white shadow' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                      <span className="text-xs font-mono font-bold">L{fl}</span>
                      <span className="text-[8px] opacity-75">{availableCount} free</span>
                    </button>;
              })}
              </div>
            </div>

            {/* Area Section Filters */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">STUDY COMPARTMENTS</span>
              <div className="space-y-1 text-xs">
                {['All', 'Quiet Zone', 'Collaborative', 'Computer Lab'].map(z => <button key={z} onClick={() => {
                setSelectedZone(z);
                setTargetDesk(null);
              }} className={`w-full text-left px-3 py-2 rounded-xl border transition flex items-center justify-between cursor-pointer ${selectedZone === z ? 'bg-indigo-50 border-indigo-200 text-indigo-950 font-bold' : 'border-transparent text-slate-650 hover:bg-slate-50'}`}>
                    <span>{z === 'All' ? 'All Sections' : z}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-500 font-mono px-1.5 py-0.5 rounded">
                      {desks.filter(d => d.floor === selectedFloor && (z === 'All' || d.zone === z)).length}
                    </span>
                  </button>)}
              </div>
            </div>

            {/* Availability status Filter */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">AVAILABILITY FILTER</span>
              <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
                {['All', 'Available', 'Occupied', 'Away', 'Disabled'].map(st => <button key={st} onClick={() => {
                setSelectedStatus(st);
                setTargetDesk(null);
              }} className={`py-1 rounded text-center border transition cursor-pointer ${selectedStatus === st ? 'bg-indigo-650 border-indigo-650 text-white font-bold' : 'border-slate-100 hover:bg-slate-50 text-slate-500'}`}>
                    {st}
                  </button>)}
              </div>
            </div>

          </div>

          {/* Seat Map Legend Card */}
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm text-xs space-y-3">
            <h4 className="font-bold text-slate-900 font-mono uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <Layers size={14} className="text-slate-550" />
              MAP STATUS LEGEND
            </h4>
            <div className="grid grid-cols-2 gap-3.5 font-mono text-[10px] text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-[#10b981] border-2 border-white shadow-sm block" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-[#4f46e5] border-2 border-white shadow-sm block" />
                <span>Occupied</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-[#f59e0b] border-2 border-white shadow-sm block" />
                <span>Away Mode</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-[#94a3b8] border-2 border-white shadow-sm block" />
                <span>Out of service</span>
              </div>
            </div>
          </div>
        </div>

        {/* Flagship SVG Blueprint Canvas (9 columns) */}
        <div className="lg:col-span-9 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 md:p-6 space-y-5">
            
            {/* Live Synchronizations Banner */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 text-xs">
              <div className="flex items-center gap-2 text-slate-500 font-mono">
                <Landmark size={15} className="text-indigo-600 animate-pulse" />
                <span className="uppercase text-[11px] tracking-wider">LEVEL {selectedFloor} STRUCTURAL BLUEPRINT</span>
              </div>
              
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1 rounded-full text-[10px] font-mono text-slate-600 select-none">
                <Radio size={12} className={`text-indigo-600 ${pulseLog ? 'animate-ping' : ''}`} />
                <span className="truncate max-w-[280px]">{simulationLogStr}</span>
              </div>
            </div>

            {/* Interactive map controls bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-150">
              <div className="flex items-center gap-2">
                <button onClick={handleZoomOut} className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg transition" title="Zoom Out">
                  <ZoomOut size={16} />
                </button>
                <span className="text-xs font-mono font-bold text-slate-700 px-2 select-none">
                  {Math.round(zoom * 100)}%
                </span>
                <button onClick={handleZoomIn} className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg transition" title="Zoom In">
                  <ZoomIn size={16} />
                </button>
                <button onClick={handleZoomReset} className="p-1.5 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-650 hover:text-indigo-650 rounded-lg transition text-xs font-semibold ml-2 flex items-center gap-1" title="Reset viewport Layout">
                  <Maximize2 size={13} />
                  <span>Fit Workspace</span>
                </button>
              </div>

              <div className="text-[10px] text-slate-400 font-mono font-medium hidden sm:block">
                <span>Hold mouse & move to PAN. Wave over nodes to show telemetry details.</span>
              </div>
            </div>

            {/* Map Canvas wrapper with panning dragging bounds */}
            <div ref={svgContainerRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUpOrLeave} onMouseLeave={handleMouseUpOrLeave} className={`bg-slate-900 border border-slate-850 rounded-2xl relative overflow-hidden h-[380px] sm:h-[460px] flex items-center justify-center select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}>
              
              {/* Subtle background tech coordinates pattern */}
              <div className="absolute inset-0 bg-[#0e1322] bg-[linear-gradient(to_right,#1c2338_1px,transparent_1px),linear-gradient(to_bottom,#1c2338_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-35" />

              {filteredDesks.length === 0 ? <div className="text-center space-y-3 z-10 p-6">
                  <AlertCircle size={32} className="text-indigo-400 mx-auto animate-bounce" />
                  <p className="text-sm font-bold text-slate-200 font-mono">NO ACTIVE DESK CORRESPONDENCE</p>
                  <p className="text-xs text-slate-500 max-w-sm">
                    No results match this search queries or filter attributes on Level {selectedFloor}. Change search terms or filter tags inside Sidebar.
                  </p>
                </div> : <svg viewBox="0 0 800 500" className="h-full w-full object-contain z-10 transition-transform duration-75 origin-center pointer-events-none" style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`
            }}>
                  
                  {/* Blueprint Framework: Inner zones walls and grids */}
                  <rect x="20" y="20" width="760" height="460" rx="15" fill="none" stroke="#2a3556" strokeWidth="2.5" strokeDasharray="6 4" />
                  <line x1="400" y1="20" x2="400" y2="480" stroke="#1d273e" strokeWidth="1.5" strokeDasharray="3 3" />

                  {/* Level text and structural labeling */}
                  <text x="40" y="52" fill="#58678e" fontFamily="monospace" fontSize="13" fontWeight="900" letterSpacing="1">LEVEL 0{selectedFloor} OVERALL PLANNER</text>
                  <text x="760" y="52" textAnchor="end" fill="#58678e" fontFamily="monospace" fontSize="10" fontWeight="bold">CENTRAL LIBRARY INC</text>

                  {/* Render floor specific structural sections and rooms */}
                  {selectedFloor === 1 && <>
                      {/* Section Walls */}
                      <rect x="50" y="100" width="700" height="300" rx="10" fill="#111625" fillOpacity="0.4" stroke="#253050" strokeWidth="2" />
                      <text x="400" y="130" textAnchor="middle" fill="#506190" fontFamily="sans-serif" fontSize="13" fontWeight="bold" letterSpacing="1.5">DEEP SILENCE INDIVIDUAL SECTOR</text>
                      
                      {/* Outer Table plates for seats */}
                      <rect x="120" y="200" width="80" height="15" rx="3" fill="#1e293b" stroke="#334155" />
                      <rect x="280" y="200" width="80" height="15" rx="3" fill="#1e293b" stroke="#334155" />
                      <rect x="440" y="200" width="80" height="15" rx="3" fill="#1e293b" stroke="#334155" />
                      <rect x="600" y="200" width="80" height="15" rx="3" fill="#1e293b" stroke="#334155" />
                    </>}

                  {selectedFloor === 2 && <>
                      {/* Floor 2 architectural dividers */}
                      <rect x="40" y="75" width="460" height="200" rx="10" fill="#111625" fillOpacity="0.5" stroke="#232d4b" strokeWidth="1.5" />
                      <text x="270" y="93" textAnchor="middle" fill="#4d5f8f" fontFamily="sans-serif" fontSize="11" fontWeight="extrabold" letterSpacing="1">SILENT CABINS ZONE</text>

                      {/* Floor 2 bottom collaborative pod bounds */}
                      <rect x="40" y="310" width="720" height="145" rx="10" fill="#111625" fillOpacity="0.5" stroke="#232d4b" strokeWidth="1.5" />
                      <text x="400" y="328" textAnchor="middle" fill="#4d5f8f" fontFamily="sans-serif" fontSize="11" fontWeight="extrabold" letterSpacing="1">COLLABORATIVE STUDY BENCHES</text>
                      
                      {/* Walkway Divider lines */}
                      <line x1="40" y1="290" x2="760" y2="290" stroke="#1d273e" strokeWidth="3" strokeDasharray="14 8" />
                      <text x="400" y="294" textAnchor="middle" fill="#323f64" fontFamily="monospace" fontSize="8" fontWeight="bold" letterSpacing="3">CENTRAL WALKWAY ACCESS CHANNEL</text>
                    </>}

                  {selectedFloor === 3 && <>
                      {/* Floor 3 Lab architectural layout */}
                      <rect x="100" y="90" width="600" height="320" rx="12" fill="#111625" fillOpacity="0.6" stroke="#242f4f" strokeWidth="2.5" />
                      <text x="400" y="125" textAnchor="middle" fill="#546695" fontFamily="sans-serif" fontSize="15" fontWeight="bold" letterSpacing="1.5">INTEGRATED COMPUTER HARDWARE LAB</text>
                      
                      {/* Interactive round tables inside computer lab */}
                      <circle cx="240" cy="270" r="45" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                      <circle cx="560" cy="270" r="45" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                    </>}

                  {/* Draw each filtered desk node */}
                  {filteredDesks.map(desk => {
                const coord = DESK_COORDINATES[desk.id];
                if (!coord) return null;
                const color = getDeskColor(desk.status, desk.id);
                const isSelected = targetDesk?.id === desk.id;
                const isPulsing = desk.status === 'Away' || isSelected;
                const isSearching = searchQuery.trim() !== '' && desk.id.replace('D-', '').includes(searchQuery.trim());
                return <g key={desk.id} className="pointer-events-auto cursor-pointer"
                // Trigger hover tooltip on group
                onMouseEnter={e => handleDeskMouseEnter(desk, e)} onMouseMove={handleDeskMouseMove} onMouseLeave={handleDeskMouseLeave} onClick={() => setTargetDesk(desk)}>
                        {/* Selected Pulsing background aura */}
                        {isPulsing && <circle cx={coord.x} cy={coord.y} r={isSelected ? 26 : 21} fill={color} fillOpacity="0.12" className="animate-ping" style={{
                    animationDuration: '2.5s'
                  }} />}

                        {/* Search Highlight Pulsing Ring */}
                        {isSearching && <circle cx={coord.x} cy={coord.y} r="28" fill="none" stroke="#f59e0b" strokeWidth="1.5" className="animate-pulse" />}

                        {/* Desk seat rounded outer plate */}
                        <circle cx={coord.x} cy={coord.y} r={isSelected ? 19 : 15} fill={isSelected ? '#1e1b4b' : '#111827'} stroke={isSelected ? '#c7d2fe' : '#2d3748'} strokeWidth={isSelected ? '2.5' : '1.5'} className="transition-all duration-300" />

                        {/* Status glowing internal light circle */}
                        <circle cx={coord.x} cy={coord.y - 4} r="4" fill={color} className={desk.status === 'Away' ? 'animate-pulse' : ''} />

                        {/* Text Label index */}
                        <text x={coord.x} y={coord.y + 11} textAnchor="middle" fill={isSelected ? '#ffffff' : '#94a3b8'} fontSize="9" fontWeight="black" fontFamily="monospace">
                          {desk.id.replace('D-', '')}
                        </text>
                      </g>;
              })}

                </svg>}

              {/* Precise mouse-floating Hover Tooltip over Canvas */}
              {hoveredDesk && <div className="absolute bg-[#161d31] border border-slate-75 * border-slate-800 p-3.5 rounded-xl text-xs text-slate-100 z-50 pointer-events-none shadow-2xl space-y-1.5 transition-all text-left duration-75 max-w-[210px]" style={{
              left: `${tooltipPos.x}px`,
              top: `${tooltipPos.y}px`
            }}>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <span className="font-mono font-bold text-white uppercase tracking-wide">SEAT #{hoveredDesk.id.replace('D-', '')}</span>
                    <span className={`text-[9px] font-mono px-1 rounded uppercase ${hoveredDesk.status === 'Available' ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/20' : hoveredDesk.status === 'Away' ? 'bg-amber-950/30 text-amber-300 border border-amber-500/20' : hoveredDesk.status === 'Occupied' ? 'bg-indigo-900/30 text-indigo-300 border border-indigo-500/25' : 'bg-slate-900 text-slate-400'}`}>
                      {hoveredDesk.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400">Section: <strong>{hoveredDesk.zone}</strong></p>
                  
                  {hoveredDesk.status === 'Occupied' && <div className="space-y-0.5 text-[11px] border-t border-slate-800/40 pt-1.5 mt-1 text-slate-350">
                      <p>Occupant: <strong className="text-white">{hoveredDesk.studentName}</strong></p>
                      <p>Duration: <span className="font-mono text-[10px] bg-slate-800 px-1 rounded">{hoveredDesk.durationText || 'Active'}</span></p>
                    </div>}

                  {hoveredDesk.status === 'Away' && <div className="space-y-0.5 text-[11px] text-amber-305">
                      <p>Claim: {hoveredDesk.studentName}</p>
                      <p className="text-[10px] bg-amber-950/20 text-amber-300 border border-amber-950/30 px-1 rounded inline-block mt-0.5 font-mono">{hoveredDesk.lastActivityText}</p>
                    </div>}

                  {hoveredDesk.status === 'Available' && <p className="text-[10px] text-emerald-400 font-medium">Click block to book instantly &rarr;</p>}

                  {hoveredDesk.status === 'Disabled' && <p className="text-[10px] text-red-400 font-mono italic">Under maintenance</p>}
                </div>}

            </div>

            {/* Bottom detail sheet drawer triggered upon click selection */}
            {targetDesk && <div className="bg-slate-50 border border-indigo-100 rounded-2xl p-5 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-indigo-100/50 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-indigo-650 text-white font-mono text-xs px-2.5 py-1 rounded font-bold">
                      DESK #{targetDesk.id.replace('D-', '')}
                    </span>
                    <span className="text-xs font-bold text-slate-805 font-sans">
                      {targetDesk.zone} (Level {targetDesk.floor})
                    </span>
                  </div>
                  <button onClick={() => setTargetDesk(null)} className="p-1 rounded-full text-slate-450 hover:bg-slate-200 hover:text-slate-700 cursor-pointer">
                    <X size={15} />
                  </button>
                </div>

                <div className="grid sm:grid-cols-12 gap-4 text-xs font-sans items-center">
                  <div className="sm:col-span-8 text-slate-600 space-y-1.5">
                    <p>Status: <strong className="text-slate-800">{targetDesk.status}</strong> (Sensor description: {targetDesk.lastActivityText})</p>
                    {targetDesk.status === 'Occupied' && <p>Currently occupied by: <strong className="text-white bg-slate-800 px-1.5 py-0.5 rounded font-mono text-[11px]">{targetDesk.studentName}</strong> (Continuous timer {targetDesk.durationText || '0m'})</p>}
                    {targetDesk.status === 'Available' ? <p className="text-[11px] text-emerald-700 flex items-center gap-1">
                        <Sparkles size={11} className="animate-pulse" />
                        This study seat is clean, verified, and available. Booking will reserve the seat and start focus tracking.
                      </p> : <p className="text-[11px] text-amber-700">Currently unavailable for bookings.</p>}
                  </div>

                  <div className="sm:col-span-4 flex justify-end">
                    {targetDesk.status === 'Available' ? <button onClick={handleBooking} className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-705 text-white font-bold rounded-xl shadow transition cursor-pointer font-sans">
                        Book Desk Now
                        <ArrowUpRight size={15} />
                      </button> : <button disabled className="w-full sm:w-auto bg-slate-200 text-slate-400 border border-slate-300 font-bold px-5 py-2.5 rounded-xl cursor-not-allowed">
                        Locked
                      </button>}
                  </div>
                </div>
              </div>}

           </div>
         </div>
 
       </div>

      {showCheckInModal && targetDesk && <div id="checkin-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 max-w-sm w-full space-y-5 shadow-2xl text-center">
            <div className="mx-auto w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
              <BookOpen size={22} className="text-indigo-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-900 font-sans">Confirm Seat Booking</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-sans font-medium">
                Are you sure you want to book <strong className="text-slate-800 font-extrabold font-sans">Desk #{targetDesk.id.replace('D-', '')}</strong> on Level {targetDesk.floor} ({targetDesk.zone})?
              </p>
            </div>

            {/* Session Duration Selector */}
            <div className="space-y-3 pt-3 text-left border-y border-slate-100 py-3">
              <label id="session-duration-select-label" className="text-xs font-bold text-slate-700 block font-mono uppercase tracking-wider">
                Select Session Time
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {['1', '2', '3', '4'].map(hoursStr => <button key={hoursStr} type="button" id={`duration-opt-${hoursStr}`} onClick={() => setSelectedDurationOption(hoursStr)} className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition text-center cursor-pointer ${selectedDurationOption === hoursStr ? 'bg-indigo-50 border-indigo-600 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                    {hoursStr} hr{hoursStr !== '1' ? 's' : ''}
                  </button>)}
              </div>
              <div className="flex gap-1.5">
                <button type="button" id="duration-opt-custom" onClick={() => setSelectedDurationOption('custom')} className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition text-center cursor-pointer ${selectedDurationOption === 'custom' ? 'bg-indigo-50 border-indigo-600 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                  Custom Limit
                </button>
              </div>

              {selectedDurationOption === 'custom' && <div id="custom-duration-container" className="flex items-center gap-2 pt-1 animate-fadeIn">
                  <div className="flex-1 space-y-1">
                    <span className="text-[10px] text-slate-500 font-bold font-mono block">HOURS</span>
                    <input type="number" id="custom-hours-input" min="0" max="24" value={customHours} onChange={e => setCustomHours(Math.max(0, Math.min(24, parseInt(e.target.value) || 0)))} className="w-full p-2 text-xs border border-slate-200 rounded-lg text-center font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                  </div>
                  <div className="text-slate-400 font-bold pt-4">:</div>
                  <div className="flex-1 space-y-1">
                    <span className="text-[10px] text-slate-500 font-bold font-mono block">MINUTES</span>
                    <input type="number" id="custom-minutes-input" min="0" max="59" value={customMinutes} onChange={e => setCustomMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))} className="w-full p-2 text-xs border border-slate-200 rounded-lg text-center font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                  </div>
                </div>}
            </div>

            <div className="flex gap-3 pt-1">
              <button id="cancel-checkin-btn" onClick={() => setShowCheckInModal(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer">
                Cancel
              </button>
              <button id="confirm-checkin-btn" onClick={handleCheckInConfirm} className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-md shadow-indigo-600/10">
                Confirm & Check In
              </button>
            </div>
          </div>
        </div>}

     {bookingError && <div id="booking-validation-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
         <div className="bg-white border border-slate-200/80 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center">
           <div className="mx-auto w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
             <AlertCircle size={22} />
           </div>
           <div className="space-y-2">
             <h3 className="text-base font-bold text-slate-900 font-sans">Booking Blocked</h3>
             <p className="text-xs text-slate-500 leading-relaxed font-sans">
               {bookingError}
             </p>
           </div>
           <button id="close-booking-error-btn" onClick={() => {
          const redirect = bookingErrorRedirect;
          setBookingError(null);
          setBookingErrorRedirect(null);
          if (redirect) {
            navigate(redirect);
          }
        }} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-md shadow-indigo-600/10">
             OK, Understood
           </button>
         </div>
       </div>}
   </div>;
};