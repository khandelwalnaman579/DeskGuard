/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
export const AdminLoginPage = () => {
  const navigate = useNavigate();
  const {
    login
  } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Provide operator console registry email.');
      return;
    }
    setLoading(true);
    try {
      const success = await login(email, 'admin');
      if (success) {
        navigate('/admin-dashboard');
      } else {
        setError('Incorrect administrator credentials.');
      }
    } catch {
      setError('Console login failure occurred.');
    } finally {
      setLoading(false);
    }
  };
  const handleAdminDemo = async () => {
    setLoading(true);
    setError('');
    try {
      const success = await login('admin@university.edu', 'admin');
      if (success) {
        navigate('/admin-dashboard');
      }
    } catch {
      setError('Error signing into admin accounts.');
    } finally {
      setLoading(false);
    }
  };
  return <div className="min-h-screen bg-[#0c101c] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative text-slate-100 selection:bg-indigo-900">
      <div className="absolute top-4 left-4 sm:top-8 sm:left-8">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-400 hover:text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer">
          <ArrowLeft size={16} />
          <span>General Portal</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="mx-auto w-12 h-12 bg-indigo-600 border border-indigo-400 text-white rounded-xl flex items-center justify-center p-2 shadow-lg shadow-indigo-650/40">
          <ShieldCheck size={24} className="text-amber-300 fill-current" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">System Operator</h2>
          <p className="text-xs text-slate-500 font-mono tracking-wide mt-1 uppercase">DeskGuard Admin Deck</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#111625] py-8 px-6 border border-slate-800 shadow-2xl rounded-2xl sm:px-10 space-y-6">
          {error && <div className="p-3 bg-red-950/45 border border-red-900 text-red-200 rounded-lg flex items-start gap-2.5 text-xs font-medium">
              <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">
                Operator Security Email
              </label>
              <div className="relative">
                <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@university.edu" className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-indigo-600 focus:bg-slate-950 text-white rounded-xl text-sm transition outline-none" />
                <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">
                Admin Console Password
              </label>
              <div className="relative">
                <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••••••••" className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-indigo-600 focus:bg-slate-950 text-white rounded-xl text-sm transition outline-none" />
                <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full h-11 flex items-center justify-center bg-indigo-650 hover:bg-indigo-600 text-white font-bold rounded-xl border border-indigo-500/20 cursor-pointer shadow-md shadow-indigo-605/10 transition disabled:opacity-50">
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Initialize Console'}
            </button>
          </form>

          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-slate-800 w-full" />
            <span className="absolute bg-[#111625] px-3 text-[10px] text-slate-500 font-mono tracking-wider uppercase">Or testing bypass</span>
          </div>

          <button onClick={handleAdminDemo} disabled={loading} className="w-full h-11 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-850 hover:text-amber-300 text-slate-200 border border-slate-800 font-bold rounded-xl cursor-pointer shadow transition">
            <ArrowRight size={16} className="text-amber-400 animate-pulse" />
            <span>Admin Demo Bypass</span>
          </button>

          <div className="text-center text-xs text-slate-500 font-mono">
            Secure admin clearance level authorized.
          </div>
        </div>
      </div>
    </div>;
};