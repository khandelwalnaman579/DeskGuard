/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSpace } from '../hooks/useSpace';
import { BarChart, Users, Map, Clock, Settings, LogOut, Menu, X, Trash2, Zap, Server, BarChart3 } from 'lucide-react';
import { PageTransition } from '../components/PageTransition';
export const AdminLayout = ({
  children
}) => {
  const {
    user,
    logout
  } = useAuth();
  const {
    desks
  } = useSpace();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const adminMenu = [{
    name: 'Dashboard',
    path: '/admin-dashboard',
    icon: BarChart
  }, {
    name: 'Analytics Reports',
    path: '/admin-reports',
    icon: BarChart3
  }, {
    name: 'Blueprint map',
    path: '/admin-floor-map',
    icon: Map
  }, {
    name: 'Manage Students',
    path: '/admin-students',
    icon: Users
  }, {
    name: 'Live Sessions',
    path: '/admin-live-sessions',
    icon: Clock
  }, {
    name: 'Desk Settings',
    path: '/admin-desk-management',
    icon: Settings
  }, {
    name: 'Abandoned Desks',
    path: '/admin-abandoned-desks',
    icon: Trash2
  }];

  // Count abandoned desks
  const abandonedCount = desks.filter(d => d.status === 'Away' || d.lastActivityText.toLowerCase().includes('abandoned')).length;
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  return <div className="min-h-screen flex bg-[#0c101c] font-sans tracking-normal text-slate-100">
      {/* Sidebar Panel */}
      <aside className="hidden md:flex flex-col w-64 bg-[#111625] border-r border-slate-800">
        {/* Brand */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <Zap size={20} className="fill-current text-amber-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight leading-none flex items-center gap-1.5">
              DeskGuard
              <span className="text-[10px] bg-amber-500/10 text-amber-400 font-mono px-1.5 py-0.5 rounded border border-amber-500/25 uppercase font-bold">Admin</span>
            </h1>
            <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">Portal Console</span>
          </div>
        </div>

        {/* Navigation Grid */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {adminMenu.map(item => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          const isAbandoned = item.name === 'Abandoned Desks' && abandonedCount > 0;
          return <Link key={item.path} to={item.path} className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all ${active ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10 font-semibold' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'}`}>
                <div className="flex items-center gap-3">
                  <Icon size={18} />
                  <span>{item.name}</span>
                </div>
                {isAbandoned && <span className="bg-amber-550/20 text-amber-300 font-mono text-[10px] px-2 py-0.5 rounded-full border border-amber-500/20 animate-pulse">
                    {abandonedCount}
                  </span>}
              </Link>;
        })}
        </nav>

        {/* Global Dev Actions */}
        <div className="p-4 mx-4 my-2 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Server size={14} className="text-slate-500 animate-pulse" />
            <span className="font-mono tracking-wider uppercase text-[10px]">Mock API server</span>
          </div>
          <div className="space-y-1 text-slate-500 font-mono text-[11px]">
            <p>Database: <span className="text-emerald-400">localStorage</span></p>
            <p>Active Res: <span className="text-indigo-400">{desks.filter(d => d.status === 'Occupied').length} Desks</span></p>
          </div>
          <button onClick={() => navigate('/system-maintenance')} className="w-full text-center py-1.5 bg-slate-800 hover:bg-slate-755 hover:text-amber-400 text-[10px] font-mono font-bold uppercase rounded text-slate-300 transition cursor-pointer">
            Trigger Maintenance
          </button>
        </div>

        {/* User profile segment */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-3">
            <img src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"} alt="Admin Avatar" className="w-9 h-9 rounded-full border-2 border-slate-700 object-cover" referrerPolicy="no-referrer" />
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate text-slate-100">{user?.name || 'Administrator'}</p>
              <p className="text-[10px] text-indigo-400 font-mono font-medium tracking-wide">SYSTEM OPERATOR</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 hover:bg-red-950/20 rounded-lg border border-slate-850 hover:border-red-905/30 transition cursor-pointer">
            <LogOut size={13} className="text-slate-500" />
            <span>Sign Out Operator</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header and Navigation */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between h-16 px-6 bg-[#111625] text-slate-100 border-b border-slate-850">
          <div className="flex items-center gap-2">
            <Zap size={18} className="fill-current text-amber-400" />
            <span className="font-bold tracking-tight text-white text-base">DeskGuard <span className="text-[10px] text-amber-400 ml-1">ADM</span></span>
          </div>

          <div className="flex items-center gap-3">
            {abandonedCount > 0 && <span className="bg-amber-500 w-2.5 h-2.5 rounded-full animate-ping" />}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1 rounded bg-slate-800 border border-slate-700 text-slate-300 hover:text-white">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </header>

        {/* Mobile Navigation Dropdown */}
        {mobileOpen && <nav className="md:hidden bg-[#111625] border-b border-indigo-950/30 text-white px-6 py-4 space-y-3">
            {adminMenu.map(item => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)} className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition ${active ? 'bg-indigo-650 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-850'}`}>
                  <div className="flex items-center gap-3">
                    <Icon size={16} />
                    <span>{item.name}</span>
                  </div>
                </Link>;
        })}
            
            <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-850 rounded-lg">
              <LogOut size={16} />
              <span>Sign Out Panel</span>
            </button>
          </nav>}

        {/* Main Console Frame */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>;
};