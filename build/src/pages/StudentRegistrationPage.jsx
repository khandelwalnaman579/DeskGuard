/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, Mail, Lock, User, IdCard, AlertCircle, ArrowLeft } from 'lucide-react';
export const StudentRegistrationPage = () => {
  const navigate = useNavigate();
  const {
    registerStudent
  } = useAuth();
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Password checklist validation
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasCapital = /[A-Z]/.test(password);
  const passwordsMatch = password && password === confirmPassword;
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!name || !studentId || !email || !password) {
      setError('Please fully write all fields in the registration form.');
      return;
    }
    if (!hasMinLength || !hasNumber || !hasCapital) {
      setError('Choose a stronger password following security parameters.');
      return;
    }
    if (!passwordsMatch) {
      setError('Passwords mismatch. Retype matching strings.');
      return;
    }
    setLoading(true);
    try {
      const success = await registerStudent(name, studentId, email);
      if (success) {
        navigate('/student-dashboard');
      } else {
        setError('Database record registration failure. Change student ID.');
      }
    } catch {
      setError('Network communication failure.');
    } finally {
      setLoading(false);
    }
  };
  return <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-indigo-100">
      <div className="absolute top-4 left-4 sm:top-8 sm:left-8">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-500 hover:text-slate-805 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer">
          <ArrowLeft size={16} />
          <span>Welcome page</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="mx-auto w-12 h-12 bg-indigo-650 text-white rounded-xl flex items-center justify-center p-2 shadow-lg shadow-indigo-655/15">
          <Zap size={24} className="fill-current" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create Student Account</h2>
          <p className="text-xs text-slate-500 font-mono tracking-wide mt-1 uppercase">Enroll as dynamic library user</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 border border-slate-200/80 shadow-xl rounded-2xl sm:px-10 space-y-6">
          {error && <div className="p-3 bg-red-50 border border-red-100 text-red-900 rounded-lg flex items-start gap-2.5 text-xs font-medium animate-shake">
              <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
                Full Legal Name
              </label>
              <div className="relative">
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Alex Johnston" className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm transition outline-none" required />
                <User size={16} className="absolute left-3.5 top-3 text-slate-400" />
              </div>
            </div>

            {/* Student ID */}
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
                University Student ID
              </label>
              <div className="relative">
                <input type="text" value={studentId} onChange={e => setStudentId(e.target.value)} placeholder="UG-882910" className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm transition outline-none" required />
                <IdCard size={16} className="absolute left-3.5 top-3 text-slate-400" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
                Academic Mail Address
              </label>
              <div className="relative">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="a.johnston@university.edu" className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm transition outline-none" required />
                <Mail size={16} className="absolute left-3.5 top-3 text-slate-400" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
                Password Registration
              </label>
              <div className="relative">
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••••••••" className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm transition outline-none" required />
                <Lock size={16} className="absolute left-3.5 top-3 text-slate-400" />
              </div>

              {/* Real Password validation indicators */}
              <div className="mt-2.5 grid grid-cols-3 gap-1.5 text-[9px] font-mono uppercase tracking-wider">
                <div className="flex items-center gap-1 text-slate-400">
                  <span className={`w-1.5 h-1.5 rounded-full ${hasMinLength ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  <span>8+ Chars</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <span className={`w-1.5 h-1.5 rounded-full ${hasNumber ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  <span>1+ Number</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <span className={`w-1.5 h-1.5 rounded-full ${hasCapital ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  <span>1+ Caps</span>
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
                Confirm Security Password
              </label>
              <div className="relative">
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••••••••" className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm transition outline-none" required />
                <Lock size={16} className="absolute left-3.5 top-3 text-slate-400" />
              </div>
              {password && <div className="mt-1.5 text-[9px] font-mono tracking-wider">
                  {passwordsMatch ? <span className="text-emerald-650 flex items-center gap-1">✓ PASSWORDS MATCH</span> : <span className="text-red-500">✗ PASSWORDS DO NOT MATCH</span>}
                </div>}
            </div>

            <button type="submit" disabled={loading} className="w-full h-10 mt-3 flex items-center justify-center bg-indigo-600 hover:bg-indigo-705 text-white font-bold rounded-xl shadow-md cursor-pointer transition disabled:opacity-50">
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Enroll & Check In'}
            </button>
          </form>

          {/* Direct link to login */}
          <div className="text-center text-xs text-slate-500 border-t border-slate-100 pt-3">
            Already registered with DeskGuard?{' '}
            <Link to="/student-login" className="font-bold text-indigo-750 hover:underline">
              Sign In Instead
            </Link>
          </div>
        </div>
      </div>
    </div>;
};