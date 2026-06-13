/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSpace } from '../hooks/useSpace';
import { BarChart2, Map, History, User, LogOut, Menu, X, Zap } from 'lucide-react';
import { PageTransition } from '../components/PageTransition';
export const StudentLayout = ({
  children
}) => {
  const {
    user,
    logout
  } = useAuth();
  const {
    activeSession
  } = useSpace();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuItems = [{
    name: 'Dashboard',
    path: '/student-dashboard',
    icon: BarChart2
  }, {
    name: 'Book a Desk',
    path: '/floor-map',
    icon: Map
  }, {
    name: 'Study History',
    path: '/study-history',
    icon: History
  }, {
    name: 'My Profile',
    path: '/student-profile',
    icon: User
  }];
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  return <div className="min-h-screen flex bg-slate-50 font-sans tracking-normal text-slate-800">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-200 border-r border-slate-800">
        {/* Brand */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <Zap size={20} className="fill-current" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight leading-none">DeskGuard</h1>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">Central Library</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {menuItems.map(item => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${active ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'}`}>
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>;
        })}
        </nav>

        {/* Direct Session Links / Warning Indicator in Sidebar */}
        {activeSession && <div className="mx-4 my-2 p-4 rounded-xl bg-slate-850 border border-slate-800/40 space-y-3">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full animate-ping ${activeSession.status === 'Verification' ? 'bg-red-500' : activeSession.status === 'Away' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
              <span className="text-[11px] font-mono font-medium text-slate-300 uppercase tracking-wider">
                Active: Desk {activeSession.deskId.replace('D-', '')}
              </span>
            </div>
            
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-400 block font-sans">Current Status:</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${activeSession.status === 'Verification' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : activeSession.status === 'Away' ? 'bg-amber-500/20 text-amber-300 border border-amber-550/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}`}>
                {activeSession.status === 'Verification' ? 'Verification Alert' : activeSession.status}
              </span>
            </div>

            <button onClick={() => {
          if (activeSession.status === 'Verification') {
            navigate('/presence-verification');
          } else if (activeSession.status === 'Away') {
            navigate('/away-mode');
          } else {
            navigate('/active-session');
          }
        }} className="w-full text-center py-2 bg-slate-800 hover:bg-slate-750 text-xs font-medium rounded-lg text-indigo-400 transition cursor-pointer">
              Control Center &rarr;
            </button>
          </div>}

        {/* User profile section */}
        <div className="p-4 border-t border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <img src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-slate-700 object-cover" referrerPolicy="no-referrer" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-[11px] text-slate-550 truncate font-mono">{user?.studentId || 'STUDENT'}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/30 hover:bg-red-950/20 rounded-lg border border-slate-800 hover:border-red-900/30 transition cursor-pointer">
            <LogOut size={14} className="text-slate-500 hover:text-red-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header and Navigation */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between h-16 px-6 bg-slate-900 text-white border-b border-slate-850">
          <div className="flex items-center gap-2">
            <Zap size={18} className="fill-current text-indigo-500" />
            <span className="font-bold tracking-tight text-white text-base">DeskGuard</span>
          </div>

          <div className="flex items-center gap-3">
            {activeSession && <span className={`w-2 h-2 rounded-full animate-ping ${activeSession.status === 'Verification' ? 'bg-red-500' : activeSession.status === 'Away' ? 'bg-amber-500' : 'bg-emerald-500'}`} />}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1 rounded bg-slate-800 border border-slate-700 text-slate-300 hover:text-white">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </header>

        {/* Mobile Navigation Dropdown */}
        {mobileOpen && <nav className="md:hidden bg-slate-900 border-b border-slate-800 text-white px-6 py-4 space-y-3">
            {menuItems.map(item => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${active ? 'bg-indigo-650 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-850'}`}>
                  <Icon size={16} />
                  <span>{item.name}</span>
                </Link>;
        })}
            
            {activeSession && <div className="p-3 bg-slate-850 rounded-lg border border-slate-800 space-y-2">
                <p className="text-xs text-slate-400">
                  Active Session: <strong className="text-indigo-400">Desk {activeSession.deskId.replace('D-', '')}</strong>
                </p>
                <button onClick={() => {
            setMobileOpen(false);
            if (activeSession.status === 'Verification') navigate('/presence-verification');else if (activeSession.status === 'Away') navigate('/away-mode');else navigate('/active-session');
          }} className="w-full text-center py-1.5 bg-indigo-650 hover:bg-indigo-600 text-xs text-white font-medium rounded transition">
                  Active Dashboard
                </button>
              </div>}

            <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-850 rounded-lg">
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </nav>}

        {/* Main Workspace Frame */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto w-full">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>;
};